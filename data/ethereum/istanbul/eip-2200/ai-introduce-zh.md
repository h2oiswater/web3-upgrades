# EIP-2200: SSTORE gas 净计量 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在This EIP provides a structured definition of net gas metering changes
for `SSTORE` opcode, enabling new usages for contract storage, and
reducing exce...

这是以太坊协议演进中的重要一步，解决了经济/安全的关键挑战。

### 核心矛盾

**经济/安全**

这项技术通过优化改进 SSTORE 的净计量（Net Gas Metering），综合原始值、当前值和新值三态：原始=当前=新值时收取 ，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

This EIP proposes a way for gas metering on `SSTORE`, using information
that is more universally available to most implementations, and
require as little change in implementation structures as possibl...

## 三、升级效果：现在怎么样了？

此变更在经济/安全产生了显著效果，提升了协议效率和安全性。

## 四、技术概述：用类比讲清楚

**经济/安全**

这项技术通过优化改进 SSTORE 的净计量（Net Gas Metering），综合原始值、当前值和新值三态：原始=当前=新值时收取 ，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 五、技术实现详解

### 技术摘要（Abstract）

This EIP provides a structured definition of net gas metering changes
for `SSTORE` opcode, enabling new usages for contract storage, and
reducing excessive gas costs where it doesn’t match how most
implementation works.

This is a combination of [EIP-1283] and [EIP-1706].

### 设计动机（Motivation）

This EIP proposes a way for gas metering on `SSTORE`, using information
that is more universally available to most implementations, and
require as little change in implementation structures as possible.

* Storage slot’s original value.
* Storage slot’s current value.
* Refund counter.

Usages that benefits from this EIP’s gas reduction scheme includes:

* Subsequent storage write operations within the same call frame. This
  includes reentry locks, same-contract multi-send, etc.
* Exchange storage information between sub call frame and parent call
  frame, where this information does not need to be persistent outside
  of a transaction. This includes sub-frame error codes and message
  passing, etc.

The original definition of EIP-1283 created a danger of a new kind of
reentrancy attacks 

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

Define variables `SLOAD_GAS`, `SSTORE_SET_GAS`, `SSTORE_RESET_GAS` and
`SSTORE_CLEARS_SCHEDULE`. The old and new values for those variables
are:

* `SLOAD_GAS`: changed from `200` to `800`.
* `SSTORE_SET_GAS`: `20000`, not changed.
* `SSTORE_RESET_GAS`: `5000`, not changed.
* `SSTORE_CLEARS_SCHEDULE`: `15000`, not changed.

Change the definition of EIP-1283 using those variables. The new
specification, combining EIP-1283 and EIP-1706, will look like
below. The terms *original value*, *current va

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-1283** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1283.md)
- **EIP-1706** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1706.md)
- **EIP-1087** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1087.md)
- **EIP-1153** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1153.md)
- **EIP-658** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-658.md)

## 七、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 八、历史背景与演进

此特性是经济/安全演进的重要组成部分，经过社区充分讨论和测试后实施。它为以太坊的长期发展和生态繁荣奠定了基础。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*