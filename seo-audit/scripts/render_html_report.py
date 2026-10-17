#!/usr/bin/env python3
"""
render_html_report.py — Generates a beautifully formatted standalone HTML report.
"""

import re
from pathlib import Path

PROJECT_ROOT = Path("/Users/surya/Desktop/Academic Wizard Latest.")
MD_FILE = PROJECT_ROOT / "seo-audit" / "FINAL_SEO_AUDIT_REPORT.md"
HTML_FILE = PROJECT_ROOT / "seo-audit" / "FINAL_SEO_AUDIT_REPORT.html"

def main():
    md_text = MD_FILE.read_text(encoding="utf-8")
    lines = md_text.split("\n")
    html_lines = []
    in_code = False
    in_table = False

    for line in lines:
        if line.startswith("```"):
            if in_code:
                html_lines.append("</code></pre>")
                in_code = False
            else:
                lang = line[3:].strip()
                html_lines.append(f'<pre><code class="language-{lang}">')
                in_code = True
            continue
        if in_code:
            escaped = line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            html_lines.append(escaped)
            continue

        # Tables
        if line.strip().startswith("|") and line.strip().endswith("|"):
            parts = [p.strip() for p in line.strip().split("|")[1:-1]]
            if all(set(p).issubset({"-", ":", " "}) for p in parts if p):
                continue # separator
            if not in_table:
                html_lines.append("<table><thead><tr>" + "".join(f"<th>{p}</th>" for p in parts) + "</tr></thead><tbody>")
                in_table = True
            else:
                html_lines.append("<tr>" + "".join(f"<td>{p}</td>" for p in parts) + "</tr>")
            continue
        else:
            if in_table:
                html_lines.append("</tbody></table>")
                in_table = False

        if line.startswith("# "):
            html_lines.append(f"<h1>{line[2:]}</h1>")
        elif line.startswith("## "):
            html_lines.append(f"<h2>{line[3:]}</h2>")
        elif line.startswith("### "):
            html_lines.append(f"<h3>{line[4:]}</h3>")
        elif line.startswith("---"):
            html_lines.append("<hr>")
        elif line.strip():
            p = line
            p = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", p)
            p = re.sub(r"`(.+?)`", r"<code>\1</code>", p)
            p = re.sub(r"\[(.+?)\]\((.+?)\)", r'<a href="\2">\1</a>', p)
            html_lines.append(f"<p>{p}</p>")

    if in_table:
        html_lines.append("</tbody></table>")
    if in_code:
        html_lines.append("</code></pre>")

    body_content = "\n".join(html_lines)

    html_full = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Academic Wizard — Principal Technical SEO Audit Report</title>
<style>
body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 1080px; margin: 40px auto; padding: 0 24px; color: #1e293b; background: #f8fafc; }}
h1 {{ color: #0f172a; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; font-size: 2rem; }}
h2 {{ color: #1e293b; margin-top: 36px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; font-size: 1.4rem; }}
h3 {{ color: #334155; font-size: 1.15rem; margin-top: 24px; }}
table {{ border-collapse: collapse; width: 100%; margin: 24px 0; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-size: 0.92rem; }}
th, td {{ padding: 10px 14px; text-align: left; border-bottom: 1px solid #e2e8f0; }}
th {{ background: #f1f5f9; font-weight: 600; color: #334155; }}
tr:hover {{ background: #f8fafc; }}
code {{ background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; font-family: ui-monospace, Menlo, Monaco, monospace; }}
pre {{ background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: ui-monospace, Menlo, Monaco, monospace; font-size: 0.88rem; }}
pre code {{ background: none; color: inherit; padding: 0; }}
hr {{ border: none; border-top: 1px solid #e2e8f0; margin: 32px 0; }}
a {{ color: #2563eb; text-decoration: none; }}
a:hover {{ text-decoration: underline; }}
</style>
</head>
<body>
{body_content}
</body>
</html>"""

    HTML_FILE.write_text(html_full, encoding="utf-8")
    print(f"Successfully generated {HTML_FILE}")

if __name__ == "__main__":
    main()
