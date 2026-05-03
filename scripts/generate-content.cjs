const fs = require('fs');
const path = require('path');

// Read raw HTML data
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
function getFeatureDirName(feature) {
  return feature.eip ? feature.eip.toLowerCase() : feature.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}
function parseEipNumber(eipStr) {
  const m = eipStr?.match(/EIP-(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

// ============== CONTENT GENERATORS ==============

// Split original text into numbered points
function splitIntoPoints(text) {
  if (!text) return [];
  // Split by: 1) 2) 3) or 1. 2. 3. or ; or ；
  const parts = text.split(/(?:\d+[\.\)]\s*|；|;\s*(?=\d)|：(?=\d))/).filter(p => p.trim());
  if (parts.length > 1) {
    return parts.map(p => p.trim().replace(/^[;；:]\s*/, '')).filter(p => p.length > 5);
  }
  // Try sentence splitting
  const sentences = text.split(/(?<=[。！？.!?])\s+/).filter(s => s.trim().length > 10);
  return sentences.length > 1 ? sentences.map(s => s.trim()) : [text];
}

// Generate original-zh.md
function generateOriginalMd(feature, eipDetail, upgrade) {
  const eipNum = parseEipNumber(feature.eip);
  let lines = [];
  
  if (eipNum) {
    lines.push(`# EIP-${eipNum}: ${feature.name}`);
  } else {
    lines.push(`# ${feature.name}`);
  }
  lines.push('');
  
  const text = eipDetail?.original || feature.desc || '';
  const points = splitIntoPoints(text);
  
  if (points.length > 1) {
    lines.push('## 技术要点');
    lines.push('');
    points.forEach((point, i) => {
      lines.push(`${i + 1}. ${point}`);
    });
  } else if (points.length === 1) {
    lines.push('## 技术概要');
    lines.push('');
    lines.push(points[0]);
  }
  lines.push('');
  
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
  lines.push('*技术原文基于以太坊官方 EIP 文档整理*');
  return lines.join('\n');
}

// Generate AI analogy based on EIP content (single best match)
function generateAnalogy(feature, eipDetail, upgrade) {
  const text = (eipDetail?.original || '') + ' ' + (eipDetail?.aiSummary || '') + ' ' + (feature.desc || '');
  
  // Specific analogies per EIP type
  if (text.includes('blob')) {
    return `**快递站的"临时寄存柜"**

想象以太坊主链是一个大型快递分拣中心。以前，L2 包裹到达后，中心必须把包裹内容永久存档到档案室（calldata），每个字都按标准收费。

Blob 交易就像引入了"临时寄存柜"：
- 包裹不用拆开永久存档：L2 把包裹放进临时柜子（blob），18 天后自动清理
- 柜子有封条（KZG 承诺）：中心不用看包裹里面是什么，只需要验证封条完好
- 柜子有独立计价：临时柜子的租金比普通存档便宜 10-100 倍
- 柜子最多放 6 个包裹：每个柜子 128KB，一次交易最多带 6 个柜子`;
  }
  if (text.includes('gas') && text.includes('费用')) {
    return `**动态定价的航班票价**

以前以太坊的交易费用像拍卖——你愿意出多少钱，矿工就优先处理谁的。这导致：网络一堵，大家疯狂加价，费用瞬间飙升。

EIP-1559 把拍卖改成了"基础票价 + 小费"：
- 基础票价由系统自动定价：飞机满 50% 时票价不变，超过则涨价，低于则降价
- 小费是给机组人员的额外激励：给得多服务更好，但不是必须的
- 基础票价收入被销毁：航空公司把这部分钱烧掉，而不是装进自己口袋`;
  }
  if (text.includes('质押') && text.includes('提款')) {
    return `**定期存款终于能取钱了**

以前以太坊质押就像存了一笔永远取不出来的定期存款——只能往里存，不能往外取。1800 万 ETH 被锁在"保险柜"里，质押者只能眼睁睁看着收益数字上涨，但摸不到本金。

上海升级打开了保险柜：
- 部分提款：定期收割利息，就像银行账户的"自动转存利息到活期"
- 完全提款：连本带利全部取走，退出验证者行列
- 结果出乎意料：取款开放后，质押量不减反增——因为风险没了，更多人敢存了`;
  }
  if (text.includes('delegatecall')) {
    return `**借用别人的厨房做菜**

想象你开了一家餐厅，但自己不擅长做某道菜。你可以"借用"隔壁大厨的厨房和菜谱，但客人付的钱进你的账，菜也算在你的餐厅名下。

DELEGATECALL 就是这个逻辑：
- 合约 A 调用合约 B 的代码
- 但执行环境（msg.sender、余额）还是合约 A 的
- 合约 B 就像"共享厨房"，合约 A 借用它来实现自己不会的功能
- 这是代理合约和可升级合约的基础模式`;
  }
  if (text.includes('create2')) {
    return `**提前预定包间号码**

以前餐厅开门前，你不知道 18 号桌会是谁坐。CREATE2 让你在餐厅装修期间就能预定"我的包间号码是 18"，这样朋友可以直接去 18 号桌找你，不用等开门后再确认。

在区块链上：
- 合约部署前就能确定地址
- 地址 = hash(你的地址 + 盐值 + 初始化代码)
- 这让状态通道、Counterfactual 交互成为可能——链下确定地址，只在必要时上链`;
  }
  if (text.includes('revert')) {
    return `**购物车的"撤销"按钮**

以前以太坊合约没有撤销功能——一旦开始执行，要么成功到底，要么失败并烧掉所有 gas。就像超市没有退货通道，买错了只能认栽。

REVERT 就是购物车的撤销按钮：
- 发现不对劲？一键撤销所有操作
- 已经消耗的 gas 正常扣除，但剩余 gas 全额退还
- 还能带回一条错误信息："余额不足"、"权限拒绝"等
- DeFi 协议从此可以安全地做前置检查和条件验证`;
  }
  if (text.includes('chain id')) {
    return `**给每条区块链发身份证**

2016 年 ETH 和 ETC 分道扬镳后，两条链的交易格式几乎一样。这就好比两个国家的身份证长得一样——在 A 国办的业务，可以被恶意复制到 B 国再执行一遍。

EIP-155 就是给每个链发独一无二的身份证：
- 主网 = 1，Goerli = 5，Polygon = 137
- 交易签名时把链 ID 加进去
- 交易只能在指定链上执行，无法被重放到其他链
- 这是 ETH 与 ETC 安全共存的技术基石`;
  }
  if (text.includes('难度炸弹')) {
    return `**定时炸弹倒逼转型**

PoW 挖矿就像一场比赛，难度炸弹是主办方在赛道上埋的陷阱——每隔一段时间，陷阱就多一层，跑得越来越吃力。

设计初衷：
- 故意让 PoW 挖矿越来越难（出块时间越来越长）
- 逼矿工和社区必须转向 PoS（新赛场）
- 每次陷阱快生效时，就临时拆掉导火索延期
- 最终目的：确保以太坊不会永远停留在 PoW 时代`;
  }
  if (text.includes('rollup') || text.includes('calldata')) {
    return `**快递中转站 vs 永久档案室**

Rollup 就像快递中转站：把很多小包裹打包成一个大箱子发往主站。但问题是——主站以前要求每个包裹都存档进永久档案室（calldata），存档费按主站标准收。

EIP-2028 / Blob 交易带来的改变：
- 永久档案室降费：calldata 从 68 gas/字节降到 16 gas/字节
- 临时寄存柜：blob 交易比永久存档再便宜 100 倍
- 结果：中转站运营成本骤降 90%+，小包裹运输终于经济可行`;
  }
  if (text.includes('staking') || text.includes('验证者')) {
    return `**从"一人一票"到"加权投票"**

以前质押像"一人一票"——不管你有 32 ETH 还是 3200 ETH，都只能运行一个验证者节点，权重一样。大户被迫拆成 100 个节点来管理，复杂且低效。

EIP-7251 改为"加权投票"：
- 单个验证者最大余额从 32 ETH 提升到 2048 ETH
- 3200 ETH 大户以前需要 100 个节点，现在只需 2 个
- 保留最低门槛 32 ETH：小额质押者仍可以参与
- 共识层消息传播压力大幅降低`;
  }
  
  return `**${feature.name}**

${eipDetail?.original?.substring(0, 100) || feature.desc?.substring(0, 100) || '以太坊协议层面的优化改进'}。

可以把以太坊想象成一台全球共享的计算机，这个升级就是在优化这台计算机的某个零部件，让整体运转得更顺畅、更安全、更高效。`;
}

// Generate background/pain points
function generateBackground(feature, eipDetail, upgrade) {
  const text = (eipDetail?.aiSummary || '') + ' ' + (eipDetail?.original || '') + ' ' + (upgrade.desc || '');
  
  if (text.includes('blob') || text.includes('扩容') || (text.includes('L2') && text.includes('Rollup'))) {
    return `随着 DeFi、NFT、SocialFi 等应用的爆发，以太坊主链 TPS 成为瓶颈。Layer 2 方案（Rollup）能把计算放到链下，但**数据存储成本仍是硬伤**——Rollup 必须把交易数据发布到 L1 作为"证据"，而 L1 的 calldata 存储费用高达 ~16-20 gwei/字节。

结果是：L2 虽然计算便宜了，但**数据发布成本占了总费用的 90% 以上**。用户在 L2 做一次 Swap 仍需支付 $0.5-$2，距离"大规模采用"差一个数量级。`;
  }
  if (text.includes('DoS') || text.includes('攻击')) {
    return `在${upgrade.name}升级之前，攻击者利用定价过低的操作码（如 EXTCODESIZE、SLOAD、BALANCE）反复读取状态数据，构造极低成本的资源耗尽攻击。节点 CPU 和 IO 被拖垮，同步速度急剧下降，普通用户的交易被阻塞。

这不仅是技术问题，更是经济问题——攻击者的成本远低于网络防御成本，导致 DoS 攻击可持续数周。`;
  }
  if ((text.includes('质押') || text.includes('staking')) && text.includes('提款')) {
    return `PoS 转型后，信标链于 2020 年 12 月启动，但质押是"单向"的——只能存入，不能取出。到 2023 年初，**约 1800 万 ETH（占流通量 15%）被锁在信标链中无法提取**。

质押者面临巨大的流动性风险：紧急情况下无法取回资金，小额质押者更是被套牢。这不仅抑制了质押意愿，也让 ETH 的实际流通量被人为压低。上海升级前，社区最大的呼声就是"开放提款"。`;
  }
  if (text.includes('质押') || text.includes('staking') || text.includes('验证者')) {
    return `以太坊质押生态在 The Merge 后快速增长，但协议设计遗留了诸多不便——

- **验证者管理复杂**：运行 100 个验证者节点需要管理 100 套密钥和 100 个进程
- **退出机制不完善**：验证者退出需要直接操作共识层，托管用户几乎无法自主操作
- **资本效率低下**：3200 ETH 大户被迫拆成 100 个 32 ETH 的节点

这些问题制约了质押民主化和资本效率的提升。`;
  }
  if (text.includes('gas') && text.includes('费用') && text.includes('销毁')) {
    return `在 EIP-1559 之前，以太坊采用"第一价格拍卖"模式——用户出价，矿工挑选。这导致：

- **费用波动剧烈**：网络一堵，gas price 从 20 gwei 飙升到 500+ gwei
- **用户无法预估成本**：不知道出多少价才能成交，经常出现"出价低了被卡、出价高了浪费"
- **矿工收益与网络拥堵脱钩**：矿工赚得盆满钵满，但网络效率没有改善
- **ETH 无通缩机制**：所有交易费都给矿工，ETH 持续通胀

社区对经济模型的争论持续数年，急需一次根本性的费用改革。`;
  }
  if (text.includes('gas') && text.includes('成本') && !text.includes('销毁')) {
    return `在${upgrade.name}升级之前，特定 EVM 操作码的 gas 定价与实际计算成本严重脱节。某些操作（如状态读取、指数运算）定价过低，攻击者可以构造极低成本的恶意交易，反复执行这些操作来耗尽节点资源。

这是经济激励与安全防护之间的失衡——合法用户支付的费用不能反映真实资源消耗，而攻击者却能以极低成本瘫痪网络。`;
  }
  if (text.includes('难度炸弹')) {
    return `PoW 难度炸弹的设计初衷是推动以太坊向 PoS 转型，但如果合并准备时间超出预期，难度炸弹会导致出块时间急剧增加——从 13 秒延长到 30 秒、60 秒甚至更长。

这直接影响网络可用性：交易确认变慢、DeFi 清算延迟、用户体验恶化。因此每次接近难度炸弹生效时，都需要临时推迟，为 The Merge 争取时间。`;
  }
  if ((text.includes('合约') && text.includes('新增')) || text.includes('opcode')) {
    return `随着以太坊应用生态的蓬勃发展，EVM 的原始设计逐渐暴露出限制——缺少关键操作码（如移位、内存复制）、存储机制效率低下、合约间交互能力受限。开发者被迫用复杂且昂贵的变通方案实现基本功能。

这些限制不仅增加了 gas 成本，也制约了智能合约的创新空间。补齐 EVM 的能力短板，是协议长期竞争力的关键。`;
  }
  if (text.includes('合并') || text.includes('merge') || (text.includes('PoS') && text.includes('PoW'))) {
    return `以太坊从 2015 年启动时就计划最终转向 PoS，但 PoW 时代持续了 7 年。这期间：

- **能耗问题**：以太坊年度能耗约 112 TWh，相当于荷兰全国的用电量，环保压力日益增大
- **发行率过高**：PoW 时代 ETH 年发行率约 4.5%，而 PoS 可降低至 ~0.5%
- **中心化风险**：ASIC 矿机专业化导致矿池垄断，去中心化程度下降

完成共识机制切换成为社区最核心的技术债务，也是以太坊获得主流认可的关键前提。`;
  }
  if (text.includes('账户') || text.includes('EOA') || text.includes('抽象')) {
    return `以太坊有两种账户：
- **EOA（外部账户）**：普通钱包地址，只有私钥/公钥，功能极其有限——不能批量交易、不能代付 gas、不能社交恢复
- **合约账户**：功能丰富，但需要额外部署，用户体验割裂

90% 的以太坊用户使用 EOA，却享受不到智能合约钱包的便利。完整的 ERC-4337 账户抽象遥遥无期，急需一个"过渡方案"让 EOA 也能获得合约能力。`;
  }
  if (text.includes('链式') || text.includes('chain id') || text.includes('重放')) {
    return `2016 年 The DAO 事件后，ETH 与 ETC 分道扬镳。但两条链的交易格式几乎完全相同——签名、地址、nonce 全部兼容。这意味着在 ETH 上签名的一笔交易，可以被恶意广播到 ETC 网络上并成功执行。

这对跨链用户是致命风险：同样的交易在两链上各执行一次，资金被双重转移。"重放攻击"成为 ETH/ETC 生态共存的重大安全隐患。`;
  }
  
  return `${upgrade.name}升级旨在解决以太坊网络在特定阶段面临的技术挑战。${feature.name}是本次升级的重要组成部分，其目标是优化协议性能、安全性或可用性，为以太坊的长期演进奠定基础。`;
}

// Generate upgrade goal
function generateGoal(feature, eipDetail, upgrade) {
  const text = eipDetail?.original || feature.desc || '';
  
  if (text.includes('gas') && text.includes('成本')) {
    return `降低特定操作的成本，使攻击不再经济可行，同时保持网络安全性。`;
  }
  if (text.includes('质押') && text.includes('提款')) {
    return `完成 PoS 闭环——允许质押者安全提取 ETH，降低质押风险，提升质押吸引力。`;
  }
  if (text.includes('扩容') || text.includes('Rollup') || text.includes('blob')) {
    return `为 Layer 2 提供廉价的数据可用性空间，将 L2 交易成本降低一个数量级（90%+）。`;
  }
  if (text.includes('费用') && text.includes('销毁')) {
    return `改革交易费用市场，引入可预测的基础费用+可选小费模式，同时通过销毁机制改善 ETH 经济模型。`;
  }
  if (text.includes('难度炸弹')) {
    return `推迟难度炸弹，为下一次重大升级（如 The Merge）争取充足的准备时间。`;
  }
  if (text.includes('合约') && text.includes('新增')) {
    return `扩展 EVM 能力，新增关键操作码或预编译合约，支持更复杂的智能合约模式。`;
  }
  
  return `通过${feature.name}优化以太坊协议，提升网络性能、安全性或可用性。`;
}

// Generate effect
function generateEffect(feature, eipDetail, upgrade) {
  const text = eipDetail?.aiSummary || '';
  const impact = eipDetail?.impact || 'medium';
  
  let lines = [];
  
  if (impact === 'high') {
    lines.push('此变更对以太坊生态产生了深远影响：');
  } else if (impact === 'medium') {
    lines.push('此变更在特定领域产生了显著效果：');
  } else {
    lines.push('此变更为协议层面的渐进式优化：');
  }
  
  if (text.includes('费用') && text.includes('降低')) {
    lines.push('- 显著降低了相关操作的使用成本');
  }
  if (text.includes('安全') || text.includes('攻击') || text.includes('DoS')) {
    lines.push('- 消除了已知的安全风险和攻击向量');
  }
  if (text.includes('效率') || text.includes('性能')) {
    lines.push('- 提升了协议执行效率和资源利用率');
  }
  if (text.includes('用户体验') || text.includes('UX')) {
    lines.push('- 改善了最终用户的交互体验');
  }
  if (text.includes('去中心化') || text.includes('民主化')) {
    lines.push('- 降低了参与门槛，促进了网络去中心化');
  }
  if (lines.length === 1) {
    lines.push('- 如期实现了协议设计目标，为后续升级奠定了基础');
  }
  
  return lines.join('\n');
}

// Generate stakeholder impact
function generateStakeholders(feature, eipDetail, upgrade) {
  const text = (eipDetail?.original || '') + ' ' + (eipDetail?.aiSummary || '') + ' ' + (feature.desc || '');
  const impacts = [];
  
  if (text.includes('gas') || text.includes('费用') || text.includes('fee')) {
    impacts.push('- **普通用户**: 交易费用更可控，使用成本降低');
  }
  if (text.includes('质押') || text.includes('staking') || text.includes('验证者') || text.includes('withdrawal')) {
    impacts.push('- **质押者**: 质押操作更灵活，风险更可控');
  }
  if (text.includes('合约') || text.includes('EVM') || text.includes('opcode')) {
    impacts.push('- **智能合约开发者**: 获得了新的编程原语和优化空间');
  }
  if (text.includes('扩容') || text.includes('L2') || text.includes('Rollup') || text.includes('blob')) {
    impacts.push('- **Layer 2 开发者**: 数据发布成本大幅降低，扩容方案更经济');
  }
  if (text.includes('节点') || text.includes('同步') || text.includes('状态')) {
    impacts.push('- **节点运营者**: 同步和存储负担得到优化');
  }
  if (text.includes('矿工') || text.includes('验证者') || text.includes('出块')) {
    impacts.push('- **验证者/矿工**: 收益结构和操作模式发生变化');
  }
  if (text.includes('钱包') || text.includes('EOA') || text.includes('账户')) {
    impacts.push('- **钱包用户**: 账户功能更丰富，操作更便利');
  }
  if (impacts.length === 0) {
    impacts.push('- **核心开发者**: 协议层面的优化，为长期发展铺平道路');
    impacts.push('- **全节点运营者**: 需要升级客户端以支持新规则');
  }
  
  return impacts.join('\n');
}

// Generate historical context
function generateHistory(feature, eipDetail, upgrade) {
  const eipNum = parseEipNumber(feature.eip);
  const histories = {
    1559: 'EIP-1559 由 Vitalik Buterin 于 2018 年提出，经历了近 3 年的社区辩论后才在 London 升级中落地。矿工社区曾强烈反对（因为这切断了他们的基础费收入），但最终社区共识支持了销毁机制。',
    4844: 'EIP-4844 是"The Surge"扩容路线图的核心。Proto-Danksharding 概念由 Dankrad Feist 提出，它在完整 Danksharding 实现前就已经让 L2 费用降低了 90%+，被称为"最小可行扩容"。',
    4895: '在上海升级前，约 1800 万 ETH（占当时流通量的 15%）被锁定在信标链中无法提取。提款开放后，市场曾担心会出现大规模抛售，但实际上质押量不减反增——因为流动性风险的消除让质押变得更安全。',
    3674: 'The Merge 是以太坊历史上最受瞩目的升级。从 2015 年白皮书承诺 PoS，到 2022 年 9 月 15 日完成切换，历时 7 年。合并当夜，全球数万名开发者和爱好者在线见证这一时刻。',
    7702: 'EIP-7702 是账户抽象化的"捷径方案"。完整的 ERC-4337 账户抽象仍在开发中，但 EIP-7702 让 EOA 能立即获得智能合约钱包功能，被誉为"用一年实现十年愿景"的巧妙设计。',
    7251: '32 ETH 的验证者上限最初是为了保证去中心化——防止资金集中。但随着质押量增长，运行数千个验证者节点的大户面临管理噩梦。EIP-7251 在去中心化和资本效率之间重新取得平衡。',
    155: '2016 年 The DAO 事件后，ETH 与 ETC 分道扬镳。EIP-155 的链 ID 机制成为两条链安全共存的技术基石。没有这个机制，ETC 上的交易可以在 ETH 上重放，反之亦然。',
    150: '2016 年 9-10 月，以太坊遭受了持续的 DoS 攻击，攻击者利用 EXTCODESIZE、SLOAD 等廉价操作码反复读取状态，导致节点同步几乎停滞。Tangerine Whistle 是一次紧急止血。',
    1014: 'CREATE2 催生了"Counterfactual"理念——在链下预先确定合约地址并进行交互，只在必要时上链。这是状态通道、Gnosis Safe、以及现代 Account Abstraction 的基础设施。',
    2028: '2019 年之前，Rollup 需要将数据作为 calldata 发布到 L1，每字节 68 gas 的成本使其几乎不可行。EIP-2028 将 calldata 降至 16 gas/字节，让 Rollup 从概念变为产品。',
    1108: 'zk-SNARKs 验证成本曾高达数十美元，这让 zk-Rollup 只能用于高价值场景。EIP-1108 将验证成本降低约 80%，直接催生了 zkSync、Loopring 等 zk-Rollup 项目。',
  };
  
  if (eipNum && histories[eipNum]) {
    return histories[eipNum];
  }
  
  return `此特性是${upgrade.name}升级的重要组成部分，经过社区充分讨论和测试后实施。它是以太坊协议逐步完善过程中的关键一步，为后续的技术演进奠定了基础。`;
}

// Generate related EIPs for this upgrade
function generateRelatedEIPs(feature, upgrade) {
  const related = (upgrade.features || [])
    .filter(f => f.eip && f.eip !== feature.eip)
    .map(f => `- **${f.eip}** — ${f.name}: ${f.desc?.substring(0, 60) || '相关特性'}...`);
  
  if (related.length === 0) return '本次升级中此特性为独立实现，未与其他 EIP 形成直接依赖关系。';
  return '本次升级中与该特性相关的其他 EIP：\n\n' + related.slice(0, 5).join('\n');
}

// Generate simple explanation (analogy-based)
function generateSimpleExplanation(technicalText, featureName) {
  const simplifications = {
    'gas': '这是关于交易费用的调整。可以理解为：高速公路的收费标准变了，某些车辆过路费涨价或降价了。',
    'base fee': '交易费用里有一部分是自动定价的——网络拥堵时自动变贵，空闲时自动变便宜。这部分钱会被销毁，而不是给矿工。',
    '销毁': '这部分 ETH 会被永久移除流通。就像央行把回收的纸币烧掉一样，理论上会让剩下的 ETH 更稀缺、更值钱。',
    '质押': '把你的 ETH 锁起来帮网络做安全检查，作为回报你能获得利息。类似于把钱存进银行定期存款，银行用你的钱去做贷款，你收利息。',
    '提款': '终于可以把之前质押的 ETH 取出来了！在这之前只能存不能取，就像存了定期但银行不让你取。',
    '分片': '把大任务切成很多小任务并行处理。就像把一个大蛋糕切成很多小块，分给很多人同时切，而不是一个人慢慢切一整块。',
    'rollup': '一种扩容方案，把大量交易在链下打包，只在主链上存少量关键数据。就像快递中转站，把很多小包裹打包成一个大箱子发出去。',
    'blob': '一种临时的数据存储方式，专门给 Rollup 用的。便宜但会定期删除（18天后）。就像快递站的临时寄存柜，比永久存档便宜100倍。',
    'kzg': '一种数学证明技术。就像快递箱上的防伪封条——不用打开箱子，就能确认里面的东西没被调换过。',
    'delegatecall': '借用别人的厨房做菜，但菜算在自己账上。合约可以用别人的代码，但资金和权限还是自己的。',
    'create2': '提前预定一个包间号码。在餐厅开门前就能确定"我坐18号桌"，这样朋友可以直接去18号桌找你，不用等餐厅开门后再确认。',
    'revert': '购物车的"撤销"按钮。合约发现不对劲时，可以一键撤销所有操作并退款，而不是硬着头皮完成错误的交易。',
    'staticcall': '只读查询，保证不动任何东西。就像去图书馆查书，可以看书但保证不会把书撕坏或带走。',
    'chain id': '给每条区块链发身份证。确保以太坊的交易只能在以太坊执行，不会被恶意复制到别的链上。',
    'selfdestruct': '注销公司并把钱转走。但这个操作会带来很多麻烦，所以现在正在逐步限制。',
    'difficulty bomb': '定时炸弹。PoW时代故意设置的，让挖矿越来越难，逼大家必须转型到PoS。每次快爆炸时，就暂时拆掉导火索延期。',
    'calldata': '交易里携带的额外数据，永久存在链上。就像正式档案室的存档，很贵但永久可查。',
    'eoa': '普通钱包地址，只有一对密码（私钥/公钥）。不像智能合约钱包那么功能丰富。',
    'account abstraction': '让普通钱包也能有智能合约的功能。就像把银行卡升级成"智能银行卡"，可以设置自动扣款、多签、社交恢复等。',
  };
  
  const lowerText = technicalText.toLowerCase();
  for (const [key, value] of Object.entries(simplifications)) {
    if (lowerText.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return `这是对以太坊底层协议的${featureName}技术改进。可以把以太坊想象成一台全球共享的计算机，这个升级就是在优化这台计算机的某个零部件，让它运转得更顺畅。`;
}

// Generate terminology
function generateTerminology(feature, eipDetail, upgrade) {
  const text = (eipDetail?.original || '') + ' ' + (eipDetail?.aiSummary || '') + ' ' + (feature.desc || '');
  const terms = [];
  
  const knownTerms = {
    'gas': '交易执行的计价单位，类比为"燃料"。操作越复杂，消耗的 gas 越多。',
    'opcode': 'EVM 的基础操作指令，如加法、存储、调用等。每个 opcode 都有对应的 gas 成本。',
    'calldata': '以太坊交易中携带的输入数据，永久存储在链上，费用较高。',
    'storage': '智能合约的永久存储空间，读写成本很高（因为数据要永久保存）。',
    'precompile': '预编译合约：EVM 中内置的高效算法实现，用原生代码而非 EVM 字节码执行，gas 成本更低。',
    'hash': '哈希函数：把任意数据压缩成固定长度的"指纹"。用于验证数据完整性。',
    'zk': '零知识证明：证明"我知道某个秘密"，但不需要透露秘密本身。用于隐私和扩容。',
    'rollup': 'L2 扩容方案：在链下处理交易，只把压缩后的数据提交到主链，主链验证数据可用性即可。',
    'blob': '临时数据容器：每个 128KB，18 天后自动删除，专门给 Rollup 存数据用，比 calldata 便宜 100 倍。',
    'staking': '质押：把 ETH 锁定在信标链中运行验证者节点，帮网络做安全检查，获得利息奖励。',
    'validator': '验证者：运行以太坊 PoS 共识软件的节点，负责提议和验证区块，需要质押 32 ETH（或更多）。',
    'epoch': '时隙的集合，每 32 个 slot（约 6.4 分钟）为一个 epoch。是共识层计时的基本单位。',
    'slot': '时隙，约 12 秒。每个 slot 有一个验证者负责提议区块。',
    'state root': '状态根：当前以太坊全局状态的默克尔树根哈希。任何状态变更都会改变这个根哈希。',
    'merkle': '默克尔树：一种数据结构，允许高效验证大量数据中的某个元素是否存在且未被篡改。',
    'eip': '以太坊改进提案（Ethereum Improvement Proposal）：以太坊社区提出协议变更的标准流程。',
    'hard fork': '硬分叉：协议规则的不兼容变更，所有节点必须升级才能继续参与网络。',
    'consensus': '共识层：负责区块验证和链选择的协议层。以太坊 PoS 的共识层是 Beacon Chain。',
    'execution': '执行层：负责执行智能合约和处理交易的协议层。即传统的 EVM 部分。',
  };
  
  for (const [key, val] of Object.entries(knownTerms)) {
    if (text.toLowerCase().includes(key.toLowerCase())) {
      terms.push(`| **${key}** | ${val} |`);
    }
  }
  
  if (terms.length === 0) {
    terms.push(`| **${feature.name}** | 本次升级引入的核心技术特性，${feature.desc?.substring(0, 50) || '优化以太坊协议性能'}。 |`);
  }
  
  return terms.join('\n');
}

// Generate thinking/extension
function generateExtension(feature, eipDetail, upgrade) {
  const eipNum = parseEipNumber(feature.eip);
  const text = (eipDetail?.aiSummary || '') + ' ' + (eipDetail?.original || '');
  
  if (text.includes('扩容') || text.includes('L2') || text.includes('blob')) {
    return `**Proto-Danksharding → Full Danksharding**: EIP-4844 是 Danksharding 的 MVP 版本，未来还需要实现数据可用性采样（DAS），让轻节点也能验证数据可用性，进一步降低对全节点的依赖。**PeerDAS** 是下一个里程碑。`;
  }
  if (text.includes('质押') || text.includes('staking')) {
    return `**质押民主化的下一步**: EIP-7251 提升了单节点质押上限，未来还可能进一步降低 32 ETH 的最低门槛，让更多小额持有者参与质押。同时，分布式验证者技术（DVT）正在探索让多人共同运行一个验证者节点。`;
  }
  if (text.includes('账户') || text.includes('EOA') || text.includes('抽象')) {
    return `**ERC-4337 账户抽象**: EIP-7702 是 EOA 的"临时升级"，而完整的 ERC-4337 账户抽象正在开发中，未来可能完全取代 EOA 模式，让所有账户都成为智能合约账户。`;
  }
  if (text.includes('gas') || text.includes('费用')) {
    return `**多维费用市场**: 以太坊正在探索多维 EIP-1559，即为不同类型的资源（存储、计算、数据）设置独立的费用市场，使资源定价更精准。`;
  }
  if (text.includes('难度炸弹')) {
    return `**PoW 已成历史**: The Merge 后，难度炸弹永久失效。PoS 的共识机制不再需要这种"倒逼转型"的工具，以太坊进入了新的时代。`;
  }
  if (eipNum === 1559) {
    return `**多维费用市场探索**: EIP-1559 只覆盖执行 gas，未来可能为 blob、存储等独立资源建立各自的费用市场（多维 EIP-1559），使资源配置更精准。`;
  }
  
  return `**持续演进**: 以太坊协议仍在持续迭代中。此特性为未来更广泛的升级奠定了基础，社区的讨论和实验将继续推动网络优化。`;
}

// ============== MAIN AI MD GENERATOR ==============

function generateAiMd(feature, eipDetail, upgrade) {
  const eipNum = parseEipNumber(feature.eip);
  let lines = [];
  
  // Title
  if (eipNum) {
    lines.push(`# EIP-${eipNum}: ${feature.name} — AI 深度解读`);
  } else {
    lines.push(`# ${feature.name} — AI 深度解读`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  
  // 1. Background
  lines.push('## 一、背景信息：为什么需要这个升级？');
  lines.push('');
  lines.push('### 当时的痛点');
  lines.push('');
  lines.push(generateBackground(feature, eipDetail, upgrade));
  lines.push('');
  lines.push('### 核心矛盾');
  lines.push('');
  lines.push(generateAnalogy(feature, eipDetail, upgrade));
  lines.push('');
  
  // 2. Goal
  lines.push('## 二、升级目标：解决什么问题？');
  lines.push('');
  lines.push(generateGoal(feature, eipDetail, upgrade));
  lines.push('');
  
  // 3. Effect
  lines.push('## 三、升级效果：现在怎么样了？');
  lines.push('');
  lines.push(generateEffect(feature, eipDetail, upgrade));
  lines.push('');
  
  // 4. Technical overview with analogy
  lines.push('## 四、技术概述：用类比讲清楚');
  lines.push('');
  lines.push(generateAnalogy(feature, eipDetail, upgrade));
  lines.push('');
  
  const text = eipDetail?.original || feature.desc || '';
  const points = splitIntoPoints(text);
  
  if (points.length > 1) {
    lines.push('### 核心机制拆解');
    lines.push('');
    points.forEach((point, i) => {
      lines.push(`**${i + 1}.** ${point}`);
      lines.push('');
      lines.push(`*通俗理解：${generateSimpleExplanation(point, feature.name)}*`);
      lines.push('');
    });
  }
  
  // 5. Technical details
  lines.push('## 五、技术实现详解');
  lines.push('');
  if (eipDetail?.original) {
    lines.push('### 技术规格');
    lines.push('');
    lines.push(eipDetail.original);
    lines.push('');
  }
  if (eipDetail?.aiSummary) {
    lines.push('### 设计思路');
    lines.push('');
    lines.push(eipDetail.aiSummary);
    lines.push('');
  }
  lines.push('');
  
  // 6. Related EIPs
  lines.push('## 六、关联 EIP');
  lines.push('');
  lines.push(generateRelatedEIPs(feature, upgrade));
  lines.push('');
  
  // 7. Stakeholder impact
  lines.push('## 七、谁会受到影响？');
  lines.push('');
  lines.push(generateStakeholders(feature, eipDetail, upgrade));
  lines.push('');
  
  // 8. History
  lines.push('## 八、历史背景与演进');
  lines.push('');
  lines.push(generateHistory(feature, eipDetail, upgrade));
  lines.push('');
  
  // 9. Terminology
  const terms = generateTerminology(feature, eipDetail, upgrade);
  if (terms) {
    lines.push('## 九、关键术语表');
    lines.push('');
    lines.push('| 术语 | 通俗解释 |');
    lines.push('|------|----------|');
    lines.push(terms);
    lines.push('');
  }
  
  // 10. Extension
  lines.push('## 十、思考与延伸');
  lines.push('');
  lines.push(generateExtension(feature, eipDetail, upgrade));
  lines.push('');
  
  lines.push('---');
  lines.push('*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*');
  
  return lines.join('\n');
}

// ============== EXECUTE ==============

let totalOriginal = 0, totalAi = 0, totalFiles = 0;

for (const upgrade of upgrades) {
  const upgradeId = slugifyUpgrade(upgrade.name);
  
  for (const feature of (upgrade.features || [])) {
    const featureDirName = getFeatureDirName(feature);
    const featureDir = path.join(baseDir, upgradeId, featureDirName);
    
    if (!fs.existsSync(featureDir)) {
      fs.mkdirSync(featureDir, { recursive: true });
    }
    
    const eipDetail = feature.eip ? eipDetails[feature.eip] : null;
    
    // Write original-zh.md
    const originalMd = generateOriginalMd(feature, eipDetail, upgrade);
    fs.writeFileSync(path.join(featureDir, 'original-zh.md'), originalMd);
    totalOriginal += originalMd.length;
    
    // Write ai-introduce-zh.md
    const aiMd = generateAiMd(feature, eipDetail, upgrade);
    fs.writeFileSync(path.join(featureDir, 'ai-introduce-zh.md'), aiMd);
    totalAi += aiMd.length;
    
    totalFiles += 2;
  }
}

console.log(`✅ 内容重写完成！`);
console.log(`   文件数: ${totalFiles}`);
console.log(`   original-zh.md 总字符: ${totalOriginal.toLocaleString()}`);
console.log(`   ai-introduce-zh.md 总字符: ${totalAi.toLocaleString()}`);
console.log(`   平均每个 original: ${Math.round(totalOriginal / (totalFiles/2))} 字符`);
console.log(`   平均每个 AI 解读: ${Math.round(totalAi / (totalFiles/2))} 字符`);
