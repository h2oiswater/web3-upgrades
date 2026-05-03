# EIP-2930: 可选访问列表交易 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在We introduce a new [EIP-2718](./eip-2718.md) transaction type, with the format `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, acce...

这是以太坊协议演进中的重要一步，解决了协议基础的关键挑战。

### 核心矛盾

**协议基础**

这项技术通过优化引入可选访问列表的交易类型（类型 0x01）。交易可以声明将在执行中访问的地址和存储槽列表，这些访问被视为 'warm'，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

This EIP serves two functions:

1. Mitigates contract breakage risks introduced by [EIP-2929](./eip-2929.md), as transactions could pre-specify and pre-pay for the accounts and storage slots that the ...

## 三、升级效果：现在怎么样了？

此变更在协议基础产生了显著效果，提升了协议效率和安全性。

## 四、技术概述：用类比讲清楚

**协议基础**

这项技术通过优化引入可选访问列表的交易类型（类型 0x01）。交易可以声明将在执行中访问的地址和存储槽列表，这些访问被视为 'warm'，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

### 核心机制拆解

**1. Parameters**

| Constant | Value |
| - | - |
| `FORK_BLOCK` | 12244000 |
| `ACCESS_LIST_STORAGE_KEY_COST` | 1900 |
| `ACCESS_LIST_ADDRESS_COST` | 2400 |

As of `FORK_BLOCK_NUMBER`, a new [EIP-2718](./eip-2718.md) transaction is introduced with `TransactionType` `1`.

The [EIP-2718](./eip-2718.md) `TransactionPayl

*通俗理解：保险箱——永久存储但存取费用高*

## 五、技术实现详解

### 技术摘要（Abstract）

We introduce a new [EIP-2718](./eip-2718.md) transaction type, with the format `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, signatureYParity, signatureR, signatureS])`.

The `accessList` specifies a list of addresses and storage keys; these addresses and storage keys are added into the `accessed_addresses` and `accessed_storage_keys` global sets (introduced in [EIP-2929](./eip-2929.md)). A gas cost is charged, though at a discount relative to the cost of accessing outside the list.

### 设计动机（Motivation）

This EIP serves two functions:

1. Mitigates contract breakage risks introduced by [EIP-2929](./eip-2929.md), as transactions could pre-specify and pre-pay for the accounts and storage slots that the transaction plans to access; as a result, in the actual execution, the SLOAD and EXT* opcodes would only cost 100 gas: low enough that it would not only prevent breakage due to that EIP but also "unstuck" any contracts that became stuck due to EIP 1884.
2. Introduces the access list format and the logic for handling the format. This logic can later be repurposed for many other purposes, including block-wide witnesses, use in ReGenesis, moving toward static state access over time, and more.

### 关键参数与机制

| Constant | Value |
| - | - |
| `FORK_BLOCK` | 12244000 |
| `ACCESS_LIST_STORAGE_KEY_COST` | 1900 |
| `ACCESS_LIST_ADDRESS_COST` | 2400 |

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-2718** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2718.md)
- **EIP-2929** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2929.md)
- **EIP-2028** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2028.md)

## 七、🌟 生态影响与相关项目

### 📊 关键数据

> 访问列表交易让用户提前声明访问路径，获得gas折扣。适用于多跳swap、批量操作等复杂场景。

### 🔗 相关协议与项目

**1inch**
DEX聚合器利用访问列表优化多跳交易gas成本

**Matcha**
0x协议前端，使用EIP-2930降低复杂交易费用

---

## 八、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 九、历史背景与演进

此特性是协议基础演进的重要组成部分，经过社区充分讨论和测试后实施。它为以太坊的长期发展和生态繁荣奠定了基础。

## 十、关键术语表

| 术语 | 通俗解释 |
|------|----------|
| **gas** | 交易执行的计价单位，类比为"燃料"。操作越复杂，消耗的 gas 越多。 |
| **opcode** | EVM 的基础操作指令，如加法、存储、调用等。每个 opcode 都有对应的 gas 成本。 |
| **calldata** | 以太坊交易中携带的输入数据，永久存储在链上，费用较高。 |
| **storage** | 智能合约的永久存储空间，读写成本很高（因为数据要永久保存）。 |
| **blob** | 临时数据容器：每个 128KB，18 天后自动删除，专门给 Rollup 存数据用，比 calldata 便宜 100 倍。 |
| **slot** | 时隙，约 12 秒。每个 slot 有一个验证者负责提议区块。 |
| **eip** | 以太坊改进提案（Ethereum Improvement Proposal）：以太坊社区提出协议变更的标准流程。 |
| **hard fork** | 硬分叉：协议规则的不兼容变更，所有节点必须升级才能继续参与网络。 |

## 十一、思考与延伸

以太坊协议仍在持续迭代中。此特性为未来更广泛的升级奠定了基础，社区的讨论和实验将继续推动网络优化。详细路线图可参考以太坊官方文档。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*