# EIP-2028: 降低 Calldata gas 成本 — AI 深度解读

---

## 一、背景信息：为什么需要这个升级？

### 当时的痛点

这项技术解决了以太坊网络在扩容/L2面临的关键挑战。其目标是提升网络性能、安全性或可用性，为以太坊的长期演进奠定基础。

### 核心矛盾

**扩容/L2**

这项技术通过优化将交易 calldata 的 gas 成本从每字节 68 降至 16。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 二、升级目标：解决什么问题？

There are a couple of main benefits to accepting this proposal and lowering gas cost of Calldata
On-Chain Scalability: Generally speaking, higher bandwidth of Calldata improves scalability, as more da...

## 三、升级效果：现在怎么样了？

此变更对以太坊生态产生了深远影响，推动了扩容/L2的技术发展和应用创新。

## 四、技术概述：用类比讲清楚

**扩容/L2**

这项技术通过优化将交易 calldata 的 gas 成本从每字节 68 降至 16。，提升了以太坊网络的性能、安全性或可用性。可以理解为给这台全球共享的计算机升级了一个核心零部件。

## 五、技术实现详解

### 设计动机（Motivation）

There are a couple of main benefits to accepting this proposal and lowering gas cost of Calldata
On-Chain Scalability: Generally speaking, higher bandwidth of Calldata improves scalability, as more data can fit within a single block.
* Layer two scalability: Layer two scaling solutions can improve scalability by moving storage and computation off-chain, but often introduce data transmission instead.
	- Proof systems such as STARKs and SNARKs use a single proof that attests to the computational integrity of a large computation, say, one that processes a large batch of transactions.
	- Some solutions use fraud proofs which requires a transmission of merkle proofs.
	- Moreover, one optional data availability solution to layer two is to place data on the main chain, via Calldata.
* Stateless c

> 📄 完整动机说明请查看上方"官方原文"标签页

### 关键参数与机制

The gas per non-zero byte is reduced from 68 to 16. Gas cost of zero bytes is unchanged.

## 六、关联 EIP

此 EIP 为相对独立的协议改进，主要与以太坊核心协议交互。详细依赖关系请查看官方 EIP 文档的"Backward Compatibility"和"Security Considerations"章节。

## 七、🌟 生态影响与相关项目

### 📊 关键数据

> calldata从68 gas/字节降至16 gas/字节：Rollup数据成本降低76%，直接催生了现代L2生态的爆发。

### 🔗 相关协议与项目

**Optimism**
Optimistic Rollup依赖calldata存储交易数据，降价后运营成本骤降

**Arbitrum**
Nova版本利用calldata降价实现更低费用

**StarkEx**
Validium方案利用calldata存储状态更新

---

## 八、谁会受到影响？

- **核心开发者**: 协议层面的优化，为长期发展铺平道路
- **全节点运营者**: 需要升级客户端以支持新规则
- **智能合约开发者**: 可能需要适配新机制或利用新功能

## 九、历史背景与演进

2019 年之前，Rollup 需要将数据作为 calldata 发布到 L1，每字节 68 gas 的成本使其几乎不可行。EIP-2028 将 calldata 降至 16 gas/字节，让 Rollup 从概念变为产品。

## 十、关键术语表

| 术语 | 通俗解释 |
|------|----------|
| **gas** | 交易执行的计价单位，类比为"燃料"。操作越复杂，消耗的 gas 越多。 |
| **calldata** | 以太坊交易中携带的输入数据，永久存储在链上，费用较高。 |
| **storage** | 智能合约的永久存储空间，读写成本很高（因为数据要永久保存）。 |
| **hash** | 哈希函数：把任意数据压缩成固定长度的"指纹"。用于验证数据完整性。 |
| **rollup** | L2 扩容方案：在链下处理交易，只把压缩后的数据提交到主链，主链验证数据可用性即可。 |
| **blob** | 临时数据容器：每个 128KB，18 天后自动删除，专门给 Rollup 存数据用，比 calldata 便宜 100 倍。 |
| **eip** | 以太坊改进提案（Ethereum Improvement Proposal）：以太坊社区提出协议变更的标准流程。 |

## 十一、思考与延伸

以太坊协议仍在持续迭代中。此特性为未来更广泛的升级奠定了基础，社区的讨论和实验将继续推动网络优化。详细路线图可参考以太坊官方文档。

---
*本深度解读基于以太坊官方 EIP 文档、社区讨论及公开资料整理。技术细节以官方文档为准。*