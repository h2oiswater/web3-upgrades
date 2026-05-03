# EIP-152: Blake2 压缩函数预编译

## 技术概要

新增 Blake2b 压缩函数 F 的预编译合约（地址 0x09）。输入为 rounds count、h message block、last block flag 和 state vector，输出为新的 state vector。

- **类别**: 互操作/密码学
- **影响等级**: 中

---

*技术原文基于以太坊官方 EIP 文档整理*