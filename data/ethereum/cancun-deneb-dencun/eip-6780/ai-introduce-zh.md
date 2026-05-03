# EIP-6780: 限制 SELFDESTRUCT — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在This EIP changes the functionality of the `SELFDESTRUCT` opcode. The new functionality will be only to send all Ether in the account to the target, ex...

这是以太坊协议演进中的重要一步，解决了协议基础的关键挑战。

### 核心矛盾

**协议基础**

这项技术通过优化限制 SELFDESTRUCT：只有在同一交易中创建并自毁的合约才能将 ETH 转移到指定地址。现有的自毁合约在 Can，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

The `SELFDESTRUCT` opcode requires large changes to the state of an account, in particular removing all code and storage. This will not be possible in the future with Verkle trees: Each account will b...

## 三、升级效果：现在怎么样了？

此变更在协议基础产生了显著效果，提升了协议效率和安全性。

## 四、技术概述：用类比讲清楚

**协议基础**

这项技术通过优化限制 SELFDESTRUCT：只有在同一交易中创建并自毁的合约才能将 ETH 转移到指定地址。现有的自毁合约在 Can，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 五、技术实现详解

### 技术摘要（Abstract）

This EIP changes the functionality of the `SELFDESTRUCT` opcode. The new functionality will be only to send all Ether in the account to the target, except that the current behaviour is preserved when `SELFDESTRUCT` is called in the same transaction a contract was created.

### 设计动机（Motivation）

The `SELFDESTRUCT` opcode requires large changes to the state of an account, in particular removing all code and storage. This will not be possible in the future with Verkle trees: Each account will be stored in many different account keys, which will not be obviously connected to the root account.

This EIP implements this change. Applications that only use `SELFDESTRUCT` to retrieve funds will still work. Applications that only use `SELFDESTRUCT` in the same transaction as they created a contract will also continue to work without any changes.

### 关键参数与机制

The behaviour of `SELFDESTRUCT` is changed in the following way:

1. When `SELFDESTRUCT` is executed in a transaction that is not the same as the contract calling `SELFDESTRUCT` was created:

   - The current execution frame halts.
   - `SELFDESTRUCT` does not delete any data (including storage keys, code, or the account itself).
   - `SELFDESTRUCT` transfers the entire account balance to the target.
   - Note that if the target is the same as the contract calling `SELFDESTRUCT` there is no net 

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-3529** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-3529.md)
- **EIP-2929** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2929.md)
- **EIP-6049** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-6049.md)

## 七、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 八、历史背景与演进

此特性是协议基础演进的重要组成部分，经过社区充分讨论和测试后实施。它为以太坊的长期发展和生态繁荣奠定了基础。

## 九、思考与延伸

以太坊协议仍在持续迭代中。此特性为未来更广泛的升级奠定了基础，社区的讨论和实验将继续推动网络优化。详细路线图可参考以太坊官方文档。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*