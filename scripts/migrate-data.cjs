const fs = require('fs');
const path = require('path');

// Read the HTML file and extract JavaScript data
const htmlPath = '/tmp/web3-upgrades/backup/index.html';
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

// Extract upgrades array
const upgradesMatch = htmlContent.match(/const upgrades = ([\s\S]*?);\s*const eipDetails/);
if (!upgradesMatch) {
  console.error('Could not find upgrades array');
  process.exit(1);
}

// Extract eipDetails object
const eipDetailsMatch = htmlContent.match(/const eipDetails = ([\s\S]*?);\s*function renderTimeline/);
if (!eipDetailsMatch) {
  console.error('Could not find eipDetails object');
  process.exit(1);
}

let upgrades, eipDetails;

try {
  upgrades = eval('(' + upgradesMatch[1] + ')');
} catch (e) {
  console.error('Failed to parse upgrades:', e.message);
  process.exit(1);
}

try {
  eipDetails = eval('(' + eipDetailsMatch[1] + ')');
} catch (e) {
  console.error('Failed to parse eipDetails:', e.message);
  process.exit(1);
}

console.log(`Found ${upgrades.length} upgrades`);
console.log(`Found ${Object.keys(eipDetails).length} EIP details`);

// Base output directory
const baseDir = '/tmp/web3-upgrades/data/ethereum';

// Ensure base directory exists
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// Helper: slugify upgrade name
function slugifyUpgrade(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper: slugify feature name for non-EIP features
function slugifyFeature(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-\u4e00-\u9fa5]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper: get feature directory name
function getFeatureDirName(feature) {
  if (feature.eip) {
    return feature.eip.toLowerCase();
  }
  return slugifyFeature(feature.name);
}

// Helper: parse EIP number from EIP string
function parseEipNumber(eipStr) {
  const match = eipStr.match(/EIP-(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

// Chinese name mapping for upgrades (best effort)
const upgradeNameZhMap = {
  'Frontier': '前沿',
  'Frontier Thawing': '前沿解冻',
  'Homestead': '家园',
  'DAO Fork': 'DAO 分叉',
  'Tangerine Whistle': '橘子哨',
  'Spurious Dragon': '伪龙',
  'Byzantium': '拜占庭',
  'Constantinople': '君士坦丁堡',
  'Petersburg': '圣彼得堡',
  'Istanbul': '伊斯坦布尔',
  'Muir Glacier': '缪尔冰川',
  'Berlin': '柏林',
  'London': '伦敦',
  'Arrow Glacier': '箭形冰川',
  'Gray Glacier': '灰色冰川',
  'The Merge (Paris)': '合并（巴黎）',
  'Shanghai': '上海',
  'Cancun-Deneb (Dencun)': '坎昆-德内布（登村）',
  'Prague-Electra (Pectra)': '布拉格-埃莱克特拉（佩克特拉）',
  'Fulu-Osaka (Fusaka)': '富鲁-大阪（富萨卡）',
};

// Process each upgrade
upgrades.forEach((upgrade, upgradeIndex) => {
  const upgradeId = slugifyUpgrade(upgrade.name);
  const upgradeDir = path.join(baseDir, upgradeId);

  // Create upgrade directory
  if (!fs.existsSync(upgradeDir)) {
    fs.mkdirSync(upgradeDir, { recursive: true });
  }

  // Build upgrade _meta.json
  const upgradeMeta = {
    id: upgradeId,
    name: upgrade.name,
    nameZh: upgradeNameZhMap[upgrade.name] || upgrade.name,
    date: upgrade.date,
    blockNumber: upgrade.block,
    type: upgrade.type,
    icon: upgrade.icon,
    summary: upgrade.desc,
    summaryZh: upgrade.desc,
    sortOrder: upgradeIndex + 1,
    chainId: 'ethereum'
  };

  fs.writeFileSync(
    path.join(upgradeDir, '_meta.json'),
    JSON.stringify(upgradeMeta, null, 2)
  );

  console.log(`Created upgrade: ${upgradeId}`);

  // Process features
  if (upgrade.features && Array.isArray(upgrade.features)) {
    upgrade.features.forEach((feature, featureIndex) => {
      const featureDirName = getFeatureDirName(feature);
      const featureDir = path.join(upgradeDir, featureDirName);

      // Create feature directory
      if (!fs.existsSync(featureDir)) {
        fs.mkdirSync(featureDir, { recursive: true });
      }

      // Get EIP details if available
      const eipDetail = feature.eip ? eipDetails[feature.eip] : null;
      const eipNumber = feature.eip ? parseEipNumber(feature.eip) : null;

      // Determine impact and category
      let impact = 'medium';
      let category = '协议基础';

      if (eipDetail) {
        impact = eipDetail.impact || 'medium';
        category = eipDetail.category || '协议基础';
      } else if (feature.major) {
        impact = 'high';
      }

      // Build feature _meta.json
      const featureMeta = {
        id: featureDirName,
        name: feature.name,
        nameZh: feature.name,
        type: feature.eip ? 'eip' : 'feature',
        number: eipNumber,
        impact: impact,
        category: category,
        major: !!feature.major,
        sortOrder: featureIndex + 1,
        chainId: 'ethereum',
        upgradeId: upgradeId
      };

      // Remove null fields for cleanliness
      if (featureMeta.number === null) {
        delete featureMeta.number;
      }

      fs.writeFileSync(
        path.join(featureDir, '_meta.json'),
        JSON.stringify(featureMeta, null, 2)
      );

      // Write original-zh.md
      const originalContent = eipDetail ? eipDetail.original : feature.desc;
      fs.writeFileSync(
        path.join(featureDir, 'original-zh.md'),
        originalContent || ''
      );

      // Write ai-introduce-zh.md
      const aiContent = eipDetail ? eipDetail.aiSummary : '';
      fs.writeFileSync(
        path.join(featureDir, 'ai-introduce-zh.md'),
        aiContent || ''
      );

      console.log(`  Created feature: ${featureDirName}`);
    });
  }
});

// Summary
let upgradeCount = 0;
let featureCount = 0;

upgrades.forEach(upgrade => {
  upgradeCount++;
  if (upgrade.features) {
    featureCount += upgrade.features.length;
  }
});

console.log(`\n✅ Migration complete!`);
console.log(`   Upgrades: ${upgradeCount}`);
console.log(`   Features: ${featureCount}`);
console.log(`   Output: ${baseDir}`);
