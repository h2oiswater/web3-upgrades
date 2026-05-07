import os
import re

def analyze_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Find all pre blocks (both mermaid and code-block)
    pattern = r'<pre class="(mermaid|code-block)">(?:\n?<code>)?(.*?)(?:</code>\n?)?</pre>'
    matches = list(re.finditer(pattern, content, re.DOTALL))
    
    results = []
    for m in matches:
        block_type = m.group(1)
        block_content = m.group(2)
        first_lines = block_content.strip().split('\n')[:3]
        is_flowchart = any('┌' in line or '└' in line or '│' in line or '→' in line or '↓' in line or '▶' in line for line in first_lines)
        results.append({
            'type': block_type,
            'start': m.start(),
            'end': m.end(),
            'first_line': first_lines[0][:80],
            'is_flowchart': is_flowchart,
            'content': block_content
        })
    return results

files = ['02', '04', '05', '06', '07', '08', '09', '10', '11', '13', '14']
for f in files:
    filepath = f'src/pages/zk-learning/{f}.astro'
    results = analyze_file(filepath)
    print(f"\n=== {f}.astro ===")
    for i, r in enumerate(results):
        marker = "FLOWCHART" if r['is_flowchart'] and r['type'] == 'code-block' else ""
        print(f"  [{i}] {r['type']:12s} | {marker:10s} | {r['first_line']}")
