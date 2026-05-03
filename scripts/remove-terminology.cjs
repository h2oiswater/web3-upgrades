const fs = require('fs');
const path = require('path');

const baseDir = '/tmp/web3-upgrades/data/ethereum';

// Remove terminology sections from all ai-introduce-zh.md files
const upgrades = fs.readdirSync(baseDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

let removed = 0;

for (const upgrade of upgrades) {
  const upgradeDir = path.join(baseDir, upgrade);
  const features = fs.readdirSync(upgradeDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  
  for (const feature of features) {
    const aiPath = path.join(upgradeDir, feature, 'ai-introduce-zh.md');
    if (!fs.existsSync(aiPath)) continue;
    
    let content = fs.readFileSync(aiPath, 'utf-8');
    
    // Remove terminology section ("## 九、关键术语表" or "## 十、关键术语表")
    const termMatch = content.match(/## [九十]、关键术语表[\s\S]*?(?=---\s*\n\*本深度解读)/);
    if (termMatch) {
      content = content.replace(termMatch[0], '');
      removed++;
    }
    
    // Also fix chapter numbering after removal
    // Rename "## 十、思考与延伸" → "## 九、思考与延伸" if terminology was ## 九
    // Rename "## 十一、思考与延伸" → "## 十、思考与延伸" if terminology was ## 十
    content = content.replace('## 十、思考与延伸', '## 九、思考与延伸');
    content = content.replace('## 十一、思考与延伸', '## 十、思考与延伸');
    
    fs.writeFileSync(aiPath, content);
  }
}

console.log(`✅ Removed terminology sections from ${removed} files`);
