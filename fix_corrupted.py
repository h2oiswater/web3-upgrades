import os
import re

def find_and_fix_blocks(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Find mermaid blocks that have leftover ASCII art after </pre> inside the same code block
    # Pattern: <pre class="mermaid">...</pre> followed by lines with │ or └ ending with </code></pre>
    pattern = r'(<pre class="mermaid">(?:.*?)</pre>)([\s\S]*?)(</code></pre>)'
    matches = list(re.finditer(pattern, content, re.DOTALL))
    
    fixed_count = 0
    for m in matches:
        between = m.group(2)
        # If there's leftover ASCII art between </pre> and </code></pre>
        if '│' in between or '└' in between or '┌' in between:
            old = m.group(0)
            new = m.group(1)  # Just keep the mermaid block
            content = content.replace(old, new, 1)
            fixed_count += 1
            print(f"  Fixed corrupted block in {os.path.basename(filepath)}")
    
    if fixed_count > 0:
        with open(filepath, 'w') as f:
            f.write(content)
    return fixed_count

# Also find mermaid blocks with </code></pre> right after (mermaid inside code block)
def fix_mermaid_in_code(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Pattern: <pre class="code-block"><code><pre class="mermaid">...</pre></code></pre>
    pattern = r'<pre class="code-block"><code>(<pre class="mermaid">(?:.*?)</pre>)</code></pre>'
    matches = list(re.finditer(pattern, content, re.DOTALL))
    
    fixed_count = 0
    for m in matches:
        old = m.group(0)
        new = m.group(1)
        content = content.replace(old, new, 1)
        fixed_count += 1
        print(f"  Fixed nested mermaid in code-block in {os.path.basename(filepath)}")
    
    if fixed_count > 0:
        with open(filepath, 'w') as f:
            f.write(content)
    return fixed_count

files = ['02', '04', '05', '06', '07', '08', '09', '10', '11', '13', '14']
total_fixed = 0
for f in files:
    filepath = f'src/pages/zk-learning/{f}.astro'
    total_fixed += find_and_fix_blocks(filepath)
    total_fixed += fix_mermaid_in_code(filepath)

print(f"\nTotal corrupted blocks fixed: {total_fixed}")
