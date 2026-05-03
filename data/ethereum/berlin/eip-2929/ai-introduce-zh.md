# EIP-2929: 状态访问操作码 gas 增加 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

根据官方 EIP 文档，这项技术旨在Increase the gas cost of `SLOAD` (`0x54`) to 2100, and the `*CALL` opcode family (`0xf1`, `f2`, `f4`, `fA`), `BALANCE` `0x31` and the `EXT*` opcode fa...

这是以太坊协议演进中的重要一步，解决了安全/DoS的关键挑战。

### 核心矛盾

**安全/DoS**

这项技术通过优化增加首次访问状态的操作码 gas 成本：SLOAD/CALL/DELEGATECALL 等首次访问收取额外 2600 g，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

Generally, the main function of gas costs of opcodes is to be an estimate of the time needed to process that opcode, the goal being for the gas limit to correspond to a limit on the time needed to pro...

## 三、升级效果：现在怎么样了？

此变更在安全/DoS产生了显著效果，提升了协议效率和安全性。

## 四、技术概述：用类比讲清楚

**安全/DoS**

这项技术通过优化增加首次访问状态的操作码 gas 成本：SLOAD/CALL/DELEGATECALL 等首次访问收取额外 2600 g，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

### 核心机制拆解

**1. Storage read changes**

When an address is either the target of a (`EXTCODESIZE` (`0x3B`), `EXTCODECOPY` (`0x3C`), `EXTCODEHASH` (`0x3F`) or `BALANCE` (`0x31`)) opcode or the target of a (`CALL` (`0xF1`), `CALLCODE` (`0xF2`), `DELEGATECALL` (`0xF4`), `STATICCALL` (`0xFA`)) opcode, the gas costs are computed as follows:

* 

*通俗理解：高速公路收费站——不同车辆收费标准不同*

**2. SSTORE changes**

When calling `SSTORE`, check if the `(address, storage_key)` pair is in `accessed_storage_keys`. If it is not, charge an additional `COLD_SLOAD_COST` gas, and add the pair to `accessed_storage_keys`. Additionally, modify the parameters defined in [EIP-2200](./eip-2200.md) as follows:

| Parameter | 

*通俗理解：高速公路收费站——不同车辆收费标准不同*

**3. SELFDESTRUCT changes**

If the ETH recipient of a `SELFDESTRUCT` is not in `accessed_addresses` (regardless of whether or not the amount sent is nonzero), charge an additional `COLD_ACCOUNT_ACCESS_COST` on top of the existing gas costs, and add the ETH recipient to the set.

Note: `SELFDESTRUCT` does not charge a `WARM_STO

*通俗理解：高速公路收费站——不同车辆收费标准不同*

## 五、技术实现详解

### 技术摘要（Abstract）

Increase the gas cost of `SLOAD` (`0x54`) to 2100, and the `*CALL` opcode family (`0xf1`, `f2`, `f4`, `fA`), `BALANCE` `0x31` and the `EXT*` opcode family (`0x3b`, `0x3c`, `0x3f`) to 2600. Exempts (i) precompiles, and (ii) addresses and storage slots that have already been accessed in the same transaction, which get a decreased gas cost. Additionally reforms `SSTORE` metering and `SELFDESTRUCT` to ensure "de-facto storage loads" inherent in those opcodes are priced correctly.

### 设计动机（Motivation）

Generally, the main function of gas costs of opcodes is to be an estimate of the time needed to process that opcode, the goal being for the gas limit to correspond to a limit on the time needed to process a block. However, storage-accessing opcodes (`SLOAD`, as well as the `*CALL`, `BALANCE` and `EXT*` opcodes) have historically been underpriced. In the 2016 Shanghai DoS attacks, once the most serious client bugs were fixed, one of the more durably successful strategies used by the attacker was to simply send transactions that access or call a large number of accounts.

Gas costs were increased to mitigate this, but recent numbers suggest they were not increased enough. Quoting [https://arxiv.org/pdf/1909.07220.pdf](https://arxiv.org/pdf/1909.07220.pdf): 

> Although by itself, this issue 

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

| Constant | Value |
| - | - |
| `FORK_BLOCK` | 12244000 |
| `COLD_SLOAD_COST` | 2100 |
| `COLD_ACCOUNT_ACCESS_COST` | 2600 |
| `WARM_STORAGE_READ_COST` | 100 |

## 六、关联 EIP

此 EIP 与以下协议标准有直接关联：

- **EIP-2200** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2200.md)
- **EIP-1884** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1884.md)
- **EIP-2930** — 详见 [官方文档](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2930.md)

## 七、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 八、历史背景与演进

此特性是安全/DoS演进的重要组成部分，经过社区充分讨论和测试后实施。它为以太坊的长期发展和生态繁荣奠定了基础。

## 九、关键术语表

| 术语 | 通俗解释 |
|------|----------|
| **gas** | 交易执行的计价单位，类比为"燃料"。操作越复杂，消耗的 gas 越多。 |
| **opcode** | EVM 的基础操作指令，如加法、存储、调用等。每个 opcode 都有对应的 gas 成本。 |
| **storage** | 智能合约的永久存储空间，读写成本很高（因为数据要永久保存）。 |
| **precompile** | 预编译合约：EVM 中内置的高效算法实现，用原生代码而非 EVM 字节码执行，gas 成本更低。 |
| **hash** | 哈希函数：把任意数据压缩成固定长度的"指纹"。用于验证数据完整性。 |
| **blob** | 临时数据容器：每个 128KB，18 天后自动删除，专门给 Rollup 存数据用，比 calldata 便宜 100 倍。 |
| **slot** | 时隙，约 12 秒。每个 slot 有一个验证者负责提议区块。 |
| **eip** | 以太坊改进提案（Ethereum Improvement Proposal）：以太坊社区提出协议变更的标准流程。 |

## 十、思考与延伸

以太坊协议仍在持续迭代中。此特性为未来更广泛的升级奠定了基础，社区的讨论和实验将继续推动网络优化。详细路线图可参考以太坊官方文档。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*