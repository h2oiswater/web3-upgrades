# EIP-1153: Transient Storage — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在This proposal introduces transient storage opcodes, which manipulate state that behaves identically to storage, except that transient storage is disca...

这是以太坊协议演进中的重要一步，解决了智能合约的关键挑战。

### 核心矛盾

**智能合约**

这项技术通过优化新增 Transient Storage 操作码 TLOAD (0x5c) 和 TSTORE (0x5d)。Transi，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

Running a transaction in Ethereum can generate multiple nested frames of execution, each created by `CALL` (or similar) instructions. Contracts can be re-entered during the same transaction, in which ...

## 三、升级效果：现在怎么样了？

此变更在智能合约产生了显著效果，提升了协议效率和安全性。

## 四、技术概述：用类比讲清楚

**智能合约**

这项技术通过优化新增 Transient Storage 操作码 TLOAD (0x5c) 和 TSTORE (0x5d)。Transi，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 五、技术实现详解

### 技术摘要（Abstract）

This proposal introduces transient storage opcodes, which manipulate state that behaves identically to storage, except that transient storage is discarded after every transaction, and `TSTORE` is not subject to the gas stipend check as defined in [EIP-2200](./eip-2200.md). In other words, the values of transient storage are never deserialized from storage or serialized to storage. Thus transient storage is cheaper since it never requires disk access. Transient storage is accessible to smart contracts via 2 new opcodes, `TLOAD` and `TSTORE`, where “T” stands for "transient:"

```
TLOAD  (0x5c)
TSTORE (0x5d)
```

### 设计动机（Motivation）

Running a transaction in Ethereum can generate multiple nested frames of execution, each created by `CALL` (or similar) instructions. Contracts can be re-entered during the same transaction, in which case there are more than one frame belonging to one contract. Currently, these frames can communicate in two ways: via inputs/outputs passed via `CALL` instructions, and via storage updates. If there is an intermediate frame belonging to another untrusted contract, communication via inputs/outputs is not secure. Notable example is a reentrancy lock which cannot rely on the intermediate frame to pass through the state of the lock. Communication via storage (`SSTORE`/`SLOAD`) is costly. Transient storage is a dedicated and gas efficient solution to the problem of inter frame communication.

Stor

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

Two new opcodes are added to EVM, `TLOAD` (`0x5c`) and `TSTORE` (`0x5d`). (Note that previous drafts of this EIP specified the values `0xb3` and `0xb4` for `TLOAD` and `TSTORE` respectively to avoid conflict with other EIPs. The conflict has since been removed.)

They use the same arguments on stack as `SLOAD` (`0x54`) and `SSTORE` (`0x55`).

`TLOAD` pops one 32-byte word from the top of the stack, treats this value as the address, fetches 32-byte word from the transient storage at that address,

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-2200** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2200.md)
- **EIP-3529** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-3529.md)

## 七、🌟 生态影响与相关项目

### 📊 关键数据

> Transient Storage让重入保护从SSTORE的20000 gas降至TSTORE的100 gas，DeFi合约交互成本降低95%。

### 🔗 相关协议与项目

**Uniswap v4**
利用Transient Storage实现高效的重入锁和Hooks机制

**CowSwap**
批量拍卖DEX，Transient Storage优化其结算逻辑

---

## 八、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 九、历史背景与演进

此特性是智能合约演进的重要组成部分，经过社区充分讨论和测试后实施。它为以太坊的长期发展和生态繁荣奠定了基础。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*