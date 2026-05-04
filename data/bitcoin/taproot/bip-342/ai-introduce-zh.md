# BIP-342: Tapscript

## 一句话总结
Taproot 的脚本语言——Schnorr 签名验证、禁用低效多签、引入升级机制，让脚本更轻更快更可扩展。

## 核心解读

### 🔑 问题：旧脚本语言不够优雅
Bitcoin Script 有一些历史包袱：
- `OP_CHECKMULTISIG` 低效（最多支持 20 个公钥，且不可批量验证）
- 没有明确的升级路径
- 签名操作复杂

### 🛠️ 方案：Tapscript 升级
- **Schnorr 签名**：`OP_CHECKSIG` 和 `OP_CHECKSIGVERIFY` 直接验证 Schnorr（64字节签名）
- **禁用 CHECKMULTISIG**：不再支持旧的多签操作码，改用 `OP_CHECKSIGADD` + 聚合公钥
- **CHECKSIGADD**：`(pubkey count) OP_CHECKSIGADD` 累积有效签名计数，支持批量验证
- **MINIMALIF 强制**：`OP_IF` 的输入必须是严格的 0 或 1，消除一类延展性
- **OP_SUCCESSx 升级路径**：某些操作码变成 "无条件成功"，未来软分叉可以赋予它们新含义

### 📊 关键改进
- **效率**：多签从 O(n) 签名验证降到 O(1)（聚合后只需一次验证）
- **脚本大小**：无硬性 10,000 字节限制（只受区块重量限制）
- **Sigops 预算**：每个脚本有独立的签名预算，不占用区块全局 sigops

### 🏷️ 标签
`软分叉` `共识` `Tapscript` `脚本` `Schnorr` `批量验证` `升级路径` `效率`