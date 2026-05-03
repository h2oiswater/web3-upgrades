# EIP-150: IO 密集型操作码提价 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

这项技术解决了以太坊网络在安全/DoS面临的关键挑战。其目标是提升网络性能、安全性或可用性，为以太坊的长期演进奠定基础。

### 核心矛盾

**安全/DoS**

这项技术通过优化提高 IO 密集型操作码的 gas 成本：EXTCODESIZE 从 20 到 700，BALANCE 从 20 到 4，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

通过优化安全/DoS，提升以太坊网络的性能、安全性或可用性，为后续技术演进奠定基础。

## 三、升级效果：现在怎么样了？

此变更对以太坊生态产生了深远影响，推动了安全/DoS的技术发展和应用创新。

## 四、技术概述：用类比讲清楚

**安全/DoS**

这项技术通过优化提高 IO 密集型操作码的 gas 成本：EXTCODESIZE 从 20 到 700，BALANCE 从 20 到 4，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

### 核心机制拆解

**1. Rationale**

Recent denial-of-service attacks have shown that opcodes that read the state tree are under-priced relative to other opcodes. There are software changes that have been made, are being made and can be made in order to mitigate the situation; however, the fact will remain that such opcodes will be by 

*通俗理解：以太坊协议层面的优化，让这台全球计算机运转得更高效*

## 五、技术实现详解

### 关键参数与机制

If `block.number >= FORK_BLKNUM`, then:
- Increase the gas cost of EXTCODESIZE to 700 (from 20).
- Increase the base gas cost of EXTCODECOPY to 700 (from 20).
- Increase the gas cost of BALANCE to 400 (from 20).
- Increase the gas cost of SLOAD to 200 (from 50).
- Increase the gas cost of CALL, DELEGATECALL, CALLCODE to 700 (from 40).
- Increase the gas cost of SELFDESTRUCT to 5000 (from 0).
- If SELFDESTRUCT hits a newly created account, it triggers an additional gas cost of 25000 (similar to C

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-90** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-90.md)
- **EIP-114** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-114.md)

## 七、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 八、历史背景与演进

2016 年 9-10 月，以太坊遭受了持续的 DoS 攻击，攻击者利用 EXTCODESIZE、SLOAD 等廉价操作码反复读取状态，导致节点同步几乎停滞。Tangerine Whistle 是一次紧急止血。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*