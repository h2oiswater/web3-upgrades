# EIP-3529: 减少 gas 退款 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

这项技术解决了以太坊网络在经济/安全面临的关键挑战。其目标是提升网络性能、安全性或可用性，为以太坊的长期演进奠定基础。

### 核心矛盾

**经济/安全**

这项技术通过优化限制 gas 退款机制：1) 取消 SELFDESTRUCT 的 gas 退款；2) SSTORE 清除的退款从 150，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

Gas refunds for `SSTORE` and `SELFDESTRUCT` were originally introduced to motivate application developers to write applications that practice "good state hygiene", clearing storage slots and contracts...

## 三、升级效果：现在怎么样了？

此变更在经济/安全产生了显著效果，提升了协议效率和安全性。

## 四、技术概述：用类比讲清楚

**经济/安全**

这项技术通过优化限制 gas 退款机制：1) 取消 SELFDESTRUCT 的 gas 退款；2) SSTORE 清除的退款从 150，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 五、技术实现详解

### 设计动机（Motivation）

Gas refunds for `SSTORE` and `SELFDESTRUCT` were originally introduced to motivate application developers to write applications that practice "good state hygiene", clearing storage slots and contracts that are no longer needed. However, the benefits of this technique have proven to be far lower than anticipated, and gas refunds have had multiple unexpected harmful consequences:

* Refunds give rise to GasToken. GasToken has benefits in moving gas space from low-fee periods to high-fee periods, but it also has downsides to the network, particularly in exacerbating state size (as state slots are effectively used as a "battery" to save up gas) and inefficiently clogging blockchain gas usage
* Refunds increase block size variance. The theoretical maximum amount of actual gas consumed in a bloc

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

| Constant | Value |
| - | - |
| `FORK_BLOCK` | TBD |
| `MAX_REFUND_QUOTIENT` | 5 |

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-1559** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)
- **EIP-2200** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2200.md)
- **EIP-2929** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2929.md)
- **EIP-2930** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2930.md)

## 七、🌟 生态影响与相关项目

### 📊 关键数据

> SELFDESTRUCT退款取消、SSTORE退款从15000降至4800，堵住了gas套利漏洞，同时保留合理的清理激励。

### 🔗 相关协议与项目

**GasToken**
Gas套利代币项目因EIP-3529失效，结束了gas refund套利时代

---

## 八、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 九、历史背景与演进

此特性是经济/安全演进的重要组成部分，经过社区充分讨论和测试后实施。它为以太坊的长期发展和生态繁荣奠定了基础。

## 十、关键术语表

| 术语 | 通俗解释 |
|------|----------|
| **gas** | 交易执行的计价单位，类比为"燃料"。操作越复杂，消耗的 gas 越多。 |
| **opcode** | EVM 的基础操作指令，如加法、存储、调用等。每个 opcode 都有对应的 gas 成本。 |
| **storage** | 智能合约的永久存储空间，读写成本很高（因为数据要永久保存）。 |
| **blob** | 临时数据容器：每个 128KB，18 天后自动删除，专门给 Rollup 存数据用，比 calldata 便宜 100 倍。 |
| **slot** | 时隙，约 12 秒。每个 slot 有一个验证者负责提议区块。 |
| **eip** | 以太坊改进提案（Ethereum Improvement Proposal）：以太坊社区提出协议变更的标准流程。 |

## 十一、思考与延伸

以太坊协议仍在持续迭代中。此特性为未来更广泛的升级奠定了基础，社区的讨论和实验将继续推动网络优化。详细路线图可参考以太坊官方文档。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*