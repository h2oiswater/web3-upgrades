const fs = require('fs');
const path = require('path');

const htmlPath = '/tmp/web3-upgrades/backup/index.html';
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

const upgradesMatch = htmlContent.match(/const upgrades = ([\s\S]*?);\s*const eipDetails/);
const eipDetailsMatch = htmlContent.match(/const eipDetails = ([\s\S]*?);\s*function renderTimeline/);

let upgrades, eipDetails;
try { upgrades = eval('(' + upgradesMatch[1] + ')'); } catch (e) { console.error('parse upgrades failed', e); process.exit(1); }
try { eipDetails = eval('(' + eipDetailsMatch[1] + ')'); } catch (e) { console.error('parse eipDetails failed', e); process.exit(1); }

const baseDir = '/tmp/web3-upgrades/data/ethereum';

function slugifyUpgrade(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
}
function slugifyFeature(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-\u4e00-\u9fa5]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
}
function getFeatureDirName(feature) {
  return feature.eip ? feature.eip.toLowerCase() : slugifyFeature(feature.name);
}
function parseEipNumber(eipStr) {
  const m = eipStr?.match(/EIP-(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

// Generate rich original-zh.md
function generateOriginalMd(feature, eipDetail) {
  const eipNum = feature.eip ? parseEipNumber(feature.eip) : null;
  let lines = [];
  
  if (eipNum) {
    lines.push(`# EIP-${eipNum}: ${feature.name}`);
  } else {
    lines.push(`# ${feature.name}`);
  }
  lines.push('');
  
  if (eipDetail?.original) {
    // Split by numbered points or semicolons
    const text = eipDetail.original;
    // Try to split into logical sections
    const parts = text.split(/(?:\d+\)\s*|；|;\s*(?=\d)|：(?=\d))/).filter(p => p.trim());
    
    if (parts.length > 1) {
      lines.push('## 技术要点');
      lines.push('');
      parts.forEach((part, i) => {
        const trimmed = part.trim().replace(/^[;；:]\s*/, '');
        if (trimmed) {
          lines.push(`${i + 1}. ${trimmed}`);
        }
      });
    } else {
      lines.push('## 技术概要');
      lines.push('');
      lines.push(text);
    }
    lines.push('');
  } else if (feature.desc) {
    lines.push('## 技术概要');
    lines.push('');
    lines.push(feature.desc);
    lines.push('');
  }
  
  // Add technical context from eipDetails if available
  if (eipDetail?.category) {
    lines.push(`- **类别**: ${eipDetail.category}`);
  }
  if (eipDetail?.impact) {
    const impactMap = { high: '高', medium: '中', low: '低' };
    lines.push(`- **影响等级**: ${impactMap[eipDetail.impact] || eipDetail.impact}`);
  }
  if (feature.major) {
    lines.push(`- **核心特性**: ⭐ 本次升级的关键变更`);
  }
  lines.push('');
  
  lines.push('---');
  lines.push('');
  lines.push('*技术原文基于以太坊官方 EIP 文档整理*');
  
  return lines.join('\n');
}

// Generate rich ai-introduce-zh.md
function generateAiMd(feature, eipDetail) {
  const eipNum = feature.eip ? parseEipNumber(feature.eip) : null;
  let lines = [];
  
  if (eipNum) {
    lines.push(`# EIP-${eipNum}: ${feature.name} — AI 解读`);
  } else {
    lines.push(`# ${feature.name} — AI 解读`);
  }
  lines.push('');
  
  // Core AI summary
  if (eipDetail?.aiSummary) {
    lines.push('## 一句话总结');
    lines.push('');
    lines.push(`> ${eipDetail.aiSummary}`);
    lines.push('');
  }
  
  // Technical breakdown
  if (eipDetail?.original) {
    lines.push('## 核心机制拆解');
    lines.push('');
    
    const text = eipDetail.original;
    // Extract key mechanisms
    const mechanisms = text.split(/(?:\d+\)\s*|；|;\s*(?=\d))/).filter(p => p.trim());
    
    if (mechanisms.length > 1) {
      mechanisms.forEach((m, i) => {
        const trimmed = m.trim().replace(/^[;；:]\s*/, '');
        if (trimmed) {
          lines.push(`### ${i + 1}. ${trimmed.split(/[：:]/)[0] || `机制 ${i + 1}`}`);
          lines.push('');
          // Add AI interpretation for each point
          lines.push(`**技术原文**: ${trimmed}`);
          lines.push('');
          lines.push('**通俗理解**: ' + generateSimpleExplanation(trimmed, feature.name));
          lines.push('');
        }
      });
    } else {
      lines.push(text);
      lines.push('');
    }
  }
  
  // Impact analysis
  lines.push('## 实际影响分析');
  lines.push('');
  
  if (eipDetail?.impact === 'high') {
    lines.push('🔴 **高影响** — 此变更对以太坊生态产生深远影响，建议所有开发者和用户关注。');
  } else if (eipDetail?.impact === 'medium') {
    lines.push('🟡 **中影响** — 此变更对特定场景或开发者群体有显著影响。');
  } else {
    lines.push('🟢 **低影响** — 此变更主要涉及技术细节优化，对普通用户影响有限。');
  }
  lines.push('');
  
  if (eipDetail?.category) {
    lines.push(`**涉及领域**: ${eipDetail.category}`);
    lines.push('');
  }
  
  // Who should care
  lines.push('### 谁会受到影响？');
  lines.push('');
  lines.push(generateStakeholderImpact(feature, eipDetail));
  lines.push('');
  
  // Historical context
  lines.push('## 历史背景与演进');
  lines.push('');
  lines.push(generateHistoricalContext(feature, eipDetail));
  lines.push('');
  
  lines.push('---');
  lines.push('');
  lines.push('*本解读由 AI 基于技术文档生成，仅供参考。具体实现细节请以官方 EIP 为准。*');
  
  return lines.join('\n');
}

// Helper: generate simple explanation
function generateSimpleExplanation(technicalText, featureName) {
  // Try to simplify the technical text
  const simplifications = {
    'gas': '这是关于交易费用的调整，影响你发送交易时需要支付的手续费。',
    'base fee': '交易费用的一部分会自动调整，网络拥堵时变贵，空闲时变便宜。',
    '销毁': '这部分 ETH 会被永久移除流通，理论上会让剩下的 ETH 更稀缺。',
    '质押': '把你的 ETH 锁起来帮网络做验证，作为回报你能获得利息。',
    '提款': '终于可以把之前质押的 ETH 取出来了！在这之前只能存不能取。',
    '分片': '把大任务切成很多小任务并行处理，就像把一个大蛋糕切成很多小块分给很多人切。',
    'Rollup': '一种扩容方案，把大量交易打包处理，只在主链上存少量关键数据。',
    'Blob': '一种临时的数据存储方式，专门给 Rollup 用的，便宜但会定期删除。',
    'KZG': '一种数学证明技术，用来确保别人没篡改你提交的数据。',
    '验证者': '运行特殊软件的节点，负责检查交易是否合法并投票确认区块。',
    '共识': '网络中所有节点就"哪些交易是有效的"达成一致的过程。',
    '执行层': '实际执行智能合约和交易处理的那一层。',
    '信标链': '以太坊 PoS 的核心协调链，管理验证者和区块生成。',
  };
  
  for (const [key, value] of Object.entries(simplifications)) {
    if (technicalText.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return `这是对以太坊底层协议的${featureName || ''}技术改进，通过优化特定机制来提升网络性能或安全性。`;
}

// Helper: stakeholder impact
function generateStakeholderImpact(feature, eipDetail) {
  const impacts = [];
  const text = (eipDetail?.original || '') + ' ' + (eipDetail?.aiSummary || '');
  
  if (text.includes('gas') || text.includes('费用') || text.includes('fee')) {
    impacts.push('- **普通用户**: 交易费用可能发生变化，需要关注 gas 成本波动。');
  }
  if (text.includes('质押') || text.includes('staking') || text.includes('validator')) {
    impacts.push('- **质押者/验证者**: 直接影响质押操作、奖励获取或退出机制。');
  }
  if (text.includes('合约') || text.includes('contract') || text.includes('opcode') || text.includes('预编译')) {
    impacts.push('- **智能合约开发者**: 可能需要更新合约代码以适应新机制或利用新功能。');
  }
  if (text.includes('扩容') || text.includes('吞吐量') || text.includes('Rollup') || text.includes('blob')) {
    impacts.push('- **Layer 2 / Rollup 开发者**: 直接受益于更低的链上数据成本或更高的吞吐量。');
  }
  if (text.includes('钱包') || text.includes('EIP-155') || text.includes('重放')) {
    impacts.push('- **钱包开发者**: 需要更新签名逻辑或用户界面以支持新交易格式。');
  }
  if (impacts.length === 0) {
    impacts.push('- **核心开发者**: 协议层面的优化，提升网络底层性能和安全性。');
    impacts.push('- **全节点运营者**: 可能需要升级节点软件以支持新规则。');
  }
  
  return impacts.join('\n');
}

// Helper: historical context
function generateHistoricalContext(feature, eipDetail) {
  const eipNum = feature.eip ? parseEipNumber(feature.eip) : null;
  const contexts = {
    '1559': 'EIP-1559 是以太坊最受争议也最重要的经济模型变革之一。它由 Vitalik Buterin 在 2018 年提出，经历了漫长的社区讨论后才在 London 升级中实施。基础费销毁机制彻底改变了 ETH 的货币政策。',
    '4844': 'EIP-4844 是"The Surge"扩容路线图的核心。它引入了 Proto-Danksharding 概念，为完整的 Danksharding 铺路。Blob 交易让 Rollup 的数据成本降低了 10-100 倍。',
    '4895': '在上海升级之前，ETH 质押是"有进无出"的——近 1800 万 ETH 被锁定在信标链中无法提取。EIP-4895 的启用标志着 PoS 闭环的完成，也是上海升级最受关注的核心特性。',
    '3674': 'The Merge 是以太坊历史上最重要的升级，彻底终结了工作量证明（PoW）挖矿，使以太坊能耗降低 99.95%。这是一次共识机制的完全切换，而非简单的参数调整。',
    '155': 'EIP-155 引入了链 ID 机制，解决了以太坊和以太坊经典（ETC）之间的交易重放攻击问题。这是多链生态的安全基石。',
    '2930': 'EIP-2930 和 EIP-2718 一起为柏林升级做准备，引入了访问列表和类型化交易信封，为后续的复杂交易类型（如 EIP-1559）打下基础。',
  };
  
  if (eipNum && contexts[eipNum.toString()]) {
    return contexts[eipNum.toString()];
  }
  
  return `此特性作为以太坊持续演进的一部分，解决了当时网络面临的特定技术挑战。它的实施经过社区充分讨论和测试，是协议逐步完善过程中的重要一步。`;
}

// ============ EXECUTE ============

let totalOriginal = 0, totalAi = 0, totalFiles = 0;

for (const upgrade of upgrades) {
  const upgradeId = slugifyUpgrade(upgrade.name);
  
  for (const feature of (upgrade.features || [])) {
    const featureDirName = getFeatureDirName(feature);
    const featureDir = path.join(baseDir, upgradeId, featureDirName);
    
    const eipDetail = feature.eip ? eipDetails[feature.eip] : null;
    
    // Generate and write original-zh.md
    const originalMd = generateOriginalMd(feature, eipDetail);
    fs.writeFileSync(path.join(featureDir, 'original-zh.md'), originalMd);
    totalOriginal += originalMd.length;
    
    // Generate and write ai-introduce-zh.md
    const aiMd = generateAiMd(feature, eipDetail);
    fs.writeFileSync(path.join(featureDir, 'ai-introduce-zh.md'), aiMd);
    totalAi += aiMd.length;
    
    totalFiles += 2;
  }
}

console.log(`✅ 重写完成！`);
console.log(`   文件数: ${totalFiles}`);
console.log(`   original-zh.md 总字符: ${totalOriginal.toLocaleString()}`);
console.log(`   ai-introduce-zh.md 总字符: ${totalAi.toLocaleString()}`);
console.log(`   平均每个 original: ${Math.round(totalOriginal / (totalFiles/2))} 字符`);
console.log(`   平均每个 AI 解读: ${Math.round(totalAi / (totalFiles/2))} 字符`);
