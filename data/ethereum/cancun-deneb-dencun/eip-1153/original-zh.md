# EIP-1153: Transient Storage

## 技术概要

新增 Transient Storage 操作码 TLOAD (0x5c) 和 TSTORE (0x5d)。Transient Storage 类似于存储但在交易结束时清除，不消耗 gas 退款机制。

- **类别**: 智能合约
- **影响等级**: 中
- **核心特性**: ⭐ 本次升级的关键变更

---
*技术原文基于以太坊官方 EIP 文档整理*