import os
import re

files = [f for f in os.listdir("packages/database") if f.endswith(".sql")]

def get_version(filename):
    if filename == "schema.sql":
        return 1
    m = re.search(r'v(\d+)', filename)
    if m:
        return int(m.group(1))
    return 999

files.sort(key=get_version)
for f in files:
    print(f)
