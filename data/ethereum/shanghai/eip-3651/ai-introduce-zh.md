# EIP-3651: COINBASE 预热 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在The `COINBASE` address shall be warm at the start of transaction execution, in accordance with the actual cost of reading that account....

这是以太坊协议演进中的重要一步，解决了经济/优化的关键挑战。

### 核心矛盾

**经济/优化**

这项技术通过优化在交易开始时预热 COINBASE 地址，使 COINBASE 在首次访问时按 'warm access'（100 ga，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

Direct `COINBASE` payments are becoming increasingly popular because they allow conditional payments, which provide benefits such as implicit cancellation of transactions that would revert.
But access...

## 三、升级效果：现在怎么样了？

此变更为协议层面的渐进式优化，为长期发展奠定了基础。

## 四、技术概述：用类比讲清楚

**经济/优化**

这项技术通过优化在交易开始时预热 COINBASE 地址，使 COINBASE 在首次访问时按 'warm access'（100 ga，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 五、技术实现详解

### 技术摘要（Abstract）

The `COINBASE` address shall be warm at the start of transaction execution, in accordance with the actual cost of reading that account.

### 设计动机（Motivation）

Direct `COINBASE` payments are becoming increasingly popular because they allow conditional payments, which provide benefits such as implicit cancellation of transactions that would revert.
But accessing `COINBASE` is overpriced; the address is initially cold under the access list framework introduced in [EIP-2929](./eip-2929.md).
This gas cost mismatch can incentivize alternative payments besides ETH, such as [ERC-20](./eip-20.md), but ETH should be the primary means of paying for transactions on Ethereum.

### 关键参数与机制

At the start of transaction execution, `accessed_addresses` shall be initialized to also include the address returned by `COINBASE` (`0x41`).

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-2929** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2929.md)

## 七、🌟 生态影响与相关项目

### 📊 关键数据

> COINBASE预热后gas成本从2600降至100，让验证者直接收款更便宜。The Merge后COINBASE成为验证者fee recipient。

### 🔗 相关协议与项目

**MEV-Boost**
验证者提取MEV收益时COINBASE预热降低费用

**Flashbots**
区块构建者利用预热优化费用支付

---

## 八、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 九、历史背景与演进

此特性是经济/优化演进的重要组成部分，经过社区充分讨论和测试后实施。它为以太坊的长期发展和生态繁荣奠定了基础。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*