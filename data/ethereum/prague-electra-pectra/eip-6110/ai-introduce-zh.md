# EIP-6110: 链上验证者存款 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在Appends validator deposits to the Execution Layer block structure. This shifts responsibility of deposit inclusion and validation to the Execution Lay...

这是以太坊协议演进中的重要一步，解决了质押/共识的关键挑战。

### 核心矛盾

**质押/共识**

这项技术通过优化共识层变更：将验证者存款直接提交到执行层区块中，而非通过 deposit 合约事件来传递。存款数据现在作为执行层区块的一，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

Validator deposits are a core component of the proof-of-stake consensus mechanism. This EIP allows for an in-protocol mechanism of deposit processing on the Consensus Layer and eliminates the proposer...

## 三、升级效果：现在怎么样了？

此变更在质押/共识产生了显著效果，提升了协议效率和安全性。

## 四、技术概述：用类比讲清楚

**质押/共识**

这项技术通过优化共识层变更：将验证者存款直接提交到执行层区块中，而非通过 deposit 合约事件来传递。存款数据现在作为执行层区块的一，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

### 核心机制拆解

**1. Consensus layer**

Consensus layer changes can be summarized into the following list:

1. `ExecutionRequests` is extended with a new `deposit_requests` field to accommodate deposit requests list.
2. `BeaconState` is appended with `deposit_requests_start_index` used to switch from the former deposit mechanism to the ne

*通俗理解：以太坊协议层面的优化，让这台全球计算机运转得更高效*

## 五、技术实现详解

### 技术摘要（Abstract）

Appends validator deposits to the Execution Layer block structure. This shifts responsibility of deposit inclusion and validation to the Execution Layer and removes the need for deposit (or `eth1data`) voting from the Consensus Layer.

Validator deposits list supplied in a block is obtained by parsing deposit contract log events emitted by each deposit transaction included in a given block.

### 设计动机（Motivation）

Validator deposits are a core component of the proof-of-stake consensus mechanism. This EIP allows for an in-protocol mechanism of deposit processing on the Consensus Layer and eliminates the proposer voting mechanism utilized currently. This proposed mechanism relaxes safety assumptions and reduces complexity of client software design, contributing to the security of the deposits flow. It also improves validator UX.

Advantages of in-protocol deposit processing consist of, but are not limited to, the following:

* Significant increase of deposits security by supplanting proposer voting. With the proposed in-protocol mechanism, an honest online node can't be convinced to process fake deposits even when more than 2/3 portion of stake is adversarial.
* Decrease of delay between submitting de

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

| Name | Value | Comment |
| - | - | - |
|`DEPOSIT_REQUEST_TYPE` | `b'0'` | The [EIP-7685](./eip-7685.md) request type byte for deposit operation |

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-4881** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4881.md)
- **EIP-7685** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7685.md)

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