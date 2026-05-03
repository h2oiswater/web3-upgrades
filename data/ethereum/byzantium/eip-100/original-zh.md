# EIP-100: 难度调整算法变更

## 技术要点

1. 修改难度调整公式，将 uncle 区块纳入计算，使得出块时间目标保持在 15 秒。新的公式为：parent_diff + parent_diff / 2048 * max(1 - (block_timestamp - parent_timestamp) / 10, -
2. + int(2**((block.number //

- **类别**: 协议基础
- **影响等级**: 中

---
*技术原文基于以太坊官方 EIP 文档整理*