# Spec 1.0 — Web3 Upgrades 网站架构

> **状态**: 草案 (Draft)  
> **版本**: 1.0  
> **日期**: 2026-05-03  
> **作者**: superpowers dev workflow  

---

## 1. 项目概述 (Overview)

**Web3 Upgrades** 是一个开源的区块链协议升级知识库与展示网站。

### 核心目标
- 按 **链 (Chain)** → **升级 (Upgrade)** → **特性/提案 (Feature/EIP/BIP)** 三级结构组织内容
- 每个特性包含 **原始技术规格** 和 **AI 通俗解读** 两部分，可独立更新
- 支持 **多语言**（中文、英文为主，可扩展）
- 静态站点，快速、低成本、高可用

### 用户场景
- 开发者查阅某次以太坊升级的详细 EIP 内容
- 研究者对比不同链的升级路线图
- 学习者通过 AI 解读快速理解复杂技术概念
- 社区贡献者通过提交 Markdown 文件补充或修正内容

---

## 2. 技术栈 (Tech Stack)

| 层级 | 技术 | 理由 |
|------|------|------|
| **框架** | [Astro](https://astro.build/) |  islands 架构 = 静态站点性能 + 需要时的交互性；原生 Markdown 支持；Cloudflare Pages 官方推荐 |
| **样式** | Tailwind CSS + 自定义主题 | 快速迭代，设计系统一致性 |
| **部署** | [Cloudflare Pages](https://pages.cloudflare.com/) | 全球 CDN、免费额度充足、Git 集成自动部署 |
| **内容** | Markdown (.md) | 纯文本、Git 友好、非技术人员可编辑 |
| **内容解析** | Astro Content Collections | 类型安全、自动 slug 生成、frontmatter 校验 |

---

## 3. 数据架构 (Data Architecture)

### 3.1 目录约定

```
data/
├── ethereum/                          # 链目录 (chain)
│   ├── _meta.json                     # 链级元数据 (名称、图标、描述)
│   ├── frontier/                      # 升级目录 (upgrade)
│   │   ├── _meta.json                 # 升级级元数据 (日期、区块高度、类型)
│   │   ├── eip-2/                     # 特性目录 (feature)
│   │   │   ├── _meta.json             # 特性元数据 (EIP编号、名称、影响等级)
│   │   │   ├── original-zh.md         # 中文原始技术规格
│   │   │   ├── original-en.md         # 英文原始技术规格
│   │   │   ├── ai-introduce-zh.md     # 中文 AI 解读
│   │   │   └── ai-introduce-en.md     # 英文 AI 解读
│   │   ├── eip-7/
│   │   │   └── ...
│   ├── london/
│   │   ├── _meta.json
│   │   ├── eip-1559/
│   │   │   └── ...
│   ├── shanghai/
│   │   └── ...
├── bitcoin/                           # 另一条链
│   ├── _meta.json
│   ├── taproot/
│   │   ├── _meta.json
│   │   └── bip-340/
│   │       └── ...
└── solana/                            # 再一条链
    └── ...
```

### 3.2 元数据文件 (`_meta.json`)

**链级 `_meta.json`:**
```json
{
  "id": "ethereum",
  "name": "Ethereum",
  "nameZh": "以太坊",
  "icon": "🔷",
  "description": "世界计算机",
  "descriptionZh": "世界计算机",
  "website": "https://ethereum.org",
  "active": true,
  "sortOrder": 1
}
```

**升级级 `_meta.json`:**
```json
{
  "id": "shanghai",
  "name": "Shanghai",
  "nameZh": "上海升级",
  "date": "2023-04-12",
  "blockNumber": "17,034,870",
  "epochNumber": null,
  "type": ["execution", "consensus", "major"],
  "icon": "🔓",
  "summary": "质押提款开放",
  "summaryZh": "万众期待的质押提款开放",
  "sortOrder": 14
}
```

**特性级 `_meta.json`:**
```json
{
  "id": "eip-4895",
  "name": "Staking Withdrawals",
  "nameZh": "质押提款",
  "type": "eip",
  "number": 4895,
  "impact": "high",
  "category": "质押/共识",
  "major": true,
  "sortOrder": 1
}
```

### 3.3 Markdown 内容文件约定

**`original-<lang>.md`** — 原始技术规格
```markdown
---
lang: zh
type: original
source: https://eips.ethereum.org/EIPS/eip-4895
lastUpdated: "2026-05-03"
---

# EIP-4895: Beacon Chain Push Withdrawals

## 摘要

引入系统级操作来推送质押提款：
1. 验证者可以指定执行层提款地址
2. 部分提款自动处理超过 32 ETH 的余额
3. 完全提款退出验证者并将全部余额转移

## 动机

质押者需要能够提取他们的 ETH...
```

**`ai-introduce-<lang>.md`** — AI 通俗解读
```markdown
---
lang: zh
type: ai-introduce
model: kimi-k2p6
lastUpdated: "2026-05-03"
version: "1.0"
---

# EIP-4895 通俗解读

## 一句话总结

PoS 闭环的最后拼图。质押者终于可以取回自己的 ETH。

## 为什么重要

在提款开放之前，质押是'单向'的——只能存入不能取出。
提款开放后，质押量不减反增，因为风险降低了...
```

### 3.4 内容更新策略

| 场景 | 操作 |
|------|------|
| 新增链 | 新建 `data/<chain>/` 目录 + `_meta.json` |
| 新增升级 | 新建 `data/<chain>/<upgrade>/` 目录 + `_meta.json` |
| 新增特性 | 新建 `data/<chain>/<upgrade>/<feature>/` 目录 + `_meta.json` + `.md` 文件 |
| 修正原文 | 编辑对应的 `original-<lang>.md`，更新 `lastUpdated` |
| 优化 AI 解读 | 编辑对应的 `ai-introduce-<lang>.md`，更新 `lastUpdated` 和 `version` |
| 新增语言 | 新增 `original-<newlang>.md` 和 `ai-introduce-<newlang>.md` |

---

## 4. 前端架构 (Frontend Architecture)

### 4.1 页面路由

```
/                          # 首页 — 链列表 + 精选升级
/[chain]                   # 链详情 — 该链所有升级时间线
/[chain]/[upgrade]          # 升级详情 — 卡片 + 特性列表
/[chain]/[upgrade]/[feature] # 特性详情 — 原文 + AI 解读 (标签切换)
/about                     # 关于页
/contributing              # 贡献指南
```

### 4.2 关键组件

| 组件 | 职责 | 文件 |
|------|------|------|
| `ChainCard` | 链列表中的卡片展示 | `src/components/ChainCard.astro` |
| `UpgradeCard` | 升级时间线中的卡片 | `src/components/UpgradeCard.astro` |
| `FeatureTag` | 特性标签（可点击跳转） | `src/components/FeatureTag.astro` |
| `FeatureDetail` | 特性详情页（原文/AI 切换） | `src/components/FeatureDetail.astro` |
| `LanguageSwitcher` | 语言切换器 | `src/components/LanguageSwitcher.astro` |
| `Timeline` | 时间线布局容器 | `src/components/Timeline.astro` |
| `MarkdownRenderer` | Markdown 渲染（支持代码高亮） | `src/components/MarkdownRenderer.astro` |

### 4.3 状态管理

- **无全局状态库**（Astro 是 MPA 架构）
- 语言偏好通过 `localStorage` + URL query param (`?lang=zh`) 传递
- 特性详情页的 "原文 / AI 解读" 切换通过客户端 JS 实现（Tabs）

### 4.4 设计系统

沿用现有深色主题设计：
- 背景: `#0a0a0f` → `#16161e`
- 强调色: 以太坊渐变 `#627eea` → `#a855f7` → `#00d4aa`
- 各链可自定义主题色（BTC 橙色、SOL 紫色等）
- 字体: Inter + Noto Sans SC

---

## 5. 构建与部署 (Build & Deploy)

### 5.1 构建流程

```
Git Push → GitHub Action / Cloudflare Integration →
  1. npm install
  2. npm run build (Astro 静态生成)
  3. Cloudflare Pages 部署
```

### 5.2 Cloudflare Pages 配置

```toml
# wrangler.toml
name = "web3-upgrades"
compatibility_date = "2026-05-03"

[site]
bucket = "./dist"
```

### 5.3 环境变量

```
# .env (本地开发)
PUBLIC_SITE_URL=https://web3-upgrades.pages.dev
PUBLIC_DEFAULT_LANG=zh
```

---

## 6. 扩展性设计 (Extensibility)

### 6.1 新增链的扩展

1. 创建 `data/<new-chain>/` 目录
2. 添加 `_meta.json`（定义链的名称、图标、主题色）
3. 添加升级目录和特性目录
4. 无需修改代码 — Astro Content Collections 自动发现

### 6.2 新增语言的扩展

1. 为每个特性新增 `original-<lang>.md` 和 `ai-introduce-<lang>.md`
2. 在 `src/i18n/` 中添加语言配置文件
3. 语言列表自动从文件系统中推断

### 6.3 未来可能的扩展

| 方向 | 方案 |
|------|------|
| 搜索功能 | 构建时生成搜索索引 JSON，客户端 Fuse.js 搜索 |
| 对比视图 | 新增 `/compare` 页面，允许对比不同链的升级 |
| 时间线视图 | 全部链的全局时间线，按时间混合展示 |
| RSS/Atom | 新增 API 路由生成订阅源 |
| 暗黑/亮色切换 | CSS 变量 + localStorage |

---

## 7. 贡献工作流 (Contributing Workflow)

### 7.1 内容贡献（非技术用户）

1. Fork 仓库
2. 在 `data/` 下新增/编辑 Markdown 文件
3. 提交 PR
4. CI 自动校验 Markdown 格式和元数据完整性
5. 维护者 Review & Merge
6. Cloudflare Pages 自动部署

### 7.2 技术贡献

1. Fork 仓库
2. 安装依赖 `npm install`
3. 本地开发 `npm run dev`
4. 修改组件/页面
5. 提交 PR
6. CI 运行构建测试
7. Merge 后自动部署

---

## 8. 项目结构 (Project Structure)

```
web3-upgrades/
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD (Cloudflare Pages)
├── data/                        # 📦 内容数据（核心资产）
│   ├── ethereum/
│   ├── bitcoin/
│   └── solana/
├── src/
│   ├── components/              # 可复用组件
│   ├── layouts/                 # 页面布局
│   ├── pages/                   # 路由页面
│   ├── content/                 # Astro Content Collections 配置
│   ├── i18n/                    # 国际化配置
│   └── styles/                  # 全局样式
├── public/                      # 静态资源
├── astro.config.mjs             # Astro 配置
├── tailwind.config.mjs          # Tailwind 配置
├── wrangler.toml                # Cloudflare 配置
└── package.json
```

---

## 9. 验收标准 (Acceptance Criteria)

- [ ] 访问 `/` 能看到链列表
- [ ] 访问 `/ethereum` 能看到以太坊升级时间线
- [ ] 访问 `/ethereum/shanghai` 能看到上海升级的所有特性
- [ ] 访问 `/ethereum/shanghai/eip-4895` 能看到 EIP-4895 的原文和 AI 解读（可切换）
- [ ] 语言切换器能切换中文/英文
- [ ] 新增一条链（如 Polygon）只需添加目录和 Markdown 文件，无需改代码
- [ ] Git Push 后自动部署到 Cloudflare Pages
- [ ] 在手机上访问体验良好（响应式设计）

---

## 10. 风险与缓解

| 风险 | 影响 | 缓解 |
|------|------|------|
| Markdown 文件过多，构建变慢 | 中 | 按需分页、延迟加载、构建缓存 |
| 内容贡献门槛（需要懂 Git） | 中 | 后期可接入在线编辑器（如 GitHub.dev） |
| AI 解读质量参差不齐 | 低 | 版本控制 + Review 流程 |
| 多语言内容不同步 | 低 | `lastUpdated` 元数据 + CI 检查 |

---

## 11. 下一步 (Next Steps)

1. **Phase 1**: 搭建 Astro 项目骨架 + Tailwind + Content Collections 配置
2. **Phase 2**: 实现链列表页 + 升级时间线页
3. **Phase 3**: 实现特性详情页（原文/AI 切换）
4. **Phase 4**: 将现有以太坊数据迁移到 `data/ethereum/` 目录
5. **Phase 5**: 部署到 Cloudflare Pages
6. **Phase 6**: 贡献指南 + README

---

*此 Spec 为架构级设计文档，后续实现细节将在分阶段 Plan 中细化。*
