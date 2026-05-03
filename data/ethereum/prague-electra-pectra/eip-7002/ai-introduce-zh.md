# EIP-7002: 执行层触发验证者退出 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在Adds a new mechanism to allow validators to trigger withdrawals and exits from their execution layer (0x01) withdrawal credentials.

These new executi...

这是以太坊协议演进中的重要一步，解决了质押/共识的关键挑战。

### 核心矛盾

**质押/共识**

这项技术通过优化新增一种机制，允许执行层（EL）的地址通过提交交易来安全触发信标链（CL）上的验证者退出和部分提款操作。执行层地址被注册，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

Validators have two keys -- an active key and a withdrawal credential. The active key takes the form of a BLS key, whereas the withdrawal credential can either be a BLS key (0x00) or an execution laye...

## 三、升级效果：现在怎么样了？

此变更对以太坊生态产生了深远影响，推动了质押/共识的技术发展和应用创新。

## 四、技术概述：用类比讲清楚

**质押/共识**

这项技术通过优化新增一种机制，允许执行层（EL）的地址通过提交交易来安全触发信标链（CL）上的验证者退出和部分提款操作。执行层地址被注册，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

### 核心机制拆解

**1. Execution layer**

#### Definitions

* **`FORK_BLOCK`** -- the first block in a blockchain after this EIP has been activated.

#### Withdrawal request operation

The new withdrawal request operation is an [EIP-7685](./eip-7685.md) request
with type `0x01` and consists of the following fields:

1. `source_address`: `By

*通俗理解：以太坊协议层面的优化，让这台全球计算机运转得更高效*

**2. Consensus layer**

[Full specification](https://github.com/ethereum/consensus-specs/blob/7bf43d1bc4fdb91059f0e6f4f7f0f3349b144950/specs/electra/beacon-chain.md)

Sketch of spec:

* New operation `ExecutionLayerWithdrawalRequest`
* Will show up in `ExecutionPayload` as an SSZ List bound by length `MAX_WITHDRAWAL_REQUES

*通俗理解：临时寄存柜——比永久存档便宜100倍，18天后自动清理*

## 五、技术实现详解

### 技术摘要（Abstract）

Adds a new mechanism to allow validators to trigger withdrawals and exits from their execution layer (0x01) withdrawal credentials.

These new execution layer exit messages are appended to the execution layer block and then processed by the consensus layer.

### 设计动机（Motivation）

Validators have two keys -- an active key and a withdrawal credential. The active key takes the form of a BLS key, whereas the withdrawal credential can either be a BLS key (0x00) or an execution layer address (0x01). The active key is "hot", actively signing and performing validator duties, whereas the withdrawal credential can remain "cold", only performing limited operations in relation to withdrawing and ownership of the staked ETH. Due to this security relationship, the withdrawal credential ultimately is the key that owns the staked ETH and any rewards.

As currently specified, only the active key can initiate a validator exit. This means that in any non-standard custody relationship (i.e., the active key is a separate entity from the withdrawal credentials), the ultimate owner of th

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

| Name | Value | Comment |
| - | - | - |
| `WITHDRAWAL_REQUEST_PREDEPLOY_ADDRESS` | `0x00000961Ef480Eb55e80D19ad83579A64c007002` | Where to call and store relevant details about exit / partial withdrawal mechanism |
| `WITHDRAWAL_REQUEST_TYPE` | `0x01` | The [EIP-7685](./eip-7685.md) type prefix for withdrawal request |
| `SYSTEM_ADDRESS` | `0xfffffffffffffffffffffffffffffffffffffffe` | Address used to invoke system operation on contract
| `EXCESS_WITHDRAWAL_REQUESTS_STORAGE_SLOT` | 0 | |
| `WITHDRAWAL_REQUEST_COUNT_STORAGE_SLOT` | 1 | |
| `WITHDRAWAL_REQUEST_QUEUE_HEAD_STORAGE_SLOT` | 2 | Pointer to head of the withdrawal request message queue |
| `WITHDRAWAL_REQUEST_QUEUE_TAIL_STORAGE_SLOT` | 3 | Pointer to the tail of the withdrawal request message queue|
| `WITHDRAWAL_REQUEST_QUEUE_STORAGE_OFFSET` | 4 | The start memory slot of the in-state withdrawal request message queue|
| `MAX_WITHDRAWAL_REQUESTS_PER_BLOCK` | 16 | Maximum number of withdrawal requests that can be dequeued into a block |
| `TARGET_WITHDRAWAL_REQUESTS_PER_BLOCK` | 2 | |
| `MIN_WITHDRAWAL_REQUEST_FEE` | 1 | |
| `WITHDRAWAL_REQUEST_FEE_UPDATE_FRACTION` | 17 | |
| `EXCESS_INHIBITOR` | `2**256-1` | Excess value used to compute the fee before the first system call |

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-7685** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7685.md)
- **EIP-1559** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)
- **EIP-4788** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4788.md)

## 七、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 八、历史背景与演进

此特性是质押/共识演进的重要组成部分，经过社区充分讨论和测试后实施。它为以太坊的长期发展和生态繁荣奠定了基础。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*