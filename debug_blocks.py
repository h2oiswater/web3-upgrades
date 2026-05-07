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

files = ['04', '05', '06', '07', '08', '09', '10', '11', '13', '14']
for f in files:
    filepath = f'src/pages/zk-learning/{f}.astro'
    blocks = get_code_blocks(filepath)
    print(f"=== {f}.astro: {len(blocks)} code blocks ===")
    for i, b in enumerate(blocks):
        first = b.strip().split('\n')[0][:60]
        print(f"  [{i}] {first}")
    print()
