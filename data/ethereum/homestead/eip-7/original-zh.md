# EIP-7: DELEGATECALL

## 技术概要

新增 DELEGATECALL 操作码（0xf4），语义类似于 CALLCODE，但保持发送者（msg.sender）和调用值（msg.value）不变。

- **类别**: 智能合约
- **影响等级**: 高
- **核心特性**: ⭐ 本次升级的关键变更

---
*技术原文基于以太坊官方 EIP 文档整理*