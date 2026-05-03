# EIP-3860: initcode 大小限制 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在We extend [EIP-170](./eip-170.md) by introducing a maximum size limit for `initcode` (`MAX_INITCODE_SIZE = 2 * MAX_CODE_SIZE = 49152`).

Furthermore, ...

这是以太坊协议演进中的重要一步，解决了协议基础的关键挑战。

### 核心矛盾

**协议基础**

这项技术通过优化限制合约 initcode 最大为 49152 字节（2 * 0x6000），并对每 32 字节的 initcode w，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

During contract creation the client has to perform jumpdest-analysis on the `initcode` prior to execution. The work performed scales linearly with the size of the `initcode`. This work currently is no...

## 三、升级效果：现在怎么样了？

此变更为协议层面的渐进式优化，为长期发展奠定了基础。

## 四、技术概述：用类比讲清楚

**协议基础**

这项技术通过优化限制合约 initcode 最大为 49152 字节（2 * 0x6000），并对每 32 字节的 initcode w，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

### 核心机制拆解

**1. Rules**

1. If length of transaction data (`initcode`) in a create transaction exceeds `MAX_INITCODE_SIZE`, transaction is invalid. (*Note that this is similar to transactions considered invalid for not meeting the intrinsic gas cost requirement.*)
2. For a create transaction, extend the transaction data cos

*通俗理解：高速公路收费站——不同车辆收费标准不同*

## 五、技术实现详解

### 技术摘要（Abstract）

We extend [EIP-170](./eip-170.md) by introducing a maximum size limit for `initcode` (`MAX_INITCODE_SIZE = 2 * MAX_CODE_SIZE = 49152`).

Furthermore, we introduce a charge of `2` gas for every 32-byte chunk of `initcode` to represent the cost of jumpdest-analysis.

Lastly, the size limit results in the nice-to-have property that EVM code size, code offset (`PC`), and jump offset fits a 16-bit value.

### 设计动机（Motivation）

During contract creation the client has to perform jumpdest-analysis on the `initcode` prior to execution. The work performed scales linearly with the size of the `initcode`. This work currently is not metered, nor is there a protocol enforced upper bound for the size.

There are three costs charged today:

1. Cost for calldata aka `initcode`: 4 gas for a byte with the value of zero, and 16 gas otherwise.
2. Cost for the resulting deployed code: 200 gas per byte.
3. Cost of address calculation (hashing of code) in case of `CREATE2` only: 6 gas per word.

Only the first cost applies to `initcode`, but only in the case of contract creation transactions. For the case of `CREATE`/`CREATE2` there is no such cost, and it is possible to programmatically generate variations of `initcode` in a rela

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

| Constant             | Value               |
| -------------------- | ------------------- |
| `INITCODE_WORD_COST` | `2`                 |
| `MAX_INITCODE_SIZE`  | `2 * MAX_CODE_SIZE` |

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-170** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-170.md)
- **EIP-1014** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1014.md)

## 七、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 八、历史背景与演进

此特性是协议基础演进的重要组成部分，经过社区充分讨论和测试后实施。它为以太坊的长期发展和生态繁荣奠定了基础。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*