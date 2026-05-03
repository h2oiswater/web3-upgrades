# EIP-1108: 降低 alt_bn128 gas 成本 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在Changes in 2018 to the underlying library used by the official Go reference
implementation led to significant performance gains for the `ECADD`, `ECMU...

这是以太坊协议演进中的重要一步，解决了扩容/L2的关键挑战。

### 核心矛盾

**扩容/L2**

这项技术通过优化将 alt_bn128 预编译合约（EIP-196/197）的 gas 成本大幅降低：点加法从 500 降至 150，标，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

Recently, the underlying library used by the [official Go reference
implementation](https://github.com/ethereum/go-ethereum) to implement the
`ECADD` (at address `0x06`), `ECMUL` (at address `0x07`), ...

## 三、升级效果：现在怎么样了？

此变更对以太坊生态产生了深远影响，推动了扩容/L2的技术发展和应用创新。

## 四、技术概述：用类比讲清楚

**扩容/L2**

这项技术通过优化将 alt_bn128 预编译合约（EIP-196/197）的 gas 成本大幅降低：点加法从 500 降至 150，标，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 五、技术实现详解

### 技术摘要（Abstract）

Changes in 2018 to the underlying library used by the official Go reference
implementation led to significant performance gains for the `ECADD`, `ECMUL`,
and pairing check precompiled contracts on the `alt_bn128` elliptic curve.

In the Parity client, field operations used by the precompile algorithms were optimized in 2018, 
and recent changes to the pairing algorithm used by the `bn` crate have brought considerable speedups.

Faster operations on Ethereum clients should be reflected in reduced gas costs.

### 设计动机（Motivation）

Recently, the underlying library used by the [official Go reference
implementation](https://github.com/ethereum/go-ethereum) to implement the
`ECADD` (at address `0x06`), `ECMUL` (at address `0x07`), and pairing check (at
address `0x08`) precompiled contracts was shifted to [Cloudflare's bn256
library](https://github.com/cloudflare/bn256). Based on the [initial PR that
introduced this change](https://github.com/ethereum/go-ethereum/pull/16203),
and corroborated in [a later
note](https://github.com/ethereum/go-ethereum/pull/16301#issuecomment-372687543),
the computational cost of `ECADD`, `ECMUL`, and pairing checks (excepting the
constant) has dropped roughly an order of magnitude across the board.

Also, optimizations in the bn library [in 2018](https://github.com/paritytech/bn/pull/9) an

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

| Contract      | Address   | Current Gas Cost               | Updated Gas Cost    |
| ------------- | --------- | -----------------------------  | ------------------- |
| `ECADD`       | `0x06`    | 500<sup>[1]</sup>              | 150                 |
| `ECMUL`       | `0x07`    | 40 000<sup>[1]</sup>           | 6 000               |
| Pairing check | `0x08`    | 80 000 * k + 100 000<sup>[2]</sup>| 34 000 * k + 45 000    |

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-196** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-196.md)
- **EIP-197** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-197.md)
- **EIP-1829** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1829.md)

## 七、🌟 生态影响与相关项目

### 📊 关键数据

> alt_bn128预编译gas成本降低约80%：点加法500→150，标量乘法40000→6000。zk证明验证从"数十美元"降至"几美元"。

### 🔗 相关协议与项目

**zkSync 2.0**
Era版本利用降低的gas成本实现更便宜的ZK证明验证

**Loopring**
DEX-focused ZK Rollup，成本降低80%后用户体验大幅提升

**StarkWare**
虽然使用STARKs而非SNARKs，但gas成本降低整体利好L2生态

---

## 八、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 九、历史背景与演进

zk-SNARKs 验证成本曾高达数十美元，这让 zk-Rollup 只能用于高价值场景。EIP-1108 将验证成本降低约 80%，直接催生了 zkSync、Loopring 等 zk-Rollup 项目。

## 十、思考与延伸

以太坊协议仍在持续迭代中。此特性为未来更广泛的升级奠定了基础，社区的讨论和实验将继续推动网络优化。详细路线图可参考以太坊官方文档。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*