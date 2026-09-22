import re

files = [
    r"c:\Users\Patrice.DESKTOP-I932PON\Dev\saas-ai-starter\backend\app\api\v1\endpoints\occupations.py",
    r"c:\Users\Patrice.DESKTOP-I932PON\Dev\saas-ai-starter\backend\app\api\v1\endpoints\public_occupations.py",
    r"c:\Users\Patrice.DESKTOP-I932PON\Dev\saas-ai-starter\backend\app\api\v1\endpoints\ckg.py",
    r"c:\Users\Patrice.DESKTOP-I932PON\Dev\saas-ai-starter\backend\app\services\hybrid_rag_service.py"
]

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We replace coalesce(var.label_fr, var.label, var.name) -> coalesce(var.label_fr, var.label, var.name, var.description) 
    new_content = re.sub(r'coalesce\(([a-zA-Z_0-9]+)\.label_fr, \1\.label, \1\.name\)', r'coalesce(\1.label_fr, \1.label, \1.name, \1.description)', content)
    
    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {file_path}")
    else:
        print(f"No changes in {file_path}")
