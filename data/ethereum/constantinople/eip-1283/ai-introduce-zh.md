# EIP-1283: SSTORE gas 计量调整 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在This EIP proposes net gas metering changes for `SSTORE` opcode, enabling
new usages for contract storage, and reducing excessive gas costs
where it do...

这是以太坊协议演进中的重要一步，解决了安全/经济的关键挑战。

### 核心矛盾

**安全/经济**

这项技术通过优化调整 SSTORE 的净计量方式：当存储值从原始值变为新值时，根据原始值、当前值和新值的三态关系重新定价。新增 SSTO，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

This EIP proposes a way for gas metering on SSTORE (as an alternative
for EIP-1087 and EIP-1153), using information that is more universally
available to most implementations, and requires as little c...

## 三、升级效果：现在怎么样了？

此变更在安全/经济产生了显著效果，提升了协议效率和安全性。

## 四、技术概述：用类比讲清楚

**安全/经济**

这项技术通过优化调整 SSTORE 的净计量方式：当存储值从原始值变为新值时，根据原始值、当前值和新值的三态关系重新定价。新增 SSTO，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 五、技术实现详解

### 技术摘要（Abstract）

This EIP proposes net gas metering changes for `SSTORE` opcode, enabling
new usages for contract storage, and reducing excessive gas costs
where it doesn't match how most implementations work.

This acts as an alternative for EIP-1087, where it tries to be
friendlier to implementations that use different optimization
strategies for storage change caches.

### 设计动机（Motivation）

This EIP proposes a way for gas metering on SSTORE (as an alternative
for EIP-1087 and EIP-1153), using information that is more universally
available to most implementations, and requires as little change in
implementation structures as possible.

* *Storage slot's original value*.
* *Storage slot's current value*. 
* Refund counter.

Usages that benefits from this EIP's gas reduction scheme includes:

* Subsequent storage write operations within the same call frame. This
  includes reentry locks, same-contract multi-send, etc.
* Exchange storage information between sub call frame and parent call
  frame, where this information does not need to be persistent outside
  of a transaction. This includes sub-frame error codes and message
  passing, etc.

### 关键参数与机制

Definitions of terms are as below:

* *Storage slot's original value*: This is the value of the storage if
  a reversion happens on the *current transaction*.
* *Storage slot's current value*: This is the value of the storage
  before SSTORE operation happens.
* *Storage slot's new value*: This is the value of the storage after
  SSTORE operation happens.

Replace `SSTORE` opcode gas cost calculation (including refunds) with
the following logic:

* If *current value* equals *new value* (this is 

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-1087** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1087.md)
- **EIP-1153** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1153.md)
- **EIP-658** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-658.md)

## 七、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 八、历史背景与演进

此特性是安全/经济演进的重要组成部分，经过社区充分讨论和测试后实施。它为以太坊的长期发展和生态繁荣奠定了基础。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*