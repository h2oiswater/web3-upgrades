# EIP-196: bn256 加法预编译 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在This EIP suggests to add precompiled contracts for addition and scalar multiplication on a specific pairing-friendly elliptic curve. This can in turn ...

这是以太坊协议演进中的重要一步，解决了密码学/L2的关键挑战。

### 核心矛盾

**密码学/L2**

这项技术通过优化在地址 0x06 添加椭圆曲线 alt_bn128 上的点加法预编译合约。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

Current smart contract executions on Ethereum are fully transparent, which makes them unsuitable for several use-cases that involve private information like the location, identity or history of past t...

## 三、升级效果：现在怎么样了？

此变更对以太坊生态产生了深远影响，推动了密码学/L2的技术发展和应用创新。

## 四、技术概述：用类比讲清楚

**密码学/L2**

这项技术通过优化在地址 0x06 添加椭圆曲线 alt_bn128 上的点加法预编译合约。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

### 核心机制拆解

**1. Encoding**

Field elements and scalars are encoded as 32 byte big-endian numbers. Curve points are encoded as two field elements `(x, y)`, where the point at infinity is encoded as `(0, 0)`.

Tuples of objects are encoded as their concatenation.

For both precompiled contracts, if the input is shorter than expe

*通俗理解：计算器——复杂数学运算用专门芯片算，比软件模拟快*

**2. Exact semantics**

Invalid input: For both contracts, if any input point does not lie on the curve or any of the field elements (point coordinates) is equal or larger than the field modulus p, the contract fails. The scalar can be any number between `0` and `2**256-1`.

#### ADD
Input: two curve points `(x, y)`.
Outpu

*通俗理解：以太坊协议层面的优化，让这台全球计算机运转得更高效*

**3. Gas costs**

- Gas cost for ``ECADD``: 500
- Gas cost for ``ECMUL``: 40000

*通俗理解：高速公路收费站——不同车辆收费标准不同*

## 五、技术实现详解

### 技术摘要（Abstract）

This EIP suggests to add precompiled contracts for addition and scalar multiplication on a specific pairing-friendly elliptic curve. This can in turn be combined with [EIP-197](./eip-197.md) to verify zkSNARKs in Ethereum smart contracts. The general benefit of zkSNARKs for Ethereum is that it will increase the privacy for users (because of the Zero-Knowledge property) and might also be a scalability solution (because of the succinctness and efficient verifiability property).

### 设计动机（Motivation）

Current smart contract executions on Ethereum are fully transparent, which makes them unsuitable for several use-cases that involve private information like the location, identity or history of past transactions. The technology of zkSNARKs could be a solution to this problem. While the Ethereum Virtual Machine can make use of zkSNARKs in theory, they are currently too expensive
to fit the block gas limit. Because of that, this EIP proposes to specify certain parameters for some elementary primitives that enable zkSNARKs so that they can be implemented more efficiently and the gas cost be reduced.

Note that while fixing these parameters might look like limiting the use-cases for zkSNARKs, the primitives are so basic that they can be combined in ways that are flexible enough so that it shou

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

If `block.number >= BYZANTIUM_FORK_BLKNUM`, add precompiled contracts for point addition (ADD)  and scalar multiplication (MUL) on the elliptic curve "alt_bn128".

Address of ADD: 0x6
Address for MUL: 0x7

The curve is defined by:
```
Y^2 = X^3 + 3
over the field F_p with
p = 21888242871839275222246405745257275088696311157297823662689037894645226208583
```

### Encoding

Field elements and scalars are encoded as 32 byte big-endian numbers. Curve points are encoded as two field elements `(x, y)`,

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-197** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-197.md)

## 七、🌟 生态影响与相关项目

### 📊 关键数据

> zk-SNARKs预编译让零知识证明验证从"不可能"变为"经济可行"，直接催生了zk-Rollup赛道。

### 🔗 相关协议与项目

**Aztec**
隐私ZK Rollup，利用alt_bn128预编译实现高效证明验证

**zkSync 1.0**
早期ZK Rollup，依赖EIP-196/197的预编译

---

## 八、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 九、历史背景与演进

此特性是密码学/L2演进的重要组成部分，经过社区充分讨论和测试后实施。它为以太坊的长期发展和生态繁荣奠定了基础。

## 十、思考与延伸

以太坊协议仍在持续迭代中。此特性为未来更广泛的升级奠定了基础，社区的讨论和实验将继续推动网络优化。详细路线图可参考以太坊官方文档。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*