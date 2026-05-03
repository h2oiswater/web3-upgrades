# EIP-4844: Proto-Danksharding / Blob 交易

## 技术要点

1. 引入 Blob 携带交易（Blob Transaction）
2. 新交易类型包含最多 6 个 blob（每个 128KB）
3. Blob 数据使用 KZG 多项式承诺
4. Blob 在共识层短期保存（约 4096 个 epoch ~ 18 天）后删除
5. 独立的 blob gas 市场和基础费
6. EVM 可通过 POINTEVALUATION 预编译验证 KZG 证明。

- **类别**: 扩容/L2
- **影响等级**: 高
- **核心特性**: ⭐ 本次升级的关键变更

---

*技术原文基于以太坊官方 EIP 文档整理*