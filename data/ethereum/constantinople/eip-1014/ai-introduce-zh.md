# EIP-1014: CREATE2 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

这项技术解决了以太坊网络在智能合约/L2面临的关键挑战。其目标是提升网络性能、安全性或可用性，为以太坊的长期演进奠定基础。

### 核心矛盾

**智能合约/L2**

这项技术通过优化新增 CREATE2 操作码（0xf5），允许根据 salt、发送者地址和 initcode 哈希确定性地计算合约地址。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

Allows interactions to (actually or counterfactually in channels) be made with addresses that do not exist yet on-chain but can be relied on to only possibly eventually contain code that has been crea...

## 三、升级效果：现在怎么样了？

此变更对以太坊生态产生了深远影响，推动了智能合约/L2的技术发展和应用创新。

## 四、技术概述：用类比讲清楚

**智能合约/L2**

这项技术通过优化新增 CREATE2 操作码（0xf5），允许根据 salt、发送者地址和 initcode 哈希确定性地计算合约地址。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

### 核心机制拆解

**1. Motivation**

Allows interactions to (actually or counterfactually in channels) be made with addresses that do not exist yet on-chain but can be relied on to only possibly eventually contain code that has been created by a particular piece of init code. Important for state-channel use cases that involve counterfa

*通俗理解：以太坊协议层面的优化，让这台全球计算机运转得更高效*

**2. Rationale**

#### Address formula

* Ensures that addresses created with this scheme cannot collide with addresses created using the traditional `keccak256(rlp([sender, nonce]))` formula, as `0xff` can only be a starting byte for RLP for data many petabytes long.
* Ensures that the hash preimage has a fixed size

*通俗理解：数字指纹——任何数据都有唯一指纹，改了数据指纹就变*

**3. Clarifications**

The `init_code` is the code that, when executed, produces the runtime bytecode that will be placed into the state, and which typically is used by high level languages to implement a 'constructor'.

This EIP makes collisions possible. The behaviour at collisions is specified by [EIP-684](https://gith

*通俗理解：以太坊协议层面的优化，让这台全球计算机运转得更高效*

**4. Examples**

Example 0
* address `0x0000000000000000000000000000000000000000`
* salt `0x0000000000000000000000000000000000000000000000000000000000000000`
* init_code `0x00`
* gas (assuming no mem expansion): `32006`
* result: `0x4D1A2e2bB4F88F0250f26Ffff098B0b30B26BF38`

Example 1
* address `0xdeadbeef0000000000

*通俗理解：高速公路收费站——不同车辆收费标准不同*

## 五、技术实现详解

### 设计动机（Motivation）

Allows interactions to (actually or counterfactually in channels) be made with addresses that do not exist yet on-chain but can be relied on to only possibly eventually contain code that has been created by a particular piece of init code. Important for state-channel use cases that involve counterfactual interactions with contracts.

### Rationale

#### Address formula

* Ensures that addresses created with this scheme cannot collide with addresses created using the traditional `keccak256(rlp([sender, nonce]))` formula, as `0xff` can only be a starting byte for RLP for data many petabytes long.
* Ensures that the hash preimage has a fixed size,

#### Gas cost

Since address calculation depends on hashing the `init_code`, it would leave clients open to DoS attacks if executions could repeat

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

Adds a new opcode (`CREATE2`) at `0xf5`, which takes 4 stack arguments: endowment, memory_start, memory_length, salt. Behaves identically to `CREATE` (`0xf0`), except using `keccak256( 0xff ++ address ++ salt ++ keccak256(init_code))[12:]` instead of the usual sender-and-nonce-hash as the address where the contract is initialized at.

The `CREATE2` has the same `gas` schema as `CREATE`, but also an extra `hashcost` of `GSHA3WORD * ceil(len(init_code) / 32)`, to account for the hashing that must 

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-684** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-684.md)
- **EIP-161** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-161.md)

## 七、🌟 生态影响与相关项目

### 📊 关键数据

> CREATE2催生了"Counterfactual"理念——链下确定地址、交互，只在必要时上链。这是现代Account Abstraction的基础设施。

### 🔗 相关协议与项目

**Gnosis Safe**
多签钱包利用CREATE2确定性地计算多签合约地址

**Counterfactual**
状态通道框架，基于CREATE2实现链下交互

**WalletConnect**
钱包连接协议，利用CREATE2优化合约部署流程

---

## 八、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 九、历史背景与演进

CREATE2 催生了"Counterfactual"理念——在链下预先确定合约地址并进行交互，只在必要时上链。这是状态通道、Gnosis Safe、以及现代 Account Abstraction 的基础设施。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*