# EIP-3855: PUSH0 操作码 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在Introduce the `PUSH0` (`0x5f`) instruction, which pushes the constant value 0 onto the stack....

这是以太坊协议演进中的重要一步，解决了协议基础的关键挑战。

### 核心矛盾

**协议基础**

这项技术通过优化新增 PUSH0 操作码（0x5f），将 0 推入 EVM 堆栈，gas 成本为 2。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

Many instructions expect offsets as inputs, which in a number of cases are zero. A good example is the return data parameters of `CALLs`, which are set to zeroes in case the contract prefers using `RE...

## 三、升级效果：现在怎么样了？

此变更为协议层面的渐进式优化，为长期发展奠定了基础。

## 四、技术概述：用类比讲清楚

**协议基础**

这项技术通过优化新增 PUSH0 操作码（0x5f），将 0 推入 EVM 堆栈，gas 成本为 2。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 五、技术实现详解

### 技术摘要（Abstract）

Introduce the `PUSH0` (`0x5f`) instruction, which pushes the constant value 0 onto the stack.

### 设计动机（Motivation）

Many instructions expect offsets as inputs, which in a number of cases are zero. A good example is the return data parameters of `CALLs`, which are set to zeroes in case the contract prefers using `RETURNDATA*`. This is only one example, but there are many other reasons why a contract would need to push a zero value. They can achieve that today by `PUSH1 0`, which costs 3 gas at runtime, and is encoded as two bytes which means `2 * 200` gas deployment cost.

Because of the overall cost many try to use various other instructions to achieve the same effect. Common examples include `PC`, `MSIZE`, `CALLDATASIZE`, `RETURNDATASIZE`, `CODESIZE`, `CALLVALUE`, and `SELFBALANCE`. Some of these cost only 2 gas and are a single byte long, but their value can depend on the context.

We have conducted a

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

The instruction `PUSH0` is introduced at `0x5f`. It has no immediate data, pops no items from the stack, and places a single item with the value 0 onto the stack. The cost of this instruction is 2 gas (aka `base`).

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