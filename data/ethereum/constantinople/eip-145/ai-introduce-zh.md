# EIP-145: SHL/SHR 移位操作码 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在Native bitwise shifting instructions are introduced, which are more efficient processing wise on the host and are cheaper to use by a contract....

这是以太坊协议演进中的重要一步，解决了协议基础的关键挑战。

### 核心矛盾

**协议基础**

这项技术通过优化新增 SHL (0x1b) 和 SHR (0x1c) 移位操作码，提供原生的左移和右移位运算，gas 成本固定为 3。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

EVM is lacking bitwise shifting operators, but supports other logical and arithmetic operators. Shift operations can be implemented via arithmetic operators, but that has a higher cost and requires mo...

## 三、升级效果：现在怎么样了？

此变更为协议层面的渐进式优化，为长期发展奠定了基础。

## 四、技术概述：用类比讲清楚

**协议基础**

这项技术通过优化新增 SHL (0x1b) 和 SHR (0x1c) 移位操作码，提供原生的左移和右移位运算，gas 成本固定为 3。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

### 核心机制拆解

**1. `0x1b`: `SHL` (shift left)**

The `SHL` instruction (shift left) pops 2 values from the stack, first `arg1` and then `arg2`, and pushes on the stack `arg2` shifted to the left by `arg1` number of bits. The result is equal to

```
(arg2 * 2^arg1) mod 2^256
```

Notes:

- The value (`arg2`) is interpreted as an unsigned number.
- 

*通俗理解：以太坊协议层面的优化，让这台全球计算机运转得更高效*

**2. `0x1c`: `SHR` (logical shift right)**

The `SHR` instruction (logical shift right) pops 2 values from the stack, first `arg1` and then `arg2`, and pushes on the stack `arg2` shifted to the right by `arg1` number of bits with zero fill. The result is equal to

```
floor(arg2 / 2^arg1)
```

Notes:

- The value (`arg2`) is interpreted as an

*通俗理解：以太坊协议层面的优化，让这台全球计算机运转得更高效*

**3. `0x1d`: `SAR` (arithmetic shift right)**

The `SAR` instruction (arithmetic shift right) pops 2 values from the stack, first `arg1` and then `arg2`, and pushes on the stack `arg2` shifted to the right by `arg1` number of bits with sign extension. The result is equal to

```
floor(arg2 / 2^arg1)
```

Notes:

- The value (`arg2`) is interpret

*通俗理解：以太坊协议层面的优化，让这台全球计算机运转得更高效*

## 五、技术实现详解

### 技术摘要（Abstract）

Native bitwise shifting instructions are introduced, which are more efficient processing wise on the host and are cheaper to use by a contract.

### 设计动机（Motivation）

EVM is lacking bitwise shifting operators, but supports other logical and arithmetic operators. Shift operations can be implemented via arithmetic operators, but that has a higher cost and requires more processing time from the host. Implementing `SHL` and `SHR` using arithmetic cost each 35 gas, while the proposed instructions take 3 gas.

### 关键参数与机制

The following instructions are introduced:

### `0x1b`: `SHL` (shift left)

The `SHL` instruction (shift left) pops 2 values from the stack, first `arg1` and then `arg2`, and pushes on the stack `arg2` shifted to the left by `arg1` number of bits. The result is equal to

```
(arg2 * 2^arg1) mod 2^256
```

Notes:

- The value (`arg2`) is interpreted as an unsigned number.
- The shift amount (`arg1`) is interpreted as an unsigned number.
- If the shift amount (`arg1`) is greater or equal 256 the r

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