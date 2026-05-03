# EIP-211: RETURNDATASIZE/COPY

## 技术概要

新增 RETURNDATASIZE (0x3d) 和 RETURNDATACOPY (0x3e) 操作码，允许合约获取并复制上一次 CALL/DELEGATECALL 的返回数据大小和内容到内存。

- **类别**: 智能合约
- **影响等级**: 中

---
*技术原文基于以太坊官方 EIP 文档整理*