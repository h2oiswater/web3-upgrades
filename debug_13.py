import os

def get_code_blocks(filepath):
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
        code_text = content[code_start+6:code_end]
        blocks.append(code_text)
        idx = pre_end + 6
    return blocks

# Check 13.astro blocks 8, 9, 10
filepath = 'src/pages/zk-learning/13.astro'
blocks = get_code_blocks(filepath)
for i in [8, 9, 10]:
    if i < len(blocks):
        print(f"=== Block {i} ===")
        print(blocks[i][:300])
        print("...")
        print()
