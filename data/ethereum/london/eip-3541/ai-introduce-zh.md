# EIP-3541: 拒绝 0xEF 开头合约 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在Disallow new code starting with the `0xEF` byte to be deployed. Code already existing in the account trie starting with `0xEF` byte is not affected se...

这是以太坊协议演进中的重要一步，解决了协议基础的关键挑战。

### 核心矛盾

**协议基础**

这项技术通过优化拒绝以 0xEF 字节开头的新合约创建。任何尝试创建以 0xEF 开头的 initcode 的交易都会失败并回滚。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

Contracts conforming to the EVM Object Format (EOF) are going to be validated at deploy time. In order to guarantee that every EOF-formatted contract in the state is valid, we need to prevent already ...

## 三、升级效果：现在怎么样了？

此变更为协议层面的渐进式优化，为长期发展奠定了基础。

## 四、技术概述：用类比讲清楚

**协议基础**

这项技术通过优化拒绝以 0xEF 字节开头的新合约创建。任何尝试创建以 0xEF 开头的 initcode 的交易都会失败并回滚。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

### 核心机制拆解

**1. Remarks**

The *initcode* is the code executed in the context of the *create* transaction, `CREATE`, or `CREATE2` instructions. The *initcode* returns *code* (via the `RETURN` instruction), which is inserted into the account. See section 7 ("Contract Creation") in the Yellow Paper for more information.

The op

*通俗理解：提前预定包间——餐厅没开门就知道自己坐哪桌*

## 五、技术实现详解

### 技术摘要（Abstract）

Disallow new code starting with the `0xEF` byte to be deployed. Code already existing in the account trie starting with `0xEF` byte is not affected semantically by this change.

### 设计动机（Motivation）

Contracts conforming to the EVM Object Format (EOF) are going to be validated at deploy time. In order to guarantee that every EOF-formatted contract in the state is valid, we need to prevent already deployed (and not validated) contracts from being recognized as such format. This will be achieved by choosing a byte sequence for the *magic* that doesn't exist in any of the already deployed contracts. To prevent the growth of the search space and to limit the analysis to the contracts existing before this fork, we disallow the starting byte of the format (the first byte of the magic).

Should the EVM Object Format proposal not be deployed in the future, the *magic* can be used by other features depending on versioning. In the case versioning becomes obsolete, it is simple to roll this back 

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

After `block.number == HF_BLOCK` new contract creation (via create transaction, `CREATE` or `CREATE2` instructions) results in an exceptional abort if the _code_'s first byte is `0xEF`. 

### Remarks

The *initcode* is the code executed in the context of the *create* transaction, `CREATE`, or `CREATE2` instructions. The *initcode* returns *code* (via the `RETURN` instruction), which is inserted into the account. See section 7 ("Contract Creation") in the Yellow Paper for more information.

The o

## 六、关联 EIP

此 EIP 为相对独立的协议改进，主要与以太坊核心协议交互。详细依赖关系请查看官方 EIP 文档的"Backward Compatibility"和"Security Considerations"章节。

## 七、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 八、历史背景与演进

此特性是协议基础演进的重要组成部分，经过社区充分讨论和测试后实施。它为以太坊的长期发展和生态繁荣奠定了基础。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*