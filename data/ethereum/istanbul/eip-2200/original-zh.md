# EIP-2200: SSTORE gas 净计量

## 技术要点

1. 改进 SSTORE 的净计量（Net Gas Metering），综合原始值、当前值和新值三态：原始=当前=新值时收取 SLOAD_GAS(
2. 原始!=当前=新值时收取 SLOAD_GAS(
3. 原始=当前!=新值时收取 SSTORE_SET_GAS(
4. 或 SSTORE_RESET_GAS(
5. 原始!=当前!=新值时收取 SLOAD_GAS(

- **类别**: 经济/安全
- **影响等级**: 中

---
*技术原文基于以太坊官方 EIP 文档整理*