const fs = require('fs');
const path = require('path');
const https = require('https');

const baseDir = '/tmp/web3-upgrades/data/ethereum';
const EIPS_REPO = 'https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS';

// Collect all EIP feature directories
const eipDirs = [];
const upgrades = fs.readdirSync(baseDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

for (const upgrade of upgrades) {
  const upgradeDir = path.join(baseDir, upgrade);
  const features = fs.readdirSync(upgradeDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  
  for (const feature of features) {
    const metaPath = path.join(upgradeDir, feature, '_meta.json');
    if (!fs.existsSync(metaPath)) continue;
    
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    if (meta.type === 'eip' && meta.number) {
      eipDirs.push({
        eipNum: meta.number,
        upgradeId: upgrade,
        featureDir: feature,
        targetPath: path.join(upgradeDir, feature, 'original-zh.md')
      });
    }
  }
}

console.log(`Found ${eipDirs.length} EIP features to update`);

let downloaded = 0, failed = 0, skipped = 0;

// Download one EIP
async function downloadEIP(eipInfo) {
  const url = `${EIPS_REPO}/eip-${eipInfo.eipNum}.md`;
  
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode !== 200) {
        console.log(`  ❌ EIP-${eipInfo.eipNum}: HTTP ${res.statusCode}`);
        failed++;
        resolve();
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Clean up the markdown - remove YAML frontmatter, keep the good stuff
        const cleaned = cleanupEIP(data, eipInfo.eipNum);
        fs.writeFileSync(eipInfo.targetPath, cleaned);
        downloaded++;
        console.log(`  ✅ EIP-${eipInfo.eipNum} → ${eipInfo.upgradeId}/${eipInfo.featureDir}`);
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.log(`  ❌ EIP-${eipInfo.eipNum}: ${err.message}`);
      failed++;
      resolve();
    });
    
    req.on('timeout', () => {
      req.destroy();
      console.log(`  ❌ EIP-${eipInfo.eipNum}: timeout`);
      failed++;
      resolve();
    });
  });
}

// Clean up EIP markdown - keep abstract, motivation, and spec sections
function cleanupEIP(rawContent, eipNum) {
  // Remove YAML frontmatter (--- ... ---)
  let content = rawContent.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
  
  // Add header
  let result = `# EIP-${eipNum}: 官方原文\n\n> 来源：https://github.com/ethereum/EIPs/blob/master/EIPS/eip-${eipNum}.md\n\n---\n\n`;
  
  // Extract key sections
  const sections = ['abstract', 'motivation', 'specification', 'rationale', 'security considerations'];
  
  for (const section of sections) {
    const pattern = new RegExp(`## ${section}\\s*\\n([\\s\\S]*?)(?=\\n## |\\n$)`, 'i');
    const match = content.match(pattern);
    if (match) {
      const sectionTitle = section.charAt(0).toUpperCase() + section.slice(1);
      result += `## ${sectionTitle}\n\n${match[1].trim()}\n\n---\n\n`;
    }
  }
  
  // If no sections found, include full content (stripped)
  if (result.split('##').length <= 2) {
    // Just has the title and source line, no sections extracted
    result += content.substring(0, 8000); // Cap at 8000 chars if full content
    if (content.length > 8000) {
      result += '\n\n... [内容过长已截断，完整版本请访问官方 EIP 仓库]';
    }
  }
  
  return result;
}

// Run with sequential delays to avoid rate limits
async function run() {
  console.log('Starting EIP downloads from ethereum/EIPs...\n');
  
  for (const eipInfo of eipDirs) {
    await downloadEIP(eipInfo);
    // Small delay between requests
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`\n✅ Done! Downloaded: ${downloaded}, Failed: ${failed}`);
}

run().catch(console.error);
