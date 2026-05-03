# EIP-2935: 历史区块哈希保存 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在Store last `HISTORY_SERVE_WINDOW` historical block hashes in the storage of a system contract as part of the block processing logic. Furthermore this ...

这是以太坊协议演进中的重要一步，解决了协议基础的关键挑战。

### 核心矛盾

**协议基础**

这项技术通过优化在每个区块末尾将上一个区块的哈希保存到一个系统合约中，使合约可以访问历史区块哈希而不依赖区块头。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

EVM implicitly assumes the client has the recent block (hashes) at hand. This assumption is not future-proof given the prospect of stateless clients. Including the block hashes in the state will allow...

## 三、升级效果：现在怎么样了？

此变更在协议基础产生了显著效果，提升了协议效率和安全性。

## 四、技术概述：用类比讲清楚

**协议基础**

这项技术通过优化在每个区块末尾将上一个区块的哈希保存到一个系统合约中，使合约可以访问历史区块哈希而不依赖区块头。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

### 核心机制拆解

**1. Block processing**

At the start of processing any block where this EIP is active (ie. before processing any transactions), call to `HISTORY_STORAGE_ADDRESS` as `SYSTEM_ADDRESS` with the 32-byte input of `block.parent.hash`, a gas limit of `30_000_000`, and `0` value. This will trigger the `set()` routine of the histor

*通俗理解：高速公路收费站——不同车辆收费标准不同*

**2. EVM Changes**

The `BLOCKHASH` opcode semantics remains the same as before.

*通俗理解：数字指纹——任何数据都有唯一指纹，改了数据指纹就变*

**3. Block hash history contract**

The history contract has two operations: `get` and `set`. The `set` operation is invoked only when the `caller` is equal to the `SYSTEM_ADDRESS` as per [EIP-4788](./eip-4788.md). Otherwise the `get` operation is performed.

#### `get`

It is used from the EVM for looking up block hashes.

* Callers 

*通俗理解：数字指纹——任何数据都有唯一指纹，改了数据指纹就变*

**4. [EIP-161](./eip-161.md) handling**

The bytecode above will be deployed à la [EIP-4788](./eip-4788.md). As such the account at `HISTORY_STORAGE_ADDRESS` will have code and a nonce of 1, and will be exempt from EIP-161 cleanup.

*通俗理解：智能银行卡——可以设置自动扣款、多签、社交恢复*

## 五、技术实现详解

### 技术摘要（Abstract）

Store last `HISTORY_SERVE_WINDOW` historical block hashes in the storage of a system contract as part of the block processing logic. Furthermore this EIP has no impact on `BLOCKHASH` resolution mechanism (and hence its range/costs etc).

### 设计动机（Motivation）

EVM implicitly assumes the client has the recent block (hashes) at hand. This assumption is not future-proof given the prospect of stateless clients. Including the block hashes in the state will allow bundling these hashes in the witness provided to a stateless client. This is already possible in the MPT and will become more efficient post-Verkle.

Extending the range of blocks which `BLOCKHASH` can serve (`BLOCKHASH_SERVE_WINDOW`) would have been a semantics change. Using extending that via this contract storage would allow a soft-transition. Rollups can benefit from the longer history window through directly querying this contract.

A side benefit of this approach could be that it allows building/validating proofs related to last `HISTORY_SERVE_WINDOW` ancestors directly against the curr

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

| Parameter | Value |
| - | - |
| `BLOCKHASH_SERVE_WINDOW`  | `256` |
| `HISTORY_SERVE_WINDOW`    | `8191` |
| `SYSTEM_ADDRESS`          | `0xfffffffffffffffffffffffffffffffffffffffe` |
| `HISTORY_STORAGE_ADDRESS` | `0x0000F90827F1C53a10cb7A02335B175320002935` |

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-4788** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4788.md)
- **EIP-1559** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)
- **EIP-161** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-161.md)
- **EIP-2929** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2929.md)

## 七、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 八、历史背景与演进

此特性是协议基础演进的重要组成部分，经过社区充分讨论和测试后实施。它为以太坊的长期发展和生态繁荣奠定了基础。

## 九、思考与延伸

以太坊协议仍在持续迭代中。此特性为未来更广泛的升级奠定了基础，社区的讨论和实验将继续推动网络优化。详细路线图可参考以太坊官方文档。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*