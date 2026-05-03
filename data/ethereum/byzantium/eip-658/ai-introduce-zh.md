# EIP-658: 状态根替代返回状态 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在This EIP replaces the intermediate state root field of the receipt with a status code indicating if the top-level call succeeded or failed....

这是以太坊协议演进中的重要一步，解决了协议基础的关键挑战。

### 核心矛盾

**协议基础**

这项技术通过优化用状态根（state root）替代交易收据中的返回状态字段。 receipts 的 status 字段现在是一个布尔值，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

With the introduction of the REVERT opcode in EIP140, it is no longer possible for users to assume that a transaction failed iff it consumed all gas. As a result, there is no clear mechanism for calle...

## 三、升级效果：现在怎么样了？

此变更为协议层面的渐进式优化，为长期发展奠定了基础。

## 四、技术概述：用类比讲清楚

**协议基础**

这项技术通过优化用状态根（state root）替代交易收据中的返回状态字段。 receipts 的 status 字段现在是一个布尔值，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 五、技术实现详解

### 技术摘要（Abstract）

This EIP replaces the intermediate state root field of the receipt with a status code indicating if the top-level call succeeded or failed.

### 设计动机（Motivation）

With the introduction of the REVERT opcode in EIP140, it is no longer possible for users to assume that a transaction failed iff it consumed all gas. As a result, there is no clear mechanism for callers to determine whether a transaction succeeded and the state changes contained in it were applied.

Full nodes can provide RPCs to get a transaction return status and value by replaying the transaction, but fast nodes can only do this for nodes after their pivot point, and light nodes cannot do this at all, making a non-consensus solution impractical.

Instead, we propose to replace the intermediate state root, already obsoleted by EIP98, with the return status (1 for success, 0 for failure). This both allows callers to determine success status, and remedies the previous omission of return da

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

For blocks where block.number >= BYZANTIUM_FORK_BLKNUM, the intermediate state root is replaced by a status code, 0 indicating failure (due to any operation that can cause the transaction or top-level call to revert) and 1 indicating success.

## 六、关联 EIP

此 EIP 为相对独立的协议改进，主要与以太坊核心协议交互。详细依赖关系请查看官方 EIP 文档的"Backward Compatibility"和"Security Considerations"章节。

## 七、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 八、历史背景与演进

此特性是协议基础演进的重要组成部分，经过社区充分讨论和测试后实施。它为以太坊的长期发展和生态繁荣奠定了基础。

## 九、关键术语表

| 术语 | 通俗解释 |
|------|----------|
| **gas** | 交易执行的计价单位，类比为"燃料"。操作越复杂，消耗的 gas 越多。 |
| **opcode** | EVM 的基础操作指令，如加法、存储、调用等。每个 opcode 都有对应的 gas 成本。 |
| **blob** | 临时数据容器：每个 128KB，18 天后自动删除，专门给 Rollup 存数据用，比 calldata 便宜 100 倍。 |
| **eip** | 以太坊改进提案（Ethereum Improvement Proposal）：以太坊社区提出协议变更的标准流程。 |

## 十、思考与延伸

以太坊协议仍在持续迭代中。此特性为未来更广泛的升级奠定了基础，社区的讨论和实验将继续推动网络优化。详细路线图可参考以太坊官方文档。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*