/**
 * Uma Musume Tier List Maker - Core Application Logic
 */

// Preset vibrant tier colors
const TIER_COLORS = [
  '#ff7f7f', '#ff997f', '#ffbf7f', '#ffdf7f', '#ffff7f',
  '#bfff7f', '#7fff7f', '#7fffff', '#7fbfff', '#7f7fff',
  '#ff7fff', '#ff7fbf', '#e0e0e0', '#858585'
];

// Translations Dictionary (TH / EN)
const I18N = {
  th: {
    title: 'Uma Musume Tier List Maker',
    subtitle: 'จัดอันดับตัวละคร, ชุดคอสตูม และการ์ดซัพพอร์ต',
    charsTab: '🏇 ตัวละคร',
    outfitsTab: '👗 ชุดตัวละคร',
    supportsTab: '🎴 การ์ดซัพพอร์ต',
    cardSize: '🔍 ขนาดการ์ด:',
    exportImg: '📷 ดาวน์โหลดรูป',
    addTier: '➕ เพิ่ม Tier',
    saveJson: '💾 บันทึก',
    loadJson: '📂 เปิดไฟล์',
    resetAll: '🧹 รีเซ็ต',
    addTierBottom: '➕ เพิ่มแถว Tier ใหม่',
    poolTitle: '📦 คลังที่ยังไม่ได้จัดอันดับ',
    searchPlaceholder: '🔍 ค้นหาชื่อ EN / JP / ชุด...',
    allChars: 'ม้าสาวทั้งหมด (All Characters)',
    hideLabel: 'ซ่อนชื่อ',
    showLabel: 'แสดงชื่อ',
    returnAll: '↩️ นำกลับคลัง',
    editTier: 'แก้ไขแถว Tier',
    tierNameLabel: 'ชื่อ Tier:',
    tierColorLabel: 'เลือกสีแถว:',
    cancel: 'ยกเลิก',
    save: 'บันทึก',
    quickMoveTitle: 'ย้ายการ์ดไปยัง Tier',
    quickMoveDesc: 'เลือก Tier ที่ต้องการใส่การ์ดนี้:',
    returnToPoolBtn: '📦 ส่งกลับลงคลัง (Return to Pool)',
    exportSuccess: '🎉 ส่งออกรูปภาพ Tier List สำเร็จ!',
    downloadPng: '📥 ดาวน์โหลดรูปภาพ (Download PNG)',
    copyPng: '📋 คัดลอกรูปภาพ (Copy)',
    confirmReset: 'คุณต้องการรีเซ็ต Tier List ทั้งหมดและนำการ์ดกลับเข้าคลังใช่หรือไม่?',
    confirmReturnAll: 'ต้องการนำการ์ดทั้งหมดในทุก Tier กลับลงคลังใช่หรือไม่?',
    confirmDeleteTier: 'ต้องการลบ Tier นี้ใช่หรือไม่? (การ์ดในแถวนี้จะถูกส่งกลับเข้าคลัง)',
    savedToast: '💾 บันทึกข้อมูลเรียบร้อยแล้ว',
    loadedToast: '📂 โหลด Tier List สำเร็จแล้ว',
    copiedToast: '📋 คัดลอกรูปลง Clipboard เรียบร้อยแล้ว',
    resetToast: '🧹 รีเซ็ต Tier List สำเร็จ',
    apiSyncSuccess: '🔄 ซิงค์ข้อมูลกับ Umapyoi.net สำเร็จแล้ว!',
    apiSyncError: '⚠️ ไม่สามารถเชื่อมต่อ API ได้ กำลังใช้ข้อมูลแคชแทน'
  },
  en: {
    title: 'Uma Musume Tier List Maker',
    subtitle: 'Rank Characters, Outfits, and Support Cards',
    charsTab: '🏇 Characters',
    outfitsTab: '👗 Outfits',
    supportsTab: '🎴 Support Cards',
    cardSize: '🔍 Card Size:',
    exportImg: '📷 Export Image',
    addTier: '➕ Add Tier',
    saveJson: '💾 Save',
    loadJson: '📂 Load File',
    resetAll: '🧹 Reset',
    addTierBottom: '➕ Add New Tier Row',
    poolTitle: '📦 Unranked Items Pool',
    searchPlaceholder: '🔍 Search EN / JP / Title...',
    allChars: 'All Characters',
    hideLabel: 'Hide Names',
    showLabel: 'Show Names',
    returnAll: '↩️ Return All to Pool',
    editTier: 'Edit Tier Row',
    tierNameLabel: 'Tier Name:',
    tierColorLabel: 'Tier Color:',
    cancel: 'Cancel',
    save: 'Save',
    quickMoveTitle: 'Move Card to Tier',
    quickMoveDesc: 'Select target tier for this card:',
    returnToPoolBtn: '📦 Return to Pool',
    exportSuccess: '🎉 Tier List Exported Successfully!',
    downloadPng: '📥 Download PNG Image',
    copyPng: '📋 Copy to Clipboard',
    confirmReset: 'Are you sure you want to reset all tiers and return items to pool?',
    confirmReturnAll: 'Return all ranked cards back to the pool?',
    confirmDeleteTier: 'Delete this tier? (Cards in this row will return to pool)',
    savedToast: '💾 Saved successfully',
    loadedToast: '📂 Tier List loaded successfully',
    copiedToast: '📋 Image copied to clipboard',
    resetToast: '🧹 Tier list reset',
    apiSyncSuccess: '🔄 Data synchronized with Umapyoi.net!',
    apiSyncError: '⚠️ Failed to connect to API, using cached data'
  }
};

class UmaTierListApp {
  constructor() {
    this.currentCategory = 'characters'; // 'characters' | 'outfits' | 'supports'
    this.currentLang = 'th';
    this.showLabels = true;
    this.cardSize = 84;
    
    // Data storage per category
    this.categoryData = {
      characters: { items: [], tiers: this.getDefaultTiers('characters'), pool: [] },
      outfits: { items: [], tiers: this.getDefaultTiers('outfits'), pool: [] },
      supports: { items: [], tiers: this.getDefaultTiers('supports'), pool: [] }
    };

    // Filter states
    this.filterSearch = '';
    this.filterRarity = 'all';
    this.filterChar = 'all';

    // Active modals and edit targets
    this.editingTierId = null;
    this.quickMoveItemId = null;
    this.sortableInstances = [];

    this.init();
  }

  getDefaultTiers(category = 'characters') {
    return [
      { id: `tier-${Date.now()}-1`, name: 'S', color: '#ff7f7f', items: [] },
      { id: `tier-${Date.now()}-2`, name: 'A', color: '#ffbf7f', items: [] },
      { id: `tier-${Date.now()}-3`, name: 'B', color: '#ffdf7f', items: [] },
      { id: `tier-${Date.now()}-4`, name: 'C', color: '#ffff7f', items: [] },
      { id: `tier-${Date.now()}-5`, name: 'D', color: '#bfff7f', items: [] },
    ];
  }

  async init() {
    this.bindEvents();
    this.loadSavedSettings();
    this.renderColorSwatches();

    // Register background update listener from Umapyoi.net API
    window.umaDataService.onUpdateAvailable = (category, count) => {
      this.categoryData[category].items = window.umaDataService.cache[category];
      this.populateCharacterFilter();
      this.updateBadgeCounts();
      if (category === this.currentCategory) {
        this.loadCategoryState(category);
        this.renderPool();
        this.showToast(`✨ มีข้อมูลใหม่ ${count} รายการ อัปเดตลงคลังแล้ว!`, 'success');
      }
    };

    await this.switchCategory('characters');
  }

  /* --------------------------------------------------------------------------
     Data Loading & Category Switching
     -------------------------------------------------------------------------- */
  async switchCategory(category) {
    this.currentCategory = category;
    
    // Update active tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === category);
    });

    // Toggle rarity filters (only relevant for support cards)
    const rarityGroup = document.getElementById('rarity-filter-group');
    if (category === 'supports') {
      rarityGroup.style.display = 'flex';
    } else {
      rarityGroup.style.display = 'none';
      this.filterRarity = 'all';
    }

    // Reset filters
    this.filterSearch = '';
    const searchInput = document.getElementById('pool-search');
    if (searchInput) searchInput.value = '';
    document.getElementById('btn-clear-search').style.display = 'none';

    // Load data from service
    this.updateApiStatus('loading');
    try {
      const data = await window.umaDataService.loadCategoryData(category);
      this.categoryData[category].items = data;
      this.updateApiStatus('ready');

      // Update badge counts
      this.updateBadgeCounts();

      // Populate character filter dropdown
      this.populateCharacterFilter();

      // Load saved tier configuration for this category from LocalStorage
      this.loadCategoryState(category);

      // Render the tier board and pool
      this.renderTierBoard();
      this.renderPool();

    } catch (err) {
      console.error('Failed to load category data:', err);
      this.updateApiStatus('error');
      this.showToast(I18N[this.currentLang].apiSyncError, 'info');
    }
  }

  updateBadgeCounts() {
    if (window.UMA_BUNDLED_DATA) {
      if (window.UMA_BUNDLED_DATA.characters) {
        document.getElementById('count-chars').textContent = window.UMA_BUNDLED_DATA.characters.length;
      }
      if (window.UMA_BUNDLED_DATA.outfits) {
        document.getElementById('count-outfits').textContent = window.UMA_BUNDLED_DATA.outfits.length;
      }
      if (window.UMA_BUNDLED_DATA.supports) {
        document.getElementById('count-supports').textContent = window.UMA_BUNDLED_DATA.supports.length;
      }
    }
  }

  populateCharacterFilter() {
    const select = document.getElementById('char-filter-select');
    select.innerHTML = `<option value="all">${I18N[this.currentLang].allChars}</option>`;
    
    const items = this.categoryData[this.currentCategory].items;
    const charSet = new Set();
    
    items.forEach(item => {
      const name = item.chara_name || item.name;
      if (name) charSet.add(name);
    });

    const sortedChars = Array.from(charSet).sort((a, b) => a.localeCompare(b));
    sortedChars.forEach(charName => {
      const opt = document.createElement('option');
      opt.value = charName;
      opt.textContent = charName;
      select.appendChild(opt);
    });
    this.filterChar = 'all';
    select.value = 'all';
  }

  /* --------------------------------------------------------------------------
     State Persistence (LocalStorage & JSON)
     -------------------------------------------------------------------------- */
  saveCategoryState(category = this.currentCategory) {
    const state = {
      title: document.getElementById('tierlist-title').value,
      desc: document.getElementById('tierlist-desc').value,
      tiers: this.categoryData[category].tiers.map(t => ({
        id: t.id,
        name: t.name,
        color: t.color,
        items: [...t.items]
      }))
    };
    try {
      localStorage.setItem(`uma_tierlist_${category}`, JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  loadCategoryState(category) {
    const raw = localStorage.getItem(`uma_tierlist_${category}`);
    if (raw) {
      try {
        const saved = JSON.parse(raw);
        if (saved.title) document.getElementById('tierlist-title').value = saved.title;
        if (saved.desc) document.getElementById('tierlist-desc').value = saved.desc;
        if (Array.isArray(saved.tiers) && saved.tiers.length > 0) {
          // Reconcile items
          this.categoryData[category].tiers = saved.tiers;
        }
      } catch (e) {
        console.warn('Error reading LocalStorage state:', e);
      }
    }

    // Build pool items: all items minus items currently in any tier
    const allItems = this.categoryData[category].items;
    const assignedIds = new Set();
    this.categoryData[category].tiers.forEach(t => {
      t.items.forEach(id => assignedIds.add(String(id)));
    });

    this.categoryData[category].pool = allItems
      .filter(item => !assignedIds.has(String(item.id)))
      .map(item => String(item.id));
  }

  exportToJson() {
    const fullState = {
      category: this.currentCategory,
      title: document.getElementById('tierlist-title').value,
      desc: document.getElementById('tierlist-desc').value,
      date: new Date().toISOString(),
      tiers: this.categoryData[this.currentCategory].tiers
    };
    const blob = new Blob([JSON.stringify(fullState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uma-tierlist-${this.currentCategory}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast(I18N[this.currentLang].savedToast, 'success');
  }

  importFromJson(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.category && data.category !== this.currentCategory) {
          this.switchCategory(data.category);
        }
        if (data.title) document.getElementById('tierlist-title').value = data.title;
        if (data.desc) document.getElementById('tierlist-desc').value = data.desc;
        if (Array.isArray(data.tiers)) {
          this.categoryData[this.currentCategory].tiers = data.tiers;
          this.loadCategoryState(this.currentCategory);
          this.renderTierBoard();
          this.renderPool();
          this.saveCategoryState();
          this.showToast(I18N[this.currentLang].loadedToast, 'success');
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  }

  /* --------------------------------------------------------------------------
     Rendering: Tier Board
     -------------------------------------------------------------------------- */
  renderTierBoard() {
    const board = document.getElementById('tier-board');
    board.innerHTML = '';
    
    // Destroy previous sortables
    this.sortableInstances.forEach(s => s.destroy());
    this.sortableInstances = [];

    const currentTiers = this.categoryData[this.currentCategory].tiers;

    currentTiers.forEach((tier, index) => {
      const row = document.createElement('div');
      row.className = 'tier-row';
      row.dataset.tierId = tier.id;

      // Tier Label
      const label = document.createElement('div');
      label.className = 'tier-label';
      label.textContent = tier.name;
      label.style.backgroundColor = tier.color;
      label.title = 'คลิกเพื่อแก้ไขชื่อและสีของ Tier นี้';
      label.addEventListener('click', () => this.openEditTierModal(tier.id));

      // Items Container
      const itemsContainer = document.createElement('div');
      itemsContainer.className = 'tier-items';
      itemsContainer.dataset.tierId = tier.id;

      // Populate items in this tier
      tier.items.forEach(itemId => {
        const itemObj = this.findItemById(itemId);
        if (itemObj) {
          const card = this.createCardElement(itemObj);
          itemsContainer.appendChild(card);
        }
      });

      // Controls
      const controls = document.createElement('div');
      controls.className = 'tier-row-controls';
      controls.innerHTML = `
        <button class="tier-action-btn" title="แก้ไข Tier" data-action="edit">⚙️</button>
        <button class="tier-action-btn" title="เลื่อนขึ้น" data-action="up">▲</button>
        <button class="tier-action-btn" title="เลื่อนลง" data-action="down">▼</button>
        <button class="tier-action-btn" title="ล้างการ์ดในแถวนี้" data-action="clear">🧹</button>
        <button class="tier-action-btn del" title="ลบ Tier นี้" data-action="delete">✕</button>
      `;

      controls.querySelector('[data-action="edit"]').addEventListener('click', () => this.openEditTierModal(tier.id));
      controls.querySelector('[data-action="up"]').addEventListener('click', () => this.moveTier(tier.id, -1));
      controls.querySelector('[data-action="down"]').addEventListener('click', () => this.moveTier(tier.id, 1));
      controls.querySelector('[data-action="clear"]').addEventListener('click', () => this.clearTier(tier.id));
      controls.querySelector('[data-action="delete"]').addEventListener('click', () => this.deleteTier(tier.id));

      row.appendChild(label);
      row.appendChild(itemsContainer);
      row.appendChild(controls);
      board.appendChild(row);

      // Initialize Sortable on this tier dropzone
      if (window.Sortable) {
        const sortable = new Sortable(itemsContainer, {
          group: 'uma-tier-group',
          animation: 150,
          ghostClass: 'dragging',
          onEnd: () => this.handleDragEnd()
        });
        this.sortableInstances.push(sortable);
      }
    });

    // Update capture header title
    const titleInput = document.getElementById('tierlist-title');
    document.getElementById('capture-header-title').textContent = titleInput.value || 'Uma Musume Tier List';
  }

  /* --------------------------------------------------------------------------
     Rendering: Item Pool
     -------------------------------------------------------------------------- */
  renderPool() {
    const poolContainer = document.getElementById('item-pool');
    poolContainer.innerHTML = '';

    const catData = this.categoryData[this.currentCategory];
    const poolIds = catData.pool;

    // Filter items based on search query, rarity, and character
    const q = this.filterSearch.toLowerCase().trim();
    const rarity = this.filterRarity;
    const char = this.filterChar;

    const filteredItems = poolIds
      .map(id => this.findItemById(id))
      .filter(item => {
        if (!item) return false;

        // Search Filter
        if (q) {
          const matchName = (item.name || '').toLowerCase().includes(q);
          const matchJp = (item.name_jp || '').toLowerCase().includes(q);
          const matchTitle = (item.title || '').toLowerCase().includes(q);
          const matchChara = (item.chara_name || '').toLowerCase().includes(q);
          if (!matchName && !matchJp && !matchTitle && !matchChara) return false;
        }

        // Rarity Filter (Support cards)
        if (rarity !== 'all' && item.rarity !== rarity) {
          return false;
        }

        // Character Filter
        if (char !== 'all') {
          const charName = item.chara_name || item.name;
          if (charName !== char) return false;
        }

        return true;
      });

    // Render Cards into Pool
    if (filteredItems.length === 0) {
      poolContainer.innerHTML = `<div class="empty-pool-msg">ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา</div>`;
    } else {
      const fragment = document.createDocumentFragment();
      filteredItems.forEach(item => {
        const card = this.createCardElement(item);
        fragment.appendChild(card);
      });
      poolContainer.appendChild(fragment);
    }

    // Update counter
    const countEl = document.getElementById('pool-count');
    countEl.textContent = `${filteredItems.length} / ${catData.items.length} รายการ`;

    // Initialize Sortable on pool container
    if (window.Sortable) {
      const sortable = new Sortable(poolContainer, {
        group: 'uma-tier-group',
        animation: 150,
        ghostClass: 'dragging',
        onEnd: () => this.handleDragEnd()
      });
      this.sortableInstances.push(sortable);
    }
  }

  createCardElement(item) {
    const card = document.createElement('div');
    card.className = 'uma-card';
    card.dataset.id = item.id;
    card.title = `${item.name} (${item.name_jp || item.chara_name || ''})\nคลิกเพื่อย้ายแถว`;

    // Rarity Badge
    let rarityHtml = '';
    if (item.rarity) {
      rarityHtml = `<span class="rarity-badge rarity-${item.rarity}">${item.rarity}</span>`;
    }

    // Label Caption
    const labelStyle = this.showLabels ? '' : 'display: none;';
    const displayName = item.title || item.name || '';
    const labelHtml = `<span class="uma-card-label" style="${labelStyle}">${displayName}</span>`;

    // Image with error fallback
    const fallbackSrc = item.fallback_image || (item.game_id ? `https://gametora.com/images/umamusume/characters/icons/chr_icon_${item.game_id}.png` : '');
    card.innerHTML = `
      ${rarityHtml}
      <img class="uma-card-img" src="${item.image}" alt="${item.name}" loading="lazy" 
           onerror="if (this.src !== '${fallbackSrc}') this.src = '${fallbackSrc}';">
      ${labelHtml}
    `;

    // Click to Open Quick Move Modal (for mobile and fast navigation)
    card.addEventListener('click', (e) => {
      // Prevent clicking while dragging
      if (card.classList.contains('dragging')) return;
      this.openQuickMoveModal(item.id);
    });

    return card;
  }

  findItemById(id) {
    const items = this.categoryData[this.currentCategory].items;
    return items.find(i => String(i.id) === String(id));
  }

  /* --------------------------------------------------------------------------
     Drag & Drop State Sync
     -------------------------------------------------------------------------- */
  handleDragEnd() {
    // Read DOM to sync state
    const catData = this.categoryData[this.currentCategory];

    // Read items from each tier dropzone
    catData.tiers.forEach(tier => {
      const container = document.querySelector(`.tier-items[data-tier-id="${tier.id}"]`);
      if (container) {
        const cards = container.querySelectorAll('.uma-card');
        tier.items = Array.from(cards).map(c => String(c.dataset.id));
      }
    });

    // Read items from pool
    const poolContainer = document.getElementById('item-pool');
    const poolCards = poolContainer.querySelectorAll('.uma-card');
    const currentRenderedPoolIds = new Set(Array.from(poolCards).map(c => String(c.dataset.id)));

    // Rebuild pool array: all items that are not in any tier
    const assignedIds = new Set();
    catData.tiers.forEach(t => t.items.forEach(id => assignedIds.add(String(id))));
    catData.pool = catData.items
      .map(i => String(i.id))
      .filter(id => !assignedIds.has(id));

    // Update pool counter
    document.getElementById('pool-count').textContent = `${catData.pool.length} / ${catData.items.length} รายการ`;

    // Auto save
    this.saveCategoryState();
  }

  /* --------------------------------------------------------------------------
     Tier Row Actions (Add, Delete, Move, Clear, Edit)
     -------------------------------------------------------------------------- */
  addNewTier(atTop = false) {
    const currentTiers = this.categoryData[this.currentCategory].tiers;
    const randomColor = TIER_COLORS[Math.floor(Math.random() * TIER_COLORS.length)];
    const newTier = {
      id: `tier-${Date.now()}`,
      name: 'NEW',
      color: randomColor,
      items: []
    };

    if (atTop) {
      currentTiers.unshift(newTier);
    } else {
      currentTiers.push(newTier);
    }

    this.renderTierBoard();
    this.saveCategoryState();
    this.openEditTierModal(newTier.id);
  }

  moveTier(tierId, direction) {
    const currentTiers = this.categoryData[this.currentCategory].tiers;
    const idx = currentTiers.findIndex(t => t.id === tierId);
    if (idx < 0) return;

    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= currentTiers.length) return;

    const [moved] = currentTiers.splice(idx, 1);
    currentTiers.splice(newIdx, 0, moved);

    this.renderTierBoard();
    this.saveCategoryState();
  }

  clearTier(tierId) {
    const currentTiers = this.categoryData[this.currentCategory].tiers;
    const tier = currentTiers.find(t => t.id === tierId);
    if (!tier || tier.items.length === 0) return;

    // Return items to pool
    tier.items = [];
    this.loadCategoryState(this.currentCategory);
    this.renderTierBoard();
    this.renderPool();
    this.saveCategoryState();
  }

  deleteTier(tierId) {
    const currentTiers = this.categoryData[this.currentCategory].tiers;
    if (currentTiers.length <= 1) {
      alert('ต้องมีอย่างน้อย 1 Tier ในกระดานครับ');
      return;
    }

    if (!confirm(I18N[this.currentLang].confirmDeleteTier)) return;

    const idx = currentTiers.findIndex(t => t.id === tierId);
    if (idx >= 0) {
      currentTiers.splice(idx, 1);
      this.loadCategoryState(this.currentCategory);
      this.renderTierBoard();
      this.renderPool();
      this.saveCategoryState();
    }
  }

  /* --------------------------------------------------------------------------
     Modals: Tier Edit & Quick Move
     -------------------------------------------------------------------------- */
  openEditTierModal(tierId) {
    this.editingTierId = tierId;
    const currentTiers = this.categoryData[this.currentCategory].tiers;
    const tier = currentTiers.find(t => t.id === tierId);
    if (!tier) return;

    const inputName = document.getElementById('input-tier-name');
    inputName.value = tier.name;

    const customColor = document.getElementById('input-tier-custom-color');
    customColor.value = tier.color;

    // Highlight selected swatch
    document.querySelectorAll('.color-swatch-item').forEach(sw => {
      sw.classList.toggle('active', sw.dataset.color.toLowerCase() === tier.color.toLowerCase());
    });

    document.getElementById('tier-modal').classList.add('open');
    inputName.focus();
  }

  closeEditTierModal() {
    document.getElementById('tier-modal').classList.remove('open');
    this.editingTierId = null;
  }

  saveEditTierModal() {
    if (!this.editingTierId) return;
    const currentTiers = this.categoryData[this.currentCategory].tiers;
    const tier = currentTiers.find(t => t.id === this.editingTierId);
    if (tier) {
      const name = document.getElementById('input-tier-name').value.trim();
      const color = document.getElementById('input-tier-custom-color').value;
      tier.name = name || 'Tier';
      tier.color = color;
      this.renderTierBoard();
      this.saveCategoryState();
    }
    this.closeEditTierModal();
  }

  renderColorSwatches() {
    const container = document.getElementById('color-swatches');
    container.innerHTML = '';
    TIER_COLORS.forEach(c => {
      const item = document.createElement('div');
      item.className = 'color-swatch-item';
      item.style.backgroundColor = c;
      item.dataset.color = c;
      item.addEventListener('click', () => {
        document.querySelectorAll('.color-swatch-item').forEach(sw => sw.classList.remove('active'));
        item.classList.add('active');
        document.getElementById('input-tier-custom-color').value = c;
      });
      container.appendChild(item);
    });

    document.getElementById('input-tier-custom-color').addEventListener('input', (e) => {
      document.querySelectorAll('.color-swatch-item').forEach(sw => sw.classList.remove('active'));
    });
  }

  /* Quick Move Modal */
  openQuickMoveModal(itemId) {
    this.quickMoveItemId = String(itemId);
    const item = this.findItemById(itemId);
    if (!item) return;

    document.getElementById('quick-move-card-name').textContent = `ย้าย: ${item.title || item.name}`;
    const tiersList = document.getElementById('quick-move-tiers-list');
    tiersList.innerHTML = '';

    const currentTiers = this.categoryData[this.currentCategory].tiers;
    currentTiers.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'quick-move-btn';
      btn.style.backgroundColor = t.color;
      btn.textContent = t.name;
      btn.addEventListener('click', () => {
        this.moveItemToTier(this.quickMoveItemId, t.id);
        this.closeQuickMoveModal();
      });
      tiersList.appendChild(btn);
    });

    document.getElementById('quick-move-modal').classList.add('open');
  }

  closeQuickMoveModal() {
    document.getElementById('quick-move-modal').classList.remove('open');
    this.quickMoveItemId = null;
  }

  moveItemToTier(itemId, targetTierId) {
    const catData = this.categoryData[this.currentCategory];
    
    // Remove item from any existing tier or pool
    catData.tiers.forEach(t => {
      t.items = t.items.filter(id => String(id) !== String(itemId));
    });
    catData.pool = catData.pool.filter(id => String(id) !== String(itemId));

    // Add to target tier
    if (targetTierId) {
      const target = catData.tiers.find(t => t.id === targetTierId);
      if (target) target.items.push(String(itemId));
    } else {
      // Returned to pool
      catData.pool.unshift(String(itemId));
    }

    this.renderTierBoard();
    this.renderPool();
    this.saveCategoryState();
  }

  /* --------------------------------------------------------------------------
     Image Export via html2canvas
     -------------------------------------------------------------------------- */
  async exportImage() {
    const captureArea = document.getElementById('tier-capture-area');
    if (!window.html2canvas) {
      alert('ไลบรารี html2canvas กำลังโหลด กรุณาลองใหม่อีกครั้ง');
      return;
    }

    this.showToast('📷 กำลังสร้างรูปภาพ Tier List...', 'info');

    try {
      const canvas = await html2canvas(captureArea, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#121316',
        scale: 2, // High resolution retina scale
        logging: false
      });

      const previewContainer = document.getElementById('export-preview-container');
      previewContainer.innerHTML = '';
      
      const img = new Image();
      img.src = canvas.toDataURL('image/png');
      img.style.maxWidth = '100%';
      img.style.borderRadius = '4px';
      img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
      previewContainer.appendChild(img);

      const downloadBtn = document.getElementById('btn-download-img');
      const filename = `uma-tierlist-${this.currentCategory}-${Date.now()}.png`;
      downloadBtn.href = img.src;
      downloadBtn.download = filename;

      // Copy button
      const copyBtn = document.getElementById('btn-copy-img');
      copyBtn.onclick = async () => {
        try {
          canvas.toBlob(async (blob) => {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            this.showToast(I18N[this.currentLang].copiedToast, 'success');
          });
        } catch (e) {
          alert('เบราว์เซอร์นี้ไม่รองรับการคัดลอกรูปลงคลิปบอร์ดโดยตรง กรุณากดปุ่มดาวน์โหลดแทนครับ');
        }
      };

      document.getElementById('export-modal').classList.add('open');
      this.showToast(I18N[this.currentLang].exportSuccess, 'success');
    } catch (err) {
      console.error('Failed to export image:', err);
      alert('เกิดข้อผิดพลาดในการสร้างรูปภาพ กรุณาลองใหม่อีกครั้ง');
    }
  }

  /* --------------------------------------------------------------------------
     Localization (TH / EN)
     -------------------------------------------------------------------------- */
  toggleLanguage() {
    this.currentLang = this.currentLang === 'th' ? 'en' : 'th';
    document.getElementById('lang-indicator').textContent = this.currentLang.toUpperCase();
    this.applyLanguage();
    localStorage.setItem('uma_tierlist_lang', this.currentLang);
  }

  applyLanguage() {
    const t = I18N[this.currentLang];
    document.getElementById('txt-subtitle').textContent = t.subtitle;
    document.getElementById('tab-characters').querySelector('span:first-child').textContent = t.charsTab;
    document.getElementById('tab-outfits').querySelector('span:first-child').textContent = t.outfitsTab;
    document.getElementById('tab-supports').querySelector('span:first-child').textContent = t.supportsTab;
    document.getElementById('btn-export-img').querySelector('span').textContent = t.exportImg;
    document.getElementById('btn-add-tier-top').querySelector('span').textContent = t.addTier;
    document.getElementById('btn-save-json').querySelector('span').textContent = t.saveJson;
    document.getElementById('btn-load-json').querySelector('span').textContent = t.loadJson;
    document.getElementById('btn-reset-all').querySelector('span').textContent = t.resetAll;
    document.getElementById('btn-add-tier-bottom').textContent = t.addTierBottom;
    document.getElementById('txt-pool-title').textContent = t.poolTitle;
    document.getElementById('pool-search').placeholder = t.searchPlaceholder;
    document.getElementById('txt-label-toggle').textContent = this.showLabels ? t.hideLabel : t.showLabel;
    document.getElementById('btn-return-all').querySelector('span').textContent = t.returnAll;
    document.getElementById('txt-modal-edit-tier').textContent = t.editTier;
    document.getElementById('txt-label-tier-name').textContent = t.tierNameLabel;
    document.getElementById('txt-label-tier-color').textContent = t.tierColorLabel;
    document.getElementById('btn-cancel-tier-modal').textContent = t.cancel;
    document.getElementById('btn-save-tier-modal').textContent = t.save;
    document.getElementById('btn-quick-move-pool').textContent = t.returnToPoolBtn;
    document.getElementById('btn-download-img').textContent = t.downloadPng;
    document.getElementById('btn-copy-img').textContent = t.copyPng;
    this.populateCharacterFilter();
  }

  /* --------------------------------------------------------------------------
     UI Utility Methods
     -------------------------------------------------------------------------- */
  updateApiStatus(state) {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    dot.className = `status-dot ${state === 'loading' ? 'loading' : state === 'error' ? 'error' : ''}`;
    if (state === 'loading') {
      text.textContent = 'กำลังเชื่อมต่อ Umapyoi.net...';
    } else if (state === 'error') {
      text.textContent = 'ใชัข้อมูลแคช (Offline)';
    } else {
      text.textContent = 'Umapyoi.net พร้อมใช้งาน';
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  loadSavedSettings() {
    const savedLang = localStorage.getItem('uma_tierlist_lang');
    if (savedLang && (savedLang === 'th' || savedLang === 'en')) {
      this.currentLang = savedLang;
      document.getElementById('lang-indicator').textContent = this.currentLang.toUpperCase();
      this.applyLanguage();
    }
  }

  /* --------------------------------------------------------------------------
     Event Bindings
     -------------------------------------------------------------------------- */
  bindEvents() {
    // Mode Switcher Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.category;
        if (cat !== this.currentCategory) {
          this.switchCategory(cat);
        }
      });
    });

    // Language Toggle
    document.getElementById('btn-lang-toggle').addEventListener('click', () => this.toggleLanguage());

    // API Sync Button
    document.getElementById('btn-sync-api').addEventListener('click', async () => {
      this.updateApiStatus('loading');
      this.showToast('🔄 กำลังดึงข้อมูลล่าสุดจาก umapyoi.net...', 'info');
      try {
        await window.umaDataService.syncFromApi(this.currentCategory);
        this.updateApiStatus('ready');
        this.showToast(I18N[this.currentLang].apiSyncSuccess, 'success');
        this.switchCategory(this.currentCategory);
      } catch (e) {
        this.updateApiStatus('error');
        this.showToast(I18N[this.currentLang].apiSyncError, 'info');
      }
    });

    // Tier Title change
    const titleInput = document.getElementById('tierlist-title');
    titleInput.addEventListener('input', () => {
      document.getElementById('capture-header-title').textContent = titleInput.value || 'Uma Musume Tier List';
      this.saveCategoryState();
    });

    document.getElementById('tierlist-desc').addEventListener('input', () => {
      this.saveCategoryState();
    });

    // Card Zoom Slider
    const zoomSlider = document.getElementById('card-zoom-slider');
    zoomSlider.addEventListener('input', (e) => {
      const size = e.target.value;
      document.documentElement.style.setProperty('--current-card-size', `${size}px`);
    });

    // Add Tier Buttons
    document.getElementById('btn-add-tier-top').addEventListener('click', () => this.addNewTier(true));
    document.getElementById('btn-add-tier-bottom').addEventListener('click', () => this.addNewTier(false));

    // Save & Load JSON
    document.getElementById('btn-save-json').addEventListener('click', () => this.exportToJson());
    const fileInput = document.getElementById('file-input-json');
    document.getElementById('btn-load-json').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.importFromJson(e.target.files[0]);
        e.target.value = '';
      }
    });

    // Reset All Tiers Button
    document.getElementById('btn-reset-all').addEventListener('click', () => {
      if (confirm(I18N[this.currentLang].confirmReset)) {
        this.categoryData[this.currentCategory].tiers = this.getDefaultTiers(this.currentCategory);
        this.loadCategoryState(this.currentCategory);
        this.renderTierBoard();
        this.renderPool();
        this.saveCategoryState();
        this.showToast(I18N[this.currentLang].resetToast, 'info');
      }
    });

    // Return all to pool button
    document.getElementById('btn-return-all').addEventListener('click', () => {
      if (confirm(I18N[this.currentLang].confirmReturnAll)) {
        this.categoryData[this.currentCategory].tiers.forEach(t => t.items = []);
        this.loadCategoryState(this.currentCategory);
        this.renderTierBoard();
        this.renderPool();
        this.saveCategoryState();
      }
    });

    // Search Input
    const searchInput = document.getElementById('pool-search');
    const clearSearchBtn = document.getElementById('btn-clear-search');
    searchInput.addEventListener('input', (e) => {
      this.filterSearch = e.target.value;
      clearSearchBtn.style.display = this.filterSearch ? 'block' : 'none';
      this.renderPool();
    });
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      this.filterSearch = '';
      clearSearchBtn.style.display = 'none';
      this.renderPool();
    });

    // Rarity Filters
    document.querySelectorAll('#rarity-filter-group .pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#rarity-filter-group .pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterRarity = btn.dataset.rarity;
        this.renderPool();
      });
    });

    // Character Filter Dropdown
    document.getElementById('char-filter-select').addEventListener('change', (e) => {
      this.filterChar = e.target.value;
      this.renderPool();
    });

    // Toggle Card Labels
    document.getElementById('btn-toggle-labels').addEventListener('click', () => {
      this.showLabels = !this.showLabels;
      document.querySelectorAll('.uma-card-label').forEach(lbl => {
        lbl.style.display = this.showLabels ? 'block' : 'none';
      });
      document.getElementById('txt-label-toggle').textContent = this.showLabels ? I18N[this.currentLang].hideLabel : I18N[this.currentLang].showLabel;
    });

    // Export Image Button
    document.getElementById('btn-export-img').addEventListener('click', () => this.exportImage());

    // Tier Modal Close & Save
    document.getElementById('btn-close-tier-modal').addEventListener('click', () => this.closeEditTierModal());
    document.getElementById('btn-cancel-tier-modal').addEventListener('click', () => this.closeEditTierModal());
    document.getElementById('btn-save-tier-modal').addEventListener('click', () => this.saveEditTierModal());

    // Quick Move Modal Close & Return to pool
    document.getElementById('btn-close-quick-move').addEventListener('click', () => this.closeQuickMoveModal());
    document.getElementById('btn-quick-move-pool').addEventListener('click', () => {
      if (this.quickMoveItemId) {
        this.moveItemToTier(this.quickMoveItemId, null);
      }
      this.closeQuickMoveModal();
    });

    // Export Modal Close
    document.getElementById('btn-close-export-modal').addEventListener('click', () => {
      document.getElementById('export-modal').classList.remove('open');
    });

    // Close Modals on Backdrop Click
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('open');
      }
    });
  }
}

// Start Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.umaTierApp = new UmaTierListApp();
});

