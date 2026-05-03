# EIP-2718: 类型化交易信封

## 技术概要

定义类型化交易信封格式：TransactionType || TransactionPayload。TransactionType 为 0-0x7f 的单字节，区分不同交易格式。

- **类别**: 协议基础
- **影响等级**: 高
- **核心特性**: ⭐ 本次升级的关键变更

---

*技术原文基于以太坊官方 EIP 文档整理*