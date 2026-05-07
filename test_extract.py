import re
import os

def get_exact_blocks(filepath):
    """Extract all code-block and mermaid blocks with their exact raw text."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    pattern = r'(<pre class="(?:code-block|mermaid)">\n?<code>)?(.*?)(</code>\n?</pre>)'
    # Actually, let's use a simpler approach - find all pre blocks
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

def replace_block_in_file(filepath, block_code, mermaid_text):
    """Replace a specific code block with mermaid."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    old = f'<pre class="code-block"><code>{block_code}</code></pre>'
    new = f'<pre class="mermaid">\n{mermaid_text}\n</pre>'
    
    if old not in content:
        print(f"  ERROR: Block not found in {filepath}")
        print(f"  Searching for: {old[:100]}...")
        return False
    
    content = content.replace(old, new, 1)
    with open(filepath, 'w') as f:
        f.write(content)
    return True

# Process 04.astro
filepath = 'src/pages/zk-learning/04.astro'
content, blocks = get_exact_blocks(filepath)
print(f"04.astro has {len(blocks)} code blocks")
for i, b in enumerate(blocks):
    print(f"  Block {i}: first line = {b['code'][:60].replace(chr(10), '\\n')}")

# Block 2 = 三群结构, Block 3 = Miller算法
# Let's print their exact code content
print("\n--- Block 2 exact ---")
print(repr(blocks[2]['code'][:200]))
print("\n--- Block 3 exact ---")
print(repr(blocks[3]['code'][:200]))
