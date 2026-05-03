# EIP-2929: 状态访问操作码 gas 增加

## 技术概要

增加首次访问状态的操作码 gas 成本：SLOAD/CALL/DELEGATECALL 等首次访问收取额外 2600 gas（warm access 为 100 gas），将 trie 访问的冷热区分机制引入 EVM。

- **类别**: 安全/DoS
- **影响等级**: 中

---
*技术原文基于以太坊官方 EIP 文档整理*