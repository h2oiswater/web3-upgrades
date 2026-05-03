# Web3 Upgrades 实施计划

> **For implementer:** Use verification throughout. Build → Test → Commit.

**Goal:** 将现有静态 HTML 迁移为 Astro + Markdown CMS 架构的网站，支持多链、多语言、可扩展升级知识库。

**Architecture:** 数据与代码分离 — `data/` 存放 Markdown 内容，`src/` 存放 Astro 组件和页面。Astro Content Collections 类型安全地解析 Markdown，静态生成所有页面。

**Tech Stack:** Astro 5 + Tailwind CSS + Cloudflare Pages

**Source Spec:** `docs/spec-01-website-architecture.md`

---

## Phase 1: 项目骨架搭建

### Task 1.1: 初始化 Astro 项目

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`

**Step 1: 初始化项目**
```bash
cd /tmp/web3-upgrades
# 备份现有文件
git checkout -b astro-migration
mkdir -p backup
cp index.html backup/
# 使用 Astro 官方模板
npm create astro@latest . -- --template minimal --install --git false --typescript strict --no
```

**Step 2: 验证项目结构**
Command: `ls -la`
Expected: 看到 `src/`, `public/`, `astro.config.mjs`, `package.json`

**Step 3: 安装依赖**
```bash
npm install @astrojs/tailwind astro-icon
npx astro add tailwind -y
```

**Step 4: 验证构建**
Command: `npm run build`
Expected: `dist/` 目录生成，无错误

**Step 5: 提交**
```bash
git add -A
git commit -m "feat: init Astro project with Tailwind"
```

---

### Task 1.2: 配置 Astro 内容集合

**Files:**
- Create: `src/content/config.ts`
- Modify: `astro.config.mjs`

**Step 1: 定义内容集合 Schema**

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const chainsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    nameZh: z.string(),
    icon: z.string().optional(),
    description: z.string(),
    descriptionZh: z.string(),
    website: z.string().url().optional(),
    active: z.boolean().default(true),
    sortOrder: z.number().default(999),
  }),
});

const upgradesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    nameZh: z.string().optional(),
    date: z.string().datetime().optional(),
    blockNumber: z.string().optional(),
    epochNumber: z.string().optional(),
    type: z.array(z.enum(['execution', 'consensus', 'l2', 'economic', 'security', 'major'])).default([]),
    icon: z.string().optional(),
    summary: z.string(),
    summaryZh: z.string().optional(),
    sortOrder: z.number().default(999),
    chainId: z.string(),
  }),
});

const featuresCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    nameZh: z.string().optional(),
    type: z.enum(['eip', 'bip', 'sip', 'other']).default('other'),
    number: z.number().optional(),
    impact: z.enum(['high', 'medium', 'low']).default('medium'),
    category: z.string().optional(),
    major: z.boolean().default(false),
    sortOrder: z.number().default(999),
    chainId: z.string(),
    upgradeId: z.string(),
  }),
});

export const collections = {
  chains: chainsCollection,
  upgrades: upgradesCollection,
  features: featuresCollection,
};
```

**Step 2: 配置 Astro**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  site: 'https://h2oiswater.github.io',
  base: '/web3-upgrades',
});
```

**Step 3: 验证类型安全**
Command: `npx astro check`
Expected: 无类型错误

**Step 4: 提交**
```bash
git add -A
git commit -m "feat: configure Astro content collections with schemas"
```

---

### Task 1.3: 全局样式与布局

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/Layout.astro`

**Step 1: 创建全局样式**

```css
/* src/styles/global.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #111118;
  --bg-card: #16161e;
  --bg-card-hover: #1c1c26;
  --border-color: #2a2a3a;
  --border-hover: #3a3a50;
  --text-primary: #f0f0f5;
  --text-secondary: #9a9ab0;
  --text-muted: #6a6a80;
  --accent-blue: #627eea;
  --accent-blue-light: #8aa4f0;
  --accent-cyan: #00d4aa;
  --accent-purple: #a855f7;
  --accent-orange: #f59e0b;
  --accent-red: #ef4444;
  --accent-green: #22c55e;
}

body {
  font-family: 'Inter', 'Noto Sans SC', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
}
```

**Step 2: 创建基础布局**

```astro
---
// src/layouts/Layout.astro
interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Web3 Upgrades Knowledge Base' } = Astro.props;
---

<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
<body class="min-h-screen antialiased">
  <slot />
</body>
</html>
```

**Step 3: 验证构建**
Command: `npm run build`
Expected: 构建成功

**Step 4: 提交**
```bash
git add -A
git commit -m "feat: add global styles and base layout"
```

---

## Phase 2: 数据迁移（核心）

### Task 2.1: 创建数据目录结构

**Files:**
- Create: `data/ethereum/_meta.json`
- Create: 20 个升级目录，每个含 `_meta.json`
- Create: 60 个特性目录，每个含 `_meta.json`

**Step 1: 创建以太坊链元数据**

```json
// data/ethereum/_meta.json
{
  "id": "ethereum",
  "name": "Ethereum",
  "nameZh": "以太坊",
  "icon": "🔷",
  "description": "World Computer",
  "descriptionZh": "世界计算机",
  "website": "https://ethereum.org",
  "active": true,
  "sortOrder": 1
}
```

**Step 2: 创建升级目录和元数据**

使用脚本批量创建：
```bash
mkdir -p data/ethereum/{frontier,frontier-thawing,homestead,dao-fork,tangerine-whistle,spurious-dragon,byzantium,constantinople,petersburg,istanbul,muir-glacier,berlin,london,arrow-glacier,gray-glacier,the-merge,shanghai,cancun-deneb,prague-electra,fulu-osaka}
```

为每个升级创建 `_meta.json`（示例）：
```json
// data/ethereum/shanghai/_meta.json
{
  "id": "shanghai",
  "name": "Shanghai",
  "nameZh": "上海升级",
  "date": "2023-04-12",
  "blockNumber": "17,034,870",
  "type": ["execution", "consensus", "major"],
  "icon": "🔓",
  "summary": "Staking withdrawals enabled",
  "summaryZh": "万众期待的质押提款开放",
  "sortOrder": 14
}
```

**Step 3: 创建特性目录和元数据**

为每个 EIP 创建目录：
```bash
mkdir -p data/ethereum/shanghai/eip-4895
echo '{
  "id": "eip-4895",
  "name": "Staking Withdrawals",
  "nameZh": "质押提款",
  "type": "eip",
  "number": 4895,
  "impact": "high",
  "category": "质押/共识",
  "major": true,
  "sortOrder": 1
}' > data/ethereum/shanghai/eip-4895/_meta.json
```

**Step 4: 验证结构**
Command: `find data -name '_meta.json' | wc -l`
Expected: `21` (1 chain + 20 upgrades)

**Step 5: 提交**
```bash
git add -A
git commit -m "feat: add data directory structure for ethereum upgrades"
```

---

### Task 2.2: 迁移 EIP 原文内容

**Files:**
- Create: `data/ethereum/<upgrade>/<feature>/original-zh.md` (60 个)

**Step 1: 编写迁移脚本**

从现有 `index.html` 的 `eipDetails` 对象中提取内容，自动生成 Markdown：

```javascript
// scripts/migrate-content.js
const fs = require('fs');
const path = require('path');

// 读取现有 index.html 中的 eipDetails
const htmlContent = fs.readFileSync('backup/index.html', 'utf-8');
// 解析 eipDetails...（此处需要完整解析逻辑）

// 生成 Markdown 文件
function createOriginalMd(eip, detail, upgradePath) {
  const content = `---
lang: zh
type: original
source: https://eips.ethereum.org/EIPS/${eip.toLowerCase()}
lastUpdated: "2026-05-03"
---

# ${eip}

${detail.original}
`;
  fs.writeFileSync(path.join(upgradePath, eip.toLowerCase(), 'original-zh.md'), content);
}
```

**Step 2: 运行迁移**
Command: `node scripts/migrate-content.js`
Expected: 60 个 `original-zh.md` 文件生成

**Step 3: 验证内容**
Command: `head -20 data/ethereum/shanghai/eip-4895/original-zh.md`
Expected: 看到 frontmatter + 技术规格原文

**Step 4: 提交**
```bash
git add -A
git commit -m "feat: migrate original EIP content to Markdown files"
```

---

### Task 2.3: 迁移 AI 解读内容

**Files:**
- Create: `data/ethereum/<upgrade>/<feature>/ai-introduce-zh.md` (60 个)

**Step 1: 生成 AI 解读 Markdown**

```javascript
// 在 migrate-content.js 中添加
function createAiMd(eip, detail, upgradePath) {
  const content = `---
lang: zh
type: ai-introduce
model: kimi-k2p6
lastUpdated: "2026-05-03"
version: "1.0"
---

# ${eip} 通俗解读

## 一句话总结

${detail.aiSummary.split('。')[0]}。

## AI 解读

${detail.aiSummary}

## 影响评估

- **等级**: ${detail.impact === 'high' ? '🔴 高' : detail.impact === 'medium' ? '🟡 中' : '🟢 低'}
- **分类**: ${detail.category}
`;
  fs.writeFileSync(path.join(upgradePath, eip.toLowerCase(), 'ai-introduce-zh.md'), content);
}
```

**Step 2: 运行迁移**
Command: `node scripts/migrate-content.js`

**Step 3: 验证**
Command: `head -15 data/ethereum/shanghai/eip-4895/ai-introduce-zh.md`

**Step 4: 提交**
```bash
git add -A
git commit -m "feat: migrate AI interpretation content to Markdown files"
```

---

## Phase 3: 页面与组件

### Task 3.1: 链列表首页

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/components/ChainCard.astro`

**Step 1: 读取链数据**

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import ChainCard from '../components/ChainCard.astro';

// 读取 data/ 目录下的 _meta.json
const chains = await Astro.glob('../../data/**/_meta.json')
  .filter(m => m.default.id && !m.default.chainId) // 链级 meta
  .sort((a, b) => a.default.sortOrder - b.default.sortOrder);
---

<Layout title="Web3 Upgrades">
  <main class="max-w-6xl mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold text-center mb-4">Web3 Upgrades</h1>
    <p class="text-center text-gray-400 mb-12">区块链协议升级知识库</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {chains.map(chain => <ChainCard chain={chain.default} />)}
    </div>
  </main>
</Layout>
```

**Step 2: 创建 ChainCard 组件**

```astro
---
// src/components/ChainCard.astro
interface Props {
  chain: {
    id: string;
    name: string;
    nameZh: string;
    icon?: string;
    description: string;
    descriptionZh: string;
  };
}

const { chain } = Astro.props;
---

<a 
  href={`/web3-upgrades/${chain.id}`}
  class="block p-6 rounded-xl border border-[#2a2a3a] bg-[#16161e] hover:bg-[#1c1c26] transition-all hover:-translate-y-1"
>
  <div class="text-3xl mb-3">{chain.icon}</div>
  <h2 class="text-xl font-bold mb-1">{chain.nameZh} <span class="text-sm text-gray-500">{chain.name}</span></h2>
  <p class="text-sm text-gray-400">{chain.descriptionZh}</p>
</a>
```

**Step 3: 构建并验证**
Command: `npm run build`
Expected: 构建成功，`dist/index.html` 存在

**Step 4: 提交**
```bash
git add -A
git commit -m "feat: add chain list homepage with ChainCard component"
```

---

### Task 3.2: 升级时间线页

**Files:**
- Create: `src/pages/[chain].astro`
- Create: `src/components/UpgradeCard.astro`
- Create: `src/components/Timeline.astro`

**Step 1: 创建动态路由页面**

```astro
---
// src/pages/[chain].astro
import Layout from '../layouts/Layout.astro';
import UpgradeCard from '../components/UpgradeCard.astro';

export async function getStaticPaths() {
  const chains = await Astro.glob('../../data/**/_meta.json')
    .filter(m => m.default.id && !m.default.chainId);
  
  return chains.map(chain => ({
    params: { chain: chain.default.id },
    props: { chainMeta: chain.default },
  }));
}

const { chain } = Astro.params;
const { chainMeta } = Astro.props;

// 读取该链的升级
const upgrades = await Astro.glob('../../data/' + chain + '/**/_meta.json')
  .filter(m => m.default.chainId === chain || (m.default.date && !m.default.number))
  .sort((a, b) => new Date(a.default.date) - new Date(b.default.date));
---

<Layout title={`${chainMeta.nameZh} 升级记录`}>
  <main class="max-w-4xl mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <div class="text-5xl mb-4">{chainMeta.icon}</div>
      <h1 class="text-3xl font-bold">{chainMeta.nameZh}</h1>
      <p class="text-gray-400 mt-2">{chainMeta.descriptionZh}</p>
    </div>
    
    <div class="relative">
      {/* 时间线 */}
      <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#2a2a3a] -translate-x-1/2" />
      
      {upgrades.map((upgrade, i) => (
        <UpgradeCard upgrade={upgrade.default} index={i} />
      ))}
    </div>
  </main>
</Layout>
```

**Step 2: 创建 UpgradeCard 组件**

```astro
---
// src/components/UpgradeCard.astro
interface Props {
  upgrade: {
    id: string;
    name: string;
    nameZh?: string;
    date?: string;
    blockNumber?: string;
    type: string[];
    icon?: string;
    summary: string;
    summaryZh?: string;
  };
  index: number;
}

const { upgrade, index } = Astro.props;
const isLeft = index % 2 === 0;
---

<div class={`flex items-start gap-8 mb-12 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
  <div class="flex-1" />
  
  {/* 时间线节点 */}
  <div class="relative z-10 w-4 h-4 rounded-full bg-[#0a0a0f] border-2 border-[#627eea] mt-6 shrink-0" />
  
  <div class="flex-1">
    <a 
      href={`./${upgrade.id}`}
      class="block p-6 rounded-xl border border-[#2a2a3a] bg-[#16161e] hover:bg-[#1c1c26] transition-all hover:-translate-y-0.5"
    >
      <div class="flex items-center gap-3 mb-3">
        <span class="text-2xl">{upgrade.icon}</span>
        <div>
          <h3 class="text-lg font-bold">{upgrade.nameZh || upgrade.name}</h3>
          {upgrade.blockNumber && <span class="text-xs text-gray-500">区块 {upgrade.blockNumber}</span>}
        </div>
      </div>
      <p class="text-sm text-gray-400 mb-3">{upgrade.summaryZh || upgrade.summary}</p>
      <div class="flex gap-2 flex-wrap">
        {upgrade.type.map(t => (
          <span class="px-2 py-0.5 rounded text-xs bg-[#627eea]/10 text-[#8aa4f0] border border-[#627eea]/20">
            {t}
          </span>
        ))}
      </div>
    </a>
  </div>
</div>
```

**Step 3: 验证动态路由**
Command: `npm run build`
Expected: `dist/ethereum/index.html` 生成

**Step 4: 提交**
```bash
git add -A
git commit -m "feat: add chain detail page with upgrade timeline"
```

---

### Task 3.3: 特性详情页（原文 / AI 切换）

**Files:**
- Create: `src/pages/[chain]/[upgrade]/[feature].astro`
- Create: `src/components/FeatureDetail.astro`

**Step 1: 创建特性详情页**

```astro
---
// src/pages/[chain]/[upgrade]/[feature].astro
import Layout from '../../../../layouts/Layout.astro';

export async function getStaticPaths() {
  // 遍历所有特性目录
  const features = [];
  const chains = ['ethereum']; // 可扩展
  
  for (const chain of chains) {
    // 读取升级目录
    // ... 遍历逻辑
  }
  
  return features;
}

const { chain, upgrade, feature } = Astro.params;

// 读取 Markdown 文件
let originalContent = '';
let aiContent = '';

try {
  originalContent = await Astro.glob(`../../../../data/${chain}/${upgrade}/${feature}/original-zh.md`);
} catch {}

try {
  aiContent = await Astro.glob(`../../../../data/${chain}/${upgrade}/${feature}/ai-introduce-zh.md`);
} catch {}
---

<Layout title={`${feature} 详情`}>
  <main class="max-w-3xl mx-auto px-4 py-12">
    {/* Tabs */}
    <div class="flex gap-4 mb-8 border-b border-[#2a2a3a]">
      <button id="tab-original" class="pb-3 px-4 text-[#8aa4f0] border-b-2 border-[#627eea]">📋 技术原文</button>
      <button id="tab-ai" class="pb-3 px-4 text-gray-500 hover:text-gray-300">🤖 AI 解读</button>
    </div>
    
    {/* 原文内容 */}
    <div id="content-original" class="prose prose-invert max-w-none">
      {originalContent.length > 0 ? (
        <div set:html={originalContent[0].compiledContent()} />
      ) : (
        <p class="text-gray-500">暂无原文内容</p>
      )}
    </div>
    
    {/* AI 解读内容 */}
    <div id="content-ai" class="prose prose-invert max-w-none hidden">
      {aiContent.length > 0 ? (
        <div set:html={aiContent[0].compiledContent()} />
      ) : (
        <p class="text-gray-500">暂无 AI 解读</p>
      )}
    </div>
  </main>
  
  <script>
    const tabOriginal = document.getElementById('tab-original');
    const tabAi = document.getElementById('tab-ai');
    const contentOriginal = document.getElementById('content-original');
    const contentAi = document.getElementById('content-ai');
    
    tabOriginal.addEventListener('click', () => {
      tabOriginal.classList.add('text-[#8aa4f0]', 'border-[#627eea]');
      tabOriginal.classList.remove('text-gray-500');
      tabAi.classList.remove('text-[#8aa4f0]', 'border-[#627eea]');
      tabAi.classList.add('text-gray-500');
      contentOriginal.classList.remove('hidden');
      contentAi.classList.add('hidden');
    });
    
    tabAi.addEventListener('click', () => {
      tabAi.classList.add('text-[#8aa4f0]', 'border-[#627eea]');
      tabAi.classList.remove('text-gray-500');
      tabOriginal.classList.remove('text-[#8aa4f0]', 'border-[#627eea]');
      tabOriginal.classList.add('text-gray-500');
      contentAi.classList.remove('hidden');
      contentOriginal.classList.add('hidden');
    });
  </script>
</Layout>
```

**Step 2: 验证构建**
Command: `npm run build`
Expected: `dist/ethereum/shanghai/eip-4895/index.html` 生成

**Step 3: 提交**
```bash
git add -A
git commit -m "feat: add feature detail page with original/AI tab switching"
```

---

## Phase 4: 部署配置

### Task 4.1: Cloudflare Pages 配置

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `wrangler.toml`
- Modify: `astro.config.mjs`

**Step 1: GitHub Actions 工作流**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: web3-upgrades
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

**Step 2: Wrangler 配置**

```toml
# wrangler.toml
name = "web3-upgrades"
compatibility_date = "2026-05-03"

[site]
bucket = "./dist"
```

**Step 3: 更新 Astro 配置**

```javascript
// astro.config.mjs
export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  site: 'https://web3-upgrades.pages.dev',
  base: '/',
});
```

**Step 4: 验证构建**
Command: `npm run build`
Expected: 构建成功

**Step 5: 提交**
```bash
git add -A
git commit -m "feat: add Cloudflare Pages deployment configuration"
```

---

### Task 4.2: 清理旧文件并推送

**Files:**
- Delete: `index.html`（旧版）
- Create: `README.md`

**Step 1: 删除旧版 index.html**
```bash
rm index.html
git add -A
git commit -m "chore: remove old static HTML (migrated to Astro)"
```

**Step 2: 创建 README**

```markdown
# Web3 Upgrades

区块链协议升级知识库。支持多链、多语言、可扩展。

## 技术栈

- Astro 5
- Tailwind CSS
- Cloudflare Pages

## 数据结构

```
data/
├── ethereum/
│   ├── shanghai/
│   │   ├── eip-4895/
│   │   │   ├── original-zh.md
│   │   │   └── ai-introduce-zh.md
```

## 贡献

### 新增链
1. 创建 `data/<chain>/_meta.json`
2. 添加升级目录和 Markdown 文件

### 修正内容
编辑对应的 `.md` 文件，更新 `lastUpdated`。

## 开发

```bash
npm install
npm run dev
```

## 部署

Push 到 main 分支自动部署到 Cloudflare Pages。
```

**Step 3: 最终提交**
```bash
git add -A
git commit -m "docs: add README with contributing guide"
```

**Step 4: 推送分支**
```bash
git push origin astro-migration
```

---

## Phase 5: 验证与合并

### Task 5.1: 本地验证

**Files:**
- N/A (验证步骤)

**Step 1: 完整构建**
Command: `npm run build`
Expected: 无错误，`dist/` 包含所有页面

**Step 2: 检查关键页面**
Command: `ls dist/` && `ls dist/ethereum/` && `ls dist/ethereum/shanghai/`
Expected: `index.html` 存在，`eip-4895/index.html` 存在

**Step 3: 预览**
Command: `npm run preview`
然后浏览器访问 `http://localhost:4321`
Expected: 链列表页正常显示

---

### Task 5.2: 创建 PR 并合并

**Step 1: 创建 PR**
在 GitHub 上创建 PR：`astro-migration` → `main`

**Step 2: 等待 CI 通过**
GitHub Actions 应自动运行并构建成功。

**Step 3: 合并**
合并 PR，`main` 分支自动部署到 Cloudflare Pages。

**Step 4: 验证线上**
访问 `https://web3-upgrades.pages.dev`
Expected: 网站正常工作！

---

## 验收清单 (Checklist)

- [ ] `npm run build` 成功无错误
- [ ] `dist/` 包含首页 `/index.html`
- [ ] `dist/ethereum/index.html` 存在（升级时间线）
- [ ] `dist/ethereum/shanghai/eip-4895/index.html` 存在（特性详情）
- [ ] 特性详情页可以切换 "原文" / "AI 解读" Tab
- [ ] 链列表页显示以太坊卡片
- [ ] 样式与现有深色主题一致
- [ ] Cloudflare Pages 自动部署成功
- [ ] 数据目录结构符合 Spec 1.0 约定

---

## 风险与回滚

| 风险 | 方案 |
|------|------|
| Astro 构建失败 | 保留 `backup/index.html`，可随时切回旧版 |
| Cloudflare Pages 部署问题 | 检查 `dist/` 目录大小是否超出免费额度 |
| 内容迁移遗漏 | 对比原始 `index.html` 中的 eipDetails 数量 |

---

*Plan saved. Ready for Subagent-Driven execution.*
