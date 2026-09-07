// Uma Musume Tier List Maker - Data Fetcher (Node.js)
const https = require('https');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 400) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Fetching characters from https://umapyoi.net/api/v1/character/list...');
  const rawChars = await fetchJson('https://umapyoi.net/api/v1/character/list');
  console.log(`Got ${rawChars.length} characters.`);

  const charMap = {};
  const formattedChars = rawChars.map(c => {
    const thumb = c.thumb_img || (c.game_id ? `https://gametora.com/images/umamusume/characters/icons/chr_icon_${c.game_id}.png` : '');
    const item = {
      id: c.id,
      game_id: c.game_id,
      name: c.name_en || '',
      name_jp: c.name_jp || '',
      color_main: c.color_main || '#4caf50',
      color_sub: c.color_sub || '#81c784',
      image: thumb,
      icon: c.game_id ? `https://gametora.com/images/umamusume/characters/icons/chr_icon_${c.game_id}.png` : thumb,
      preferred_url: c.preferred_url || '',
      category: 'character'
    };
    if (c.game_id) charMap[c.game_id] = item;
    return item;
  });

  fs.writeFileSync(path.join(DATA_DIR, 'characters.json'), JSON.stringify(formattedChars, null, 2), 'utf8');
  console.log('Saved data/characters.json');

  console.log('\nFetching outfits from https://umapyoi.net/api/v1/outfit...');
  const rawOutfits = await fetchJson('https://umapyoi.net/api/v1/outfit');
  console.log(`Got ${rawOutfits.length} outfits.`);

  const formattedOutfits = rawOutfits.map(o => {
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

  fs.writeFileSync(path.join(DATA_DIR, 'outfits.json'), JSON.stringify(formattedOutfits, null, 2), 'utf8');
  console.log('Saved data/outfits.json');

  console.log('\nFetching support cards from https://umapyoi.net/api/v1/support...');
  const rawSupports = await fetchJson('https://umapyoi.net/api/v1/support');
  console.log(`Got ${rawSupports.length} support cards.`);

  const formattedSupports = rawSupports.map(s => {
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

  fs.writeFileSync(path.join(DATA_DIR, 'supports.json'), JSON.stringify(formattedSupports, null, 2), 'utf8');
  console.log('Saved data/supports.json');

  // Also update data.js
  const dataJsContent = `// Pre-bundled data for offline / file:// protocol compatibility\nwindow.UMA_BUNDLED_DATA = {\n  characters: ${JSON.stringify(formattedChars)},\n  outfits: ${JSON.stringify(formattedOutfits)},\n  supports: ${JSON.stringify(formattedSupports)}\n};\n`;
  fs.writeFileSync(path.join(DATA_DIR, 'data.js'), dataJsContent, 'utf8');
  console.log('Saved data/data.js');

  console.log('\nAll data bundled successfully with Node.js!');
}

run().catch(err => {
  console.error('Error fetching data:', err);
  process.exit(1);
});

