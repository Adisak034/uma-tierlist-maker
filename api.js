/**
 * Uma Musume Tier List Maker - API & Data Layer
 * Connects to https://umapyoi.net/ and handles live sync & fallback data
 */

const API_BASE = 'https://umapyoi.net/api/v1';

class UmaDataService {
  constructor() {
    this.cache = {
      characters: null,
      outfits: null,
      supports: null,
    };
    this.status = 'ready'; // 'ready' | 'loading' | 'error'
    this.lastSync = null;
    this.onUpdateAvailable = null; // Callback when new items are fetched in background
  }

  /**
   * Load data for a specific category: 'characters' | 'outfits' | 'supports'
   */
  async loadCategoryData(category) {
    if (this.cache[category]) {
      return this.cache[category];
    }

    // 1. Check LocalStorage for previously saved live API updates
    try {
      const savedLive = localStorage.getItem(`uma_live_cache_${category}`);
      if (savedLive) {
        const parsed = JSON.parse(savedLive);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.cache[category] = parsed;
          // Trigger background check for even newer items
          this.checkBackgroundUpdates(category);
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading live cache from LocalStorage:', e);
    }

    // 2. Try window.UMA_BUNDLED_DATA (fastest, works offline & on file://)
    if (window.UMA_BUNDLED_DATA && window.UMA_BUNDLED_DATA[category]) {
      this.cache[category] = window.UMA_BUNDLED_DATA[category];
      // Trigger background check for newer characters from umapyoi.net
      this.checkBackgroundUpdates(category);
      return this.cache[category];
    }

    // 3. Try local data/{category}.json
    try {
      const res = await fetch(`data/${category}.json`);
      if (res.ok) {
        const data = await res.json();
        this.cache[category] = data;
        this.checkBackgroundUpdates(category);
        return data;
      }
    } catch (e) {
      console.warn(`Local fetch for data/${category}.json failed:`, e);
    }

    // 4. Fallback: Fetch directly from umapyoi.net API
    return await this.syncFromApi(category);
  }

  /**
   * Silently checks Umapyoi.net API in background for newly added characters/cards
   */
  async checkBackgroundUpdates(category) {
    // Only run if online
    if (!navigator.onLine) return;

    try {
      const currentCount = this.cache[category] ? this.cache[category].length : 0;
      const freshData = await this.syncFromApi(category, true);
      if (freshData && freshData.length > currentCount) {
        console.log(`[Auto-Update] Found ${freshData.length - currentCount} new items for ${category}!`);
        if (this.onUpdateAvailable) {
          this.onUpdateAvailable(category, freshData.length - currentCount);
        }
      }
    } catch (e) {
      // Silent fail in background
    }
  }

  /**
   * Sync fresh data from umapyoi.net API
   */
  async syncFromApi(category = null, isBackground = false) {
    if (!isBackground) this.status = 'loading';

    try {
      if (!category || category === 'characters') {
        const charRes = await fetch(`${API_BASE}/character/list`, {
          headers: { 'Accept': 'application/json' }
        });
        if (!charRes.ok) throw new Error(`HTTP ${charRes.status}`);
        const rawChars = await charRes.json();
        this.cache.characters = rawChars.map(c => ({
          id: c.id,
          game_id: c.game_id,
          name: c.name_en || 'Unknown',
          name_jp: c.name_jp || '',
          color_main: c.color_main || '#4caf50',
          color_sub: c.color_sub || '#81c784',
          image: c.thumb_img || (c.game_id ? `https://gametora.com/images/umamusume/characters/icons/chr_icon_${c.game_id}.png` : ''),
          icon: c.game_id ? `https://gametora.com/images/umamusume/characters/icons/chr_icon_${c.game_id}.png` : c.thumb_img,
          category: 'character'
        }));
        try {
          localStorage.setItem('uma_live_cache_characters', JSON.stringify(this.cache.characters));
        } catch (e) {}
      }

      // Build char lookup for outfits and supports
      const charMap = {};
      if (this.cache.characters) {
        for (const c of this.cache.characters) {
          if (c.game_id) charMap[c.game_id] = c;
        }
      }

      if (!category || category === 'outfits') {
        const outfitRes = await fetch(`${API_BASE}/outfit`, {
          headers: { 'Accept': 'application/json' }
        });
        if (!outfitRes.ok) throw new Error(`HTTP ${outfitRes.status}`);
        const rawOutfits = await outfitRes.json();
        this.cache.outfits = rawOutfits.map(o => {
          const charInfo = charMap[o.chara_game_id] || {};
          const charaName = charInfo.name || (o.gametora ? o.gametora.split('-').slice(1).join(' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : 'Uma');
          return {
            id: o.id,
            chara_game_id: o.chara_game_id,
            title: o.title || '',
            name: `${o.title || ''} ${charaName}`.trim(),
            chara_name: charaName,
            chara_name_jp: charInfo.name_jp || '',
            gametora: o.gametora || '',
            image: `https://gametora.com/images/umamusume/characters/thumb/chara_stand_${o.chara_game_id}_${o.id}.png`,
            fallback_image: charInfo.icon || charInfo.image || '',
            category: 'outfit'
          };
        });
        try {
          localStorage.setItem('uma_live_cache_outfits', JSON.stringify(this.cache.outfits));
        } catch (e) {}
      }

      if (!category || category === 'supports') {
        const supRes = await fetch(`${API_BASE}/support`, {
          headers: { 'Accept': 'application/json' }
        });
        if (!supRes.ok) throw new Error(`HTTP ${supRes.status}`);
        const rawSupports = await supRes.json();
        this.cache.supports = rawSupports.map(s => {
          const charInfo = charMap[s.chara_id] || {};
          let charaName = charInfo.name;
          if (!charaName && s.gametora) {
            const parts = s.gametora.split('-');
            charaName = parts.slice(1).join(' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
          }
          let rarity = 'R';
          if (s.id >= 30000) rarity = 'SSR';
          else if (s.id >= 20000) rarity = 'SR';

          return {
            id: s.id,
            chara_id: s.chara_id,
            title: s.title_en || '',
            name: `${s.title_en || ''} ${charaName || ''}`.trim(),
            chara_name: charaName || 'Support Card',
            chara_name_jp: charInfo.name_jp || '',
            gametora: s.gametora || '',
            rarity: rarity,
            image: `https://gametora.com/images/umamusume/supports/support_card_s_${s.id}.png`,
            category: 'support'
          };
        });
        try {
          localStorage.setItem('uma_live_cache_supports', JSON.stringify(this.cache.supports));
        } catch (e) {}
      }

      this.lastSync = new Date();
      this.status = 'ready';
      return category ? this.cache[category] : this.cache;
    } catch (err) {
      if (!isBackground) {
        console.error('Failed to sync from Umapyoi.net API:', err);
        this.status = 'error';
      }
      if (window.UMA_BUNDLED_DATA && category && window.UMA_BUNDLED_DATA[category]) {
        this.cache[category] = window.UMA_BUNDLED_DATA[category];
        return this.cache[category];
      }
      throw err;
    }
  }
}

window.umaDataService = new UmaDataService();
