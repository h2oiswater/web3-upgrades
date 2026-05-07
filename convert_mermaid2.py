import re
import os

def get_code_blocks(filepath):
    """Extract all code-block contents with exact raw text."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    blocks = []
    idx = 0
    while True:
        start = content.find('<pre class="code-block">', idx)
        if start == -1:
            break
        code_start = content.find('<code>', start)
        code_end = content.find('</code>', code_start)
        pre_end = content.find('</pre>', code_end)
        
        full_text = content[start:pre_end+6]
        code_text = content[code_start+6:code_end]
        blocks.append({
            'start': start,
            'end': pre_end + 6,
            'full': full_text,
            'code': code_text
        })
        idx = pre_end + 6
    
    return content, blocks

def replace_specific_block(filepath, block_code, mermaid_text):
    """Replace a specific code block with mermaid."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    old = f'<pre class="code-block"><code>{block_code}</code></pre>'
    new = f'<pre class="mermaid">\n{mermaid_text}\n</pre>'
    
    if old not in content:
        print(f"  ERROR: Block not found")
        print(f"  Searching for first 100 chars: {repr(block_code[:100])}")
        return False
    
    content = content.replace(old, new, 1)
    with open(filepath, 'w') as f:
        f.write(content)
    return True

# ============================================================
# Define all conversions: (filename, block_index, mermaid_text)
# ============================================================
conversions = []

# --- 04.astro ---
filepath = 'src/pages/zk-learning/04.astro'
_, blocks = get_code_blocks(filepath)
conversions.append((filepath, blocks[2]['code'], '''flowchart TD
    subgraph SG["双线性配对的三群结构"]
        G1["G₁（源群1）<br/>椭圆曲线点 E(F_p)[r]<br/>点加法运算 ●"]
        G2["G₂（源群2）<br/>椭圆曲线点 E(F_{p^k})[r]<br/>点加法运算 ●"]
        GT["G_T（目标群）<br/>有限域元素 F_{p^k}^*<br/>乘法运算 ×"]
        Pairing["配对 e(·,·)"]
        Result["e(P,Q) ∈ G_T"]
    end
    G1 --> Pairing
    G2 --> Pairing
    Pairing --> Result
    Result --> GT'''))

conversions.append((filepath, blocks[3]['code'], '''flowchart TD
    Start["输入：P ∈ G₁, Q ∈ G₂<br/>目标：计算 e(P, Q)"]
    Init["初始化：f = 1（单位元）"]
    Loop["对 r 的二进制表示<br/>从高位到低位遍历每一位"]
    DoubleStep["f = f² · g_{T,T}(Q)<br/>T = 2T<br/>← 双倍步"]
    CheckBit{"当前位是 1？"}
    AddStep["f = f · g_{T,P}(Q)<br/>T = T + P<br/>← 加法步"]
    Final["最后：e(P,Q) = f^{(p^k-1)/r}"]
    Start --> Init
    Init --> Loop
    Loop --> DoubleStep
    DoubleStep --> CheckBit
    CheckBit -->|"是"| AddStep
    AddStep --> Loop
    CheckBit -->|"否"| Loop
    Loop -->|"遍历完成"| Final'''))

# --- 05.astro ---
filepath = 'src/pages/zk-learning/05.astro'
_, blocks = get_code_blocks(filepath)
conversions.append((filepath, blocks[1]['code'], '''flowchart TD
    L0["第0层（输入）<br/>系数 [a₀, a₁, a₂, a₃, a₄, a₅, a₆, a₇]"]
    L1["第1层（2点DFT）<br/>偶位↔奇位配对"]
    Butterfly["每个蝶形节点:<br/>A ──► A + ωᵏ·B<br/>B ──► A - ωᵏ·B<br/>← 利用 ω^(k+n/2) = -ωᵏ"]
    L2["第2层（4点DFT）<br/>合并相邻2点结果<br/>(ω⁰, ω¹)"]
    L3["第3层（8点DFT）<br/>最终合并为完整结果"]
    Result["[y₀, y₁, y₂, y₃, y₄, y₅, y₆, y₇]<br/> = p(ω⁰), p(ω¹), ..., p(ω⁷)<br/>多项式在8个单位根处的求值结果"]
    Complexity["总复杂度：<br/>每一层 O(n) 操作，共 log₂(n) 层 → O(n log n)"]
    L0 --> L1
    L1 --> Butterfly
    Butterfly --> L2
    L2 --> L3
    L3 --> Result
    Result -.-> Complexity'''))

conversions.append((filepath, blocks[2]['code'], '''flowchart TD
    Setup["可信设置阶段<br/>（一次性，多方参与）<br/>SRS = {g, g^τ, g^(τ²), ..., g^(τᵈ)}<br/>τ 是秘密随机数，必须销毁<br/>g 是椭圆曲线群 G₁ 的生成元"]
    Commit["承诺阶段（证明者）<br/>p(x) = a₀ + a₁x + ... + a_dxᵈ<br/>Commit(p) = g^(p(τ))<br/>← 用SRS中的点做线性组合，无需知道 τ"]
    Open["开启阶段<br/>（验证者随机选点 z）<br/>证明者计算: y = p(z)<br/>构造证明 π（证明 p(τ)-p(z) 被 τ-z 整除）"]
    Verify["验证阶段（验证者，仅需2次配对）<br/>e(Commit(p) / g^y, h) = e(π, h^(τ-z))<br/>← 利用配对的双线性性质<br/>验证 p(τ)-p(z) = Q(τ)·(τ-z)"]
    Setup --> Commit
    Commit -->|"发送给验证者"| Open
    Open --> Verify'''))

# --- 06.astro ---
filepath = 'src/pages/zk-learning/06.astro'
_, blocks = get_code_blocks(filepath)
# Block 2 = QAP transformation (block index 2)
conversions.append((filepath, blocks[2]['code'], '''flowchart TD
    Phase1["阶段1: R1CS 离散约束<br/>(逐行验证)<br/>x=1..4: (Ai·s) × (Bi·s) = (Ci·s)<br/>← 约束点 r1..r4"]
    Interp["↓ 拉格朗日插值<br/>(Lagrange Interpolation)"]
    Phase2["阶段2: QAP 多项式表达<br/>(逐点→曲线)"]
    ABC["A(x), B(x), C(x)"]
    Product["A(x)·B(x) - C(x)<br/>在 r1,r2,r3,r4 处 = 0"]
    Divisible["可被 t(x) 整除"]
    Final["A(x)·B(x) - C(x) = H(x) · t(x)"]
    Note["其中 t(x) = (x-r1)(x-r2)(x-r3)(x-r4)"]
    Phase1 --> Interp
    Interp --> Phase2
    Phase2 --> ABC
    ABC --> Product
    Product --> Divisible
    Divisible --> Final
    Final -.-> Note'''))

# --- 07.astro ---
filepath = 'src/pages/zk-learning/07.astro'
_, blocks = get_code_blocks(filepath)
# Block 1 = Groth16 proving flow, Block 2 = verification equation
conversions.append((filepath, blocks[1]['code'], '''flowchart TD
    Input["输入: pk (proving key), x (公开输入), w (私密见证)"]
    S1["Step 1: 构造完整见证向量 s<br/>s = (1, x₁, ..., xₙ, w₁, ..., wₘ)<br/>其中1是常量，x是公开输入，w是私密输入"]
    S2["Step 2: 在群上计算线性组合<br/>A = α + Σ sᵢ·Aᵢ(τ) + r·δ<br/>B = β + Σ sᵢ·Bᵢ(τ) + s·δ<br/>← 第一/二个曲线点"]
    S3["Step 3: 计算 C 使得配对等式成立<br/>C = (Σ wᵢ·(βAᵢ(τ)+αBᵢ(τ)+Cᵢ(τ)) + H(τ)·Z(τ)) / δ<br/>+ r·B + s·A - rs·δ"]
    S4["Step 4: 输出证明 π = (A, B, C)"]
    Core["内部核心:<br/>利用pk中预计算的 g^{τⁱ} 点<br/>通过多标量乘法(MSM)快速求值"]
    Input --> S1
    S1 --> S2
    S2 --> S3
    S3 --> S4
    S4 -.-> Core'''))

conversions.append((filepath, blocks[2]['code'], '''flowchart LR
    Left["左端（证明的承诺组合）<br/>e(A, B)"]
    PiA["π_A<br/>证明者承诺的witness<br/>（在第一群G₁上）"]
    PiB["π_B<br/>证明者承诺的witness<br/>（在第二群G₂上）"]
    PiC["π_C<br/>调整项保证等式成立"]
    Right1["e(α, β)<br/>系统常数<br/>（Setup时固定）"]
    Right2["e(IC, γ)<br/>公开输入<br/>（由x线性组合得到）"]
    Right3["e(C, δ)<br/>私密部分<br/>（证明的平衡块）"]
    Eq["="]
    Note["其中 e(·,·) 是双线性配对运算<br/>e(aP, bQ) = e(P,Q)^(ab)"]
    Cost["验证者只需:<br/>1次 e(A,B) + 3次右侧配对相乘<br/>= 总共约3次配对运算"]
    Left --> PiA
    Left --> PiB
    PiA --> PiC
    PiC --> Eq
    Eq --> Right1
    Eq --> Right2
    Eq --> Right3
    Eq -.-> Note
    Note -.-> Cost'''))

# --- 08.astro ---
filepath = 'src/pages/zk-learning/08.astro'
_, blocks = get_code_blocks(filepath)
# Block 0 = PLONK flow, Block 1 = KZG flow
conversions.append((filepath, blocks[0]['code'], '''flowchart TD
    R1["Round 1: 提交 Witness 多项式<br/>Prover 计算 a[i], b[i], c[i]<br/>插值得 a(X), b(X), c(X)<br/>KZG 承诺并发送: [a]₁, [b]₁, [c]₁"]
    R2["Round 2: 提交置换累积器多项式<br/>计算拷贝约束对应的 Z(X)<br/>KZG 承诺并发送: [Z]₁"]
    R3["Round 3: 构造并提交商多项式<br/>Verifier 发送 β, γ<br/>Prover 构造 num(X) = 门约束 + β·拷贝约束 + γ·公开输入<br/>t(X) = num(X) / Z_H(X)<br/>拆分 t_lo, t_mid, t_hi 分别承诺"]
    R4["Round 4: 在挑战点处评估<br/>Verifier 发送 z<br/>Prover 计算 ā, b̄, c̄, z̄, t̄...<br/>发送给 Verifier"]
    R5["Round 5: 构造并提交打开证明<br/>Prover 构造 KZG 打开证明<br/>聚合为批次证明<br/>Verifier 一次配对验证"]
    Final["最终验证: Verifier 检查<br/>1) KZG 打开证明一致性<br/>2) 约束方程在 z 点成立<br/>3) Fiat-Shamir 挑战可复现"]
    R1 --> R2
    R2 --> R3
    R3 --> R4
    R4 --> R5
    R5 -.-> Final'''))

conversions.append((filepath, blocks[1]['code'], '''flowchart TD
    Setup["可信设置阶段<br/>(一次性，多方计算仪式)<br/>τ = 随机秘密值 (必须销毁)<br/>SRS = {[1]₁, [τ]₁, [τ²]₁,...,[τᴰ]₁}<br/>{[1]₂, [τ]₂}"]
    Commit["承诺阶段 (Prover)<br/>输入: f(X) = f₀ + f₁X + ... + f_d Xᵈ<br/>输出: C = [f(τ)]₁<br/>= f₀·[1]₁ + f₁·[τ]₁ + ..."]
    Open["打开阶段<br/>(Prover 响应挑战点 z)<br/>y = f(z)<br/>q(X) = (f(X) - y) / (X - z)<br/>π = [q(τ)]₁ ← 打开证明"]
    Verify["验证阶段 (Verifier)<br/>检查: e(C - [y]₁, [1]₂) = e(π, [τ-z]₂)<br/>仅 2 次配对运算 → O(1) 验证"]
    Note1["安全假设: 强 Diffie-Hellman (d-SDH)"]
    Note2["证明大小: O(1) ≈ 48 字节 (BLS12-381)<br/>验证成本: O(1) 2次配对"]
    Setup --> Commit
    Commit --> Open
    Open --> Verify
    Verify -.-> Note1
    Note1 -.-> Note2'''))

# --- 09.astro ---
filepath = 'src/pages/zk-learning/09.astro'
_, blocks = get_code_blocks(filepath)
# Block 0 = SNARK vs STARK, Block 1 = FRI, Block 3 = Cairo pipeline
conversions.append((filepath, blocks[0]['code'], '''flowchart LR
    subgraph SNARK["zk-SNARK (Groth16)"]
        S1["① 可信设置仪式<br/>生成秘密参数<br/>至少一人诚实销毁 → 安全"]
        S2["② 电路编译 (R1CS/QAP)<br/>约束展平为多项式<br/>生成 witness 向量"]
        S3["③ KZG承诺 + 配对验证<br/>构造 π = (π_a, π_b, π_c)"]
        S4["④ 证明: ~192 字节<br/>3个椭圆曲线点"]
        S5["⑤ 验证: ~3ms (3次配对)<br/>非常简洁"]
    end
    subgraph STARK["zk-STARK"]
        T1["① 公开随机性<br/>用公开哈希值作为挑战<br/>无需信任任何参与者"]
        T2["② 程序编译 (Cairo)<br/>编译为 Sierra → CASM<br/>生成执行轨迹 (Trace)"]
        T3["③ FRI折叠 + Merkle承诺<br/>低度扩展 (LDE)<br/>递归折半多项式次数"]
        T4["④ 证明: ~50-200 KB<br/>Merkle路径 + 查询应答"]
        T5["⑤ 验证: ~5-10ms (哈希检查)<br/>大数据集下反而更快"]
    end
    S1 --> S2 --> S3 --> S4 --> S5
    T1 --> T2 --> T3 --> T4 --> T5
    Security["安全假设: 椭圆曲线配对 vs 抗碰撞哈希<br/>量子安全: 否 vs 是"]
    S5 -.-> Security
    T5 -.-> Security'''))

conversions.append((filepath, blocks[1]['code'], '''flowchart TD
    Start["原始多项式 f(x)<br/>次数 ≤ 2d，定义域大小 = 2N"]
    Eval["f(x) 在 2N 个点上的取值<br/>x₁, x₂, ..., x_{2N}"]
    Merkle["Merkle树承诺<br/>根哈希公开"]
    Challenge["验证者发送随机挑战 r"]
    Pair["将点配对: (x, -x) 成对处理"]
    EvenOdd["偶部: f_even(x²) = (f(x) + f(-x))/2<br/>奇部: f_odd(x²) = (f(x) - f(-x))/(2x)"]
    Fold["折叠: f\'(x²) = f_even(x²) + r·f_odd(x²)"]
    New["新多项式 f\'(y)<br/>次数 ≤ d，定义域大小 = N"]
    Repeat["重复 log₂(2N) 轮<br/>直到次数降到常数"]
    Start --> Eval
    Eval --> Merkle
    Merkle --> Challenge
    Challenge --> Pair
    Pair --> EvenOdd
    EvenOdd --> Fold
    Fold --> New
    New -->|"次数仍 > 常数"| Start
    New -.->|"完成"| Repeat'''))

conversions.append((filepath, blocks[3]['code'], '''flowchart TD
    S1["1. 编写Cairo代码 (lib.cairo)<br/>← 开发者用Cairo写业务逻辑"]
    S2["2. Sierra IR<br/>← 中间表示，确保所有程序都可证明"]
    S3["3. CASM代码<br/>← Cairo Assembly，类似低级虚拟机指令"]
    S4["4. 生成执行轨迹 (Trace)<br/>← 每一步指令后的寄存器状态快照<br/>宽度=寄存器数，高度=指令步数"]
    S5["5. AIR约束系统<br/>← 将轨迹编码为多项式，建立约束方程"]
    S6["6. FRI折叠证明<br/>← 递归折叠多项式，生成Merkle证明路径"]
    S7["7. STARK证明文件<br/>← 包含所有查询应答和Merkle路径（50-200KB）"]
    S1 -->|"编译"| S2
    S2 -->|"编译"| S3
    S3 -->|"执行"| S4
    S4 -->|"算术化"| S5
    S5 -->|"低度扩展+Merkle承诺"| S6
    S6 -->|"序列化"| S7'''))

# --- 10.astro ---
filepath = 'src/pages/zk-learning/10.astro'
_, blocks = get_code_blocks(filepath)
# Block 0 = transaction lifecycle, Block 1 = zkEVM pyramid
conversions.append((filepath, blocks[0]['code'], '''flowchart TD
    S1["步骤1: 用户在钱包签名交易"]
    S2["步骤2: 排序器接收 → 排序 → 执行 → 更新L2状态"]
    StateRoot["新状态根 (State Root)<br/>= 所有账户的Merkle树根"]
    S3["步骤3: 证明器读取交易批次 + 旧状态根 + 新状态根<br/>在ZK电路中证明:<br/>从旧状态根出发，执行这批交易后，<br/>必然得到新状态根，且每笔交易签名/余额都合法"]
    S4["步骤4: 生成有效性证明 (SNARK/STARK)"]
    S5["步骤5: 提交到L1:<br/>[证明] + [新状态根] + [blob数据]"]
    S6["步骤6: L1验证合约验证证明"]
    S6Pass["通过: 更新官方认可的状态根"]
    S6Fail["失败: 拒绝批次，保护用户资产"]
    S7["步骤7: 用户可在L2继续交易，或在桥接合约申请取款"]
    S1 --> S2
    S2 --> StateRoot
    StateRoot --> S3
    S3 --> S4
    S4 --> S5
    S5 --> S6
    S6 -->|"通过"| S6Pass
    S6 -->|"失败"| S6Fail
    S6Pass --> S7'''))

conversions.append((filepath, blocks[1]['code'], '''flowchart TD
    subgraph Spectrum["zkEVM 兼容性光谱 (Vitalik Buterin, 2022)"]
        T1["Type 1: 完全以太坊等价<br/>像素级复制——字节码、状态树、<br/>哈希函数、共识逻辑完全一致<br/>← Taiko | 最兼容 | 证明最慢(数小时)"]
        T2["Type 2: EVM等价<br/>高保真复刻——应用层完全兼容，<br/>内部改用ZK友好哈希<br/>← Scroll, Linea | 很兼容 | 证明较慢(分钟-小时)"]
        T25["Type 2.5: EVM等价，Gas成本调整<br/>微调版复刻——特定操作加gas费<br/>← Polygon zkEVM(已关闭) | 中等兼容"]
        T3["Type 3: 几乎EVM等价<br/>省略难画的细节——省略昂贵预编译<br/>合约，大多数应用可用 | 较快"]
        T4["Type 4: 高级语言等价<br/>神似重写——Solidity编译为定制VM<br/>← zkSync Era, StarkNet | 兼容性最低 | 证明最快(秒级)"]
    end
    Note["兼容性 ↑ (开发者成本越低)<br/>证明速度 ↑ (用户体验越好)"]
    T1 --> T2
    T2 --> T25
    T25 --> T3
    T3 --> T4
    Spectrum -.-> Note'''))

# --- 11.astro ---
filepath = 'src/pages/zk-learning/11.astro'
_, blocks = get_code_blocks(filepath)
# Block 0 is Tornado Cash code (skip), Block 2 is zkLogin flow
conversions.append((filepath, blocks[2]['code'], '''flowchart TD
    subgraph Flow["zkLogin 完整流程（Sui生态）"]
        User["用户 (浏览器)<br/>1. 点击 用Google登录"]
        OAuth["OAuth 提供商<br/>2. 签发 JWT<br/>3. JWT 返回"]
        Prover["ZK Prover服务<br/>(生成zk-SNARK证明)<br/>输入: JWT token<br/>输出: π（ZK证明）<br/>证明: JWT由合法发行者签发，<br/>用户确实拥有该JWT<br/>合约看不到JWT内容"]
        Sui["Sui链上（智能合约）<br/>6. 验证ZK证明: 证明有效 + issuer合法<br/>7. 合约只知道<br/>某个经Google认证的用户拥有这个Sui地址<br/>不知道具体邮箱"]
    end
    User -->|""| OAuth
    OAuth -->|""| Prover
    Prover -->|"4. 获得 Sui地址<br/>(派生自sub+salt)"| User
    User -->|"5. ZK证明 + 公开输入"| Sui
    Prover -->|""| Sui'''))

# --- 13.astro ---
filepath = 'src/pages/zk-learning/13.astro'
_, blocks = get_code_blocks(filepath)
# Block 1 = Noir workflow, Block 10 = Solidity architecture
conversions.append((filepath, blocks[1]['code'], '''flowchart TD
    NoirSrc["src/main.nr<br/>(Noir源码)"]
    Compile["nargo compile<br/>(编译电路)"]
    ACIR["target/*.json (ACIR)<br/>(电路中间表示)"]
    Witness["witness.gz<br/>(见证数据)"]
    Prove["bb prove<br/>(生成证明)"]
    Proof["proof.bin<br/>(证明输出)"]
    NoirSrc --> Compile
    Compile --> ACIR
    ACIR --> Witness
    Witness --> Prove
    Prove --> Proof'''))

conversions.append((filepath, blocks[10]['code'], '''flowchart TD
    subgraph Sepolia["以太坊测试网 (Sepolia)"]
        VC["VotingContract<br/>(业务逻辑合约)<br/>- 维护Merkle树<br/>- 记录nullifier<br/>- 调用verifier"]
        UV["UltraVerifier (Solidity)<br/>(数学验证合约)<br/>- 接收公开输入 + 证明<br/>- 调用预编译合约<br/>- 返回 true/false"]
        Precompile["bn128预编译合约<br/>(0x06, 0x07, 0x08)<br/>执行椭圆曲线配对"]
        Spent["已投nullifier映射<br/>← 防止双投 (spentNullifiers)"]
    end
    VC -->|"calls"| UV
    UV --> Precompile
    VC --> Spent'''))

# --- 14.astro ---
filepath = 'src/pages/zk-learning/14.astro'
_, blocks = get_code_blocks(filepath)
# Block 0 = recursive proof, Block 2 = resource map, Block 3 = journey panorama
conversions.append((filepath, blocks[0]['code'], '''flowchart TD
    subgraph Recursion["递归证明的结构示意"]
        B1["交易批次 1<br/>的证明 π₁"]
        B2["交易批次 2<br/>的证明 π₂"]
        BN["交易批次 N<br/>的证明 πₙ"]
        Agg["聚合证明 π_agg<br/>π₁和π₂都有效"]
        Final["最终证明 π_final<br/>π_agg和πₙ都有效<br/>+ 原始状态转换"]
        Submit["提交到以太坊 L1"]
        Note["每层验证电路 ≈ 固定大小<br/>不随交易数量增长<br/>L1 只需验证 1 个最终证明"]
    end
    B1 --> Agg
    B2 --> Agg
    BN --> Final
    Agg --> Final
    Final --> Submit
    Submit -.-> Note'''))

conversions.append((filepath, blocks[2]['code'], '''flowchart TD
    subgraph ResourceMap["ZK 持续学习资源地图"]
        Basic["基础巩固<br/>• rareskills 教程系列<br/>• Vitalik 博客系列<br/>• oboe.com ZKP指南"]
        Advanced["进阶深入<br/>• 0xPARC Learning Group<br/>• zkSecurity 审计报告<br/>• LambdaClass FRI教程"]
        Frontier["前沿探索<br/>• ZK Hack 黑客松<br/>• PSE 研究博客<br/>• a16z crypto研究"]
        Events["关键会议与活动日历<br/>• ZK Summit（欧洲/亚洲巡回）<br/>• zkDay（ETHGlobal 系列）<br/>• ZK Hack（季度）<br/>• 0xPARC ZK Learning Group"]
        Reading["推荐阅读路径<br/>入门: Vitalik How zk-SNARKs are Possible<br/>↓<br/>进阶: zkSecurity PLONK Hands-On Deep Dive<br/>↓<br/>深入: LambdaClass How to Code FRI from Scratch<br/>↓<br/>前沿: a16z Jolt 论文 / EZKL 文档"]
    end
    Basic --> Advanced
    Advanced --> Frontier
    Basic --> Events
    Advanced --> Events
    Frontier --> Events
    Events -.-> Reading'''))

conversions.append((filepath, blocks[3]['code'], '''flowchart TD
    subgraph Journey["ZK 系统学习旅程全景"]
        L1["第一层：数学根基<br/>• 有限域 F_p 的加减乘除<br/>• 群、环、域的代数结构<br/>• 椭圆曲线与离散对数难题<br/>• 多项式插值与 FFT"]
        L2["第二层：电路表达<br/>• R1CS: (A·s)*(B·s)=(C·s)<br/>• Plonkish: 表格化执行轨迹<br/>• Circom / Noir 编码<br/>• 约束优化与Lookup Tables"]
        L3["第三层：证明算法<br/>• Groth16: 最小证明 + 最快验证<br/>• PLONK: 通用设置 + 灵活电路<br/>• STARK: 无需设置 + 抗量子<br/>• PCS 选型: KZG / IPA / FRI"]
        L4["第四层：工程应用<br/>• zkRollup 扩容逻辑<br/>• Tornado Cash 隐私转账<br/>• zkLogin / zkKYC 身份验证<br/>• Noir 隐私投票 + Solidity"]
        L5["第五层：前沿展望<br/>• 递归证明: Halo2 / Nova<br/>• 硬件加速: GPU → ASIC<br/>• ZKML: EZKL / Jolt / RISC Zero<br/>• 账户抽象 + ZK 融合"]
        L6["第六层：持续进化<br/>• 0xPARC / PSE 社区<br/>• ZK Summit / 黑客松<br/>• 论文阅读与动手实验<br/>• 从学习者到贡献者"]
    end
    L1 --> L2
    L2 --> L3
    L3 --> L4
    L4 --> L5
    L5 --> L6'''))

# ============================================================
# Execute all conversions
# ============================================================
modified_files = {}
total = 0

for filepath, block_code, mermaid_text in conversions:
    ok = replace_specific_block(filepath, block_code, mermaid_text)
    if ok:
        fkey = os.path.basename(filepath)
        modified_files[fkey] = modified_files.get(fkey, 0) + 1
        total += 1
        print(f"OK: {fkey} - converted diagram #{modified_files[fkey]}")
    else:
        print(f"FAIL: {filepath}")

print("\n" + "="*60)
print("SUMMARY")
print("="*60)
for fkey in sorted(modified_files):
    print(f"  {fkey}: {modified_files[fkey]} diagram(s)")
print(f"\nTotal files modified: {len(modified_files)}")
print(f"Total diagrams converted: {total}")
