# EIP-4844: Proto-Danksharding / Blob 交易 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

随着 DeFi、NFT、SocialFi 等应用的爆发，以太坊主链 TPS 成为瓶颈。Layer 2 方案（Rollup）能把计算放到链下，但**数据存储成本仍是硬伤**——Rollup 必须把交易数据发布到 L1 作为"证据"，而 L1 的 calldata 存储费用高达 ~16-20 gwei/字节。

结果是：L2 虽然计算便宜了，但**数据发布成本占了总费用的 90% 以上**。用户在 L2 做一次 Swap 仍需支付 $0.5-$2，距离"大规模采用"差一个数量级。

### 核心矛盾

**快递站的"临时寄存柜"**

想象以太坊主链是一个大型快递分拣中心。以前，L2 包裹到达后，中心必须把包裹内容永久存档到档案室（calldata），每个字都按标准收费。

Blob 交易就像引入了"临时寄存柜"：
- 包裹不用拆开永久存档：L2 把包裹放进临时柜子（blob），18 天后自动清理
- 柜子有封条（KZG 承诺）：中心不用看包裹里面是什么，只需要验证封条完好
- 柜子有独立计价：临时柜子的租金比普通存档便宜 10-100 倍

## 二、升级目标：解决什么问题？

为 Layer 2 提供廉价的数据可用性空间，将 L2 交易成本降低一个数量级（90%+），同时保持主链的安全性和去中心化程度。

## 三、升级效果：现在怎么样了？

**Dencun 升级后（2024 年 3 月）**：
- Arbitrum 平均交易费：从 $0.5 → **$0.02**（降低96%）
- Base 平均交易费：从 $0.3 → **$0.01**（降低97%）
- Optimism 平均交易费：从 $0.4 → **$0.015**（降低96%）
- zkSync Era 数据成本降低 10-100 倍
- **L2 日活用户数翻倍增长**，SocialFi、游戏等高频应用开始爆发

## 四、技术概述：用类比讲清楚

**快递站的"临时寄存柜"**

想象以太坊主链是一个大型快递分拣中心。以前，L2 包裹到达后，中心必须把包裹内容永久存档到档案室（calldata），每个字都按标准收费。

Blob 交易就像引入了"临时寄存柜"：
- 包裹不用拆开永久存档：L2 把包裹放进临时柜子（blob），18 天后自动清理
- 柜子有封条（KZG 承诺）：中心不用看包裹里面是什么，只需要验证封条完好
- 柜子有独立计价：临时柜子的租金比普通存档便宜 10-100 倍

### 核心机制拆解

**1. Type aliases**

| Type | Base type | Additional checks |
| - | - | - |
| `Blob` | `ByteVector[BYTES_PER_FIELD_ELEMENT * FIELD_ELEMENTS_PER_BLOB]` | |
| `VersionedHash` | `Bytes32` | |
| `KZGCommitment` | `Bytes48` | Perform IETF BLS signature "KeyValidate" check but do allow the identity point |
| `KZGProof` | `Byt

*通俗理解：临时寄存柜——比永久存档便宜100倍，18天后自动清理*

**2. Cryptographic Helpers**

Throughout this proposal we use cryptographic methods and classes defined in the corresponding [consensus 4844 specs](https://github.com/ethereum/consensus-specs/blob/86fb82b221474cc89387fa6436806507b3849d88/specs/deneb).

Specifically, we use the following methods from [`polynomial-commitments.md`]

*通俗理解：临时寄存柜——比永久存档便宜100倍，18天后自动清理*

**3. Helpers**

python
def kzg_to_versioned_hash(commitment: KZGCommitment) -> VersionedHash:
    return VERSIONED_HASH_VERSION_KZG + sha256(commitment)[1:]


Approximates `factor * e ** (numerator / denominator)` using Taylor expansion:

python
def fake_exponential(factor: int, numerator: int, denominator

*通俗理解：数字指纹——任何数据都有唯一指纹，改了数据指纹就变*

**4. Blob transaction**

We introduce a new type of [EIP-2718](./eip-2718.md) transaction, "blob transaction", where the `TransactionType` is `BLOB_TX_TYPE` and the `TransactionPayload` is the RLP serialization of the following `TransactionPayloadBody`:


[chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_l

*通俗理解：临时寄存柜——比永久存档便宜100倍，18天后自动清理*

## 五、技术实现详解

### 技术摘要（Abstract）

Introduce a new transaction format for "blob-carrying transactions" which contain a large amount of data that cannot be
accessed by EVM execution, but whose commitment can be accessed.
The format is intended to be fully compatible with the format that will be used in full sharding.

### 设计动机（Motivation）

Rollups are in the short and medium term, and possibly in the long term, the only trustless scaling solution for Ethereum.
Transaction fees on L1 have been very high for months and there is greater urgency in doing anything required to help facilitate an ecosystem-wide move to rollups.
Rollups are significantly reducing fees for many Ethereum users: Optimism and Arbitrum frequently provide fees that are ~3-8x lower than the Ethereum base layer itself,
and ZK rollups, which have better data compression and can avoid including signatures, have fees ~40-100x lower than the base layer.

However, even these fees are too expensive for many users. The long-term solution to the long-term inadequacy of rollups
by themselves has always been data sharding, which would add ~16 MB per block of dedicate

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

| Constant | Value |
| - | - |
| `BLOB_TX_TYPE` | `Bytes1(0x03)` |
| `BYTES_PER_FIELD_ELEMENT` | `32` |
| `FIELD_ELEMENTS_PER_BLOB` | `4096` |
| `BLS_MODULUS` | `52435875175126190479447740508185965837690552500527637822603658699938581184513` |
| `VERSIONED_HASH_VERSION_KZG` | `Bytes1(0x01)` |
| `POINT_EVALUATION_PRECOMPILE_ADDRESS` | `Bytes20(0x0A)` |
| `POINT_EVALUATION_PRECOMPILE_GAS` | `50000` |
| `MAX_BLOB_GAS_PER_BLOCK` | `786432` |
| `TARGET_BLOB_GAS_PER_BLOCK` | `393216` |
| `MIN_BASE_FEE_PER_BLOB_GAS` | `1` |
| `BLOB_BASE_FEE_UPDATE_FRACTION` | `3338477` |
| `GAS_PER_BLOB` | `2**17` |
| `HASH_OPCODE_BYTE` | `Bytes1(0x49)` |
| `HASH_OPCODE_GAS` | `3` |
| [`MIN_EPOCHS_FOR_BLOB_SIDECARS_REQUESTS`](https://github.com/ethereum/consensus-specs/blob/4de1d156c78b555421b72d6067c73b614ab55584/configs/mainnet.yaml#L148) | `4096` |

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-2718** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2718.md)
- **EIP-1559** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)

## 七、🌟 生态影响与相关项目

### 📊 关键数据

> Dencun升级后（2024年3月）：Arbitrum平均交易费从$0.5→$0.02，Base从$0.3→$0.01，Optimism从$0.4→$0.015。L2日活用户数翻倍增长。

### 🔗 相关协议与项目

**Arbitrum**
领先的Optimistic Rollup，Blob交易使其数据成本降低90%+，用户交易费从$0.5降至$0.02

**Optimism**
OP Stack生态核心，Blob支持使其成为最具成本效益的L2之一

**Base**
Coinbase推出的L2，基于OP Stack，Blob交易使其保持极低费用

**zkSync Era**
ZK Rollup代表，Blob+KZG承诺优化了其有效性证明的数据可用性

**StarkNet**
STARK-based L2，Blob交易降低其on-chain数据成本

**Scroll**
兼容EVM的ZK Rollup，利用Blob实现更低的数据可用性成本

---

## 八、谁会受到影响？

- **普通用户**: L2 交易费用从 $0.5 降至 $0.02，高频应用（社交、游戏）变得可行
- **Layer 2 开发者**: 数据发布成本降低 90%+，扩容方案更经济
- **Rollup 项目方**: Arbitrum、Optimism、Base 等直接受益，日活增长
- **以太坊主网**: Blob 18 天后删除，节点存储负担可控

## 九、历史背景与演进

EIP-4844 是"The Surge"扩容路线图的核心。Proto-Danksharding 概念由 Dankrad Feist 提出，它在完整 Danksharding 实现前就已经让 L2 费用降低了 90%+，被称为"最小可行扩容"。

## 十、思考与延伸

**Proto-Danksharding → Full Danksharding**

EIP-4844 是 Danksharding 的 MVP 版本，未来还需要：
- **PeerDAS**（Peer Data Availability Sampling）：让轻节点也能验证数据可用性
- **完整分片**：将 blob 数量从每区块 6 个提升到 64+ 个
- **去中心化程度提升**：轻节点参与验证，降低对全节点的依赖

这是以太坊扩容路线图的核心里程碑。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*