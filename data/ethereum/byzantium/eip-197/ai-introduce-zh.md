# EIP-197: bn256 标量乘法预编译 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在This EIP suggests to add precompiled contracts for a pairing function on a specific pairing-friendly elliptic curve. This can in turn be combined with...

这是以太坊协议演进中的重要一步，解决了密码学/L2的关键挑战。

### 核心矛盾

**密码学/L2**

这项技术通过优化在地址 0x07 添加椭圆曲线 alt_bn128 上的标量乘法预编译合约。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

Current smart contract executions on Ethereum are fully transparent, which makes them unsuitable for several use-cases that involve private information like the location, identity or history of past t...

## 三、升级效果：现在怎么样了？

此变更对以太坊生态产生了深远影响，推动了密码学/L2的技术发展和应用创新。

## 四、技术概述：用类比讲清楚

**密码学/L2**

这项技术通过优化在地址 0x07 添加椭圆曲线 alt_bn128 上的标量乘法预编译合约。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

### 核心机制拆解

**1. Definition of the groups**

The groups `G_1` and `G_2` are cyclic groups of prime order `q = 21888242871839275222246405745257275088548364400416034343698204186575808495617`.

The group `G_1` is defined on the curve `Y^2 = X^3 + 3` over the field `F_p` with `p = 2188824287183927522224640574525727508869631115729782366268903789464

*通俗理解：以太坊协议层面的优化，让这台全球计算机运转得更高效*

**2. Encoding**

Elements of `F_p` are encoded as 32 byte big-endian numbers. An encoding value of `p` or larger is invalid.

Elements `a * i + b` of `F_p^2` are encoded as two elements of `F_p`, `(a, b)`.

Elliptic curve points are encoded as a Jacobian pair `(X, Y)` where the point at infinity is encoded as `(0, 0

*通俗理解：以太坊协议层面的优化，让这台全球计算机运转得更高效*

**3. Gas costs**

The gas costs of the precompiled contract are `80 000 * k + 100 000`, where `k` is the number of
points or, equivalently, the length of the input divided by 192.

*通俗理解：高速公路收费站——不同车辆收费标准不同*

## 五、技术实现详解

### 技术摘要（Abstract）

This EIP suggests to add precompiled contracts for a pairing function on a specific pairing-friendly elliptic curve. This can in turn be combined with [EIP-196](./eip-196.md) to verify zkSNARKs in Ethereum smart contracts. The general benefit of zkSNARKs for Ethereum is that it will increase the privacy for users (because of the Zero-Knowledge property) and might also be a scalability solution (because of the succinctness and efficient verifiability property).

### 设计动机（Motivation）

Current smart contract executions on Ethereum are fully transparent, which makes them unsuitable for several use-cases that involve private information like the location, identity or history of past transactions. The technology of zkSNARKs could be a solution to this problem. While the Ethereum Virtual Machine can make use of zkSNARKs in theory, they are currently too expensive
to fit the block gas limit. Because of that, this EIP proposes to specify certain parameters for some elementary primitives that enable zkSNARKs so that they can be implemented more efficiently and the gas cost be reduced.

Note that fixing these parameters will in no way limit the use-cases for zkSNARKs, it will even allow for incorporating some advances in zkSNARK research without the need for a further hard fork.

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

For blocks where `block.number >= BYZANTIUM_FORK_BLKNUM`, add a precompiled contracts for a bilinear function on groups on the elliptic curve "alt_bn128". We will define the precompiled contract in terms of a discrete logarithm. The discrete logarithm is of course assumed to be hard to compute, but we will give an equivalent specification that makes use of elliptic curve pairing functions which can be efficiently computed below.

Address: 0x8

For a cyclic group `G` (written additively) of prime

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-196** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-196.md)

## 七、🌟 生态影响与相关项目

### 📊 关键数据

> 标量乘法预编译（EIP-197）+点加法预编译（EIP-196）=完整的zk-SNARKs验证能力。这是zk-Rollup诞生的密码学基石。

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