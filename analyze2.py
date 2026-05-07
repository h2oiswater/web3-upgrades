import os
import re

def is_flowchart(content):
    """Check if code block content is a flowchart-style ASCII diagram."""
    lines = content.strip().split('\n')
    has_boxes = any('┌' in l or '└' in l or '│' in l for l in lines)
    has_arrows = any('→' in l or '↓' in l or '▶' in l or '◀' in l or '-->' in l for l in lines)
    has_connections = any('│' in l and ('▶' in l or '◀' in l or '→' in l or '↓' in l) for l in lines)
    
    if has_boxes and (has_arrows or has_connections):
        return True
    
    step_arrows = sum(1 for l in lines if ('步骤' in l or 'Step' in l) and ('→' in l or '↓' in l or '│' in l))
    if step_arrows >= 2:
        return True
    
    process_flow = sum(1 for l in lines if '▶' in l or '──▶' in l or '──►' in l)
    if process_flow >= 2 and has_boxes:
        return True
    
    return False

def analyze_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    pattern = r'<pre class="(mermaid|code-block)">(?:\n?<code>)?(.*?)(?:</code>\n?)?</pre>'
    matches = list(re.finditer(pattern, content, re.DOTALL))
    
    results = []
    for i, m in enumerate(matches):
        block_type = m.group(1)
        block_content = m.group(2)
        is_fc = block_type == 'code-block' and is_flowchart(block_content)
        results.append({
            'index': i,
            'type': block_type,
            'first_line': block_content.strip().split('\n')[0][:80],
            'is_flowchart': is_fc,
            'content': block_content
        })
    return results

files = ['02', '04', '05', '06', '07', '08', '09', '10', '11', '13', '14']
for f in files:
    filepath = f'src/pages/zk-learning/{f}.astro'
    results = analyze_file(filepath)
    flowcharts = [r for r in results if r['is_flowchart']]
    if flowcharts:
        print(f"\n=== {f}.astro ({len(flowcharts)} flowcharts) ===")
        for r in flowcharts:
            print(f"  [{r['index']}] {r['first_line']}")
