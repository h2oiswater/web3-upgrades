# EIP-7045: 增加证明包含窗口 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在Increases max attestation inclusion slot from `attestation.slot + SLOTS_PER_EPOCH` to the last slot of epoch `N+1` where `N` is the epoch containing t...

这是以太坊协议演进中的重要一步，解决了质押/共识的关键挑战。

### 核心矛盾

**质押/共识**

这项技术通过优化共识层变更：增加 attestation 的包含窗口，从之前的 1 个 epoch 增加到当前 epoch 和下一个 e，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

Attestations can currently be included after some minimum delay (`1` slot on mainnet) up until `SLOTS_PER_EPOCH` slots after the slot the attestation was created in. This rolling window of one epoch w...

## 三、升级效果：现在怎么样了？

此变更为协议层面的渐进式优化，为长期发展奠定了基础。

## 四、技术概述：用类比讲清楚

**质押/共识**

这项技术通过优化共识层变更：增加 attestation 的包含窗口，从之前的 1 个 epoch 增加到当前 epoch 和下一个 e，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

### 核心机制拆解

**1. Execution layer**

This requires no changes to the Execution Layer.

*通俗理解：以太坊协议层面的优化，让这台全球计算机运转得更高效*

**2. Consensus layer**

Specification changes are built into the Consensus Specs Deneb upgrade.

The specification makes two minor changes to the state transition function:

* Modify [`process_attestation`](https://github.com/ethereum/consensus-specs/blob/95f36d99cf4aa59974da06af24ef9a7c12d3c301/specs/deneb/beacon-chain.md

*通俗理解：临时寄存柜——比永久存档便宜100倍，18天后自动清理*

## 五、技术实现详解

### 技术摘要（Abstract）

Increases max attestation inclusion slot from `attestation.slot + SLOTS_PER_EPOCH` to the last slot of epoch `N+1` where `N` is the epoch containing the attestation slot.

This increase is critical to the current LMD-GHOST security analysis as well as the confirmation rule.

### 设计动机（Motivation）

Attestations can currently be included after some minimum delay (`1` slot on mainnet) up until `SLOTS_PER_EPOCH` slots after the slot the attestation was created in. This rolling window of one epoch was decided upon during Phase 0 because the equal inclusion window for any attestation was assessed as "fair". The alternative considered path was to allow inclusion during the current and next epoch which means attestations created during the start of an epoch have more potential slots of inclusion than those at the end of the epoch.

Since this decision, it has become apparent that the alternative design is critical for current LMD-GHOST security proofs as well as a new confirmation rule (which will allow for block confirmations in approximately 3-4 slots in normal mainnet conditions).

This 

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

| Name | Value | Comment |
| - | - | - |
|`FORK_TIMESTAMP` | `1710338135` | Mainnet |

## 六、关联 EIP

此 EIP 为相对独立的协议改进，主要与以太坊核心协议交互。详细依赖关系请查看官方 EIP 文档的"Backward Compatibility"和"Security Considerations"章节。

## 七、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 八、历史背景与演进

此特性是质押/共识演进的重要组成部分，经过社区充分讨论和测试后实施。它为以太坊的长期发展和生态繁荣奠定了基础。

## 九、思考与延伸

以太坊协议仍在持续迭代中。此特性为未来更广泛的升级奠定了基础，社区的讨论和实验将继续推动网络优化。详细路线图可参考以太坊官方文档。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*