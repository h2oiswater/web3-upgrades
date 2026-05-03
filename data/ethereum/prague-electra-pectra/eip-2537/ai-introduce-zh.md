# EIP-2537: BLS 预编译 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在Add functionality to efficiently perform operations over the BLS12-381 curve, including those for BLS signature verification.

Along with the curve ar...

这是以太坊协议演进中的重要一步，解决了密码学/共识的关键挑战。

### 核心矛盾

**密码学/共识**

这项技术通过优化新增 BLS12-381 曲线预编译合约。BLS12-381 是信标链使用的椭圆曲线。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

The motivation of this precompile is to add a cryptographic primitive that allows to get 120+ bits of security for operations over pairing friendly curve compared to the existing BN254 precompile that...

## 三、升级效果：现在怎么样了？

此变更在密码学/共识产生了显著效果，提升了协议效率和安全性。

## 四、技术概述：用类比讲清楚

**密码学/共识**

这项技术通过优化新增 BLS12-381 曲线预编译合约。BLS12-381 是信标链使用的椭圆曲线。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

### 核心机制拆解

**1. Curve parameters**

The BLS12 curve is fully defined by the following set of parameters (coefficient `A=0` for all BLS12 curves):


Base field modulus = p = 0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab
Fp - finite field of size p
Curve Fp equation: Y^2 = X^3+B (m

*通俗理解：以太坊协议层面的优化，让这台全球计算机运转得更高效*

**2. Fields and Groups**

Field Fp is defined as the finite field of size `p` with elements represented as integers between 0 and p-1 (both inclusive).

Field Fp2 is defined as `Fp[X]/(X^2-nr2)` with elements  `el = c0 + c1 * v`, where `v` is the formal square root of `nr2` represented as integer pairs `(c0,c1)`.

Group G1 i

*通俗理解：以太坊协议层面的优化，让这台全球计算机运转得更高效*

**3. Fine points and encoding of base elements**

#### Field elements encoding:

In order to produce inputs to an operation, one encodes elements of the base field and the extension field.

A base field element (Fp) is encoded as `64` bytes by performing the BigEndian encoding of the corresponding (unsigned) integer. Due to the size of `p`, the top

*通俗理解：以太坊协议层面的优化，让这台全球计算机运转得更高效*

**4. ABI for operations**

#### ABI for G1 addition

G1 addition call expects `256` bytes as an input that is interpreted as byte concatenation of two G1 points (`128` bytes each). Output is an encoding of addition operation result - single G1 point (`128` bytes).

Error cases:

- Invalid coordinate encoding
- An input is nei

*通俗理解：以太坊协议层面的优化，让这台全球计算机运转得更高效*

## 五、技术实现详解

### 技术摘要（Abstract）

Add functionality to efficiently perform operations over the BLS12-381 curve, including those for BLS signature verification.

Along with the curve arithmetic, multi-scalar-multiplication operations are included to efficiently aggregate public keys or individual signer's signatures during BLS signature verification.

### 设计动机（Motivation）

The motivation of this precompile is to add a cryptographic primitive that allows to get 120+ bits of security for operations over pairing friendly curve compared to the existing BN254 precompile that only provides 80 bits of security.

### 关键参数与机制

| Name                | Value | Comment            |
|---------------------|-------|--------------------|
| BLS12_G1ADD         | 0x0b  | precompile address |
| BLS12_G1MSM         | 0x0c  | precompile address |
| BLS12_G2ADD         | 0x0d  | precompile address |
| BLS12_G2MSM         | 0x0e  | precompile address |
| BLS12_PAIRING_CHECK | 0x0f  | precompile address |
| BLS12_MAP_FP_TO_G1  | 0x10  | precompile address |
| BLS12_MAP_FP2_TO_G2 | 0x11  | precompile address |

## 六、关联 EIP

此 EIP 为相对独立的协议改进，主要与以太坊核心协议交互。详细依赖关系请查看官方 EIP 文档的"Backward Compatibility"和"Security Considerations"章节。

## 七、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 八、历史背景与演进

此特性是密码学/共识演进的重要组成部分，经过社区充分讨论和测试后实施。它为以太坊的长期发展和生态繁荣奠定了基础。

## 九、思考与延伸

以太坊协议仍在持续迭代中。此特性为未来更广泛的升级奠定了基础，社区的讨论和实验将继续推动网络优化。详细路线图可参考以太坊官方文档。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*