import os
import sys

# Force script to run from its own directory
os.chdir(os.path.dirname(os.path.abspath(sys.argv[0])))

def convert_to_js_structure(name, filenames):
    quoted_filenames = [f'"{name}"' for name in filenames]
    return f"const {name} = [{','.join(quoted_filenames)}];\n"

def get_all_files_with_ext(root_dir=".", extensions=(".jpg", ".png")):
    found_files = {ext: [] for ext in extensions}
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            for ext in extensions:
                if filename.lower().endswith(ext):
                    rel_path = os.path.relpath(os.path.join(dirpath, filename), root_dir).replace("\\", "/")
                    found_files[ext].append(f"{rel_path}")
    return found_files

files = get_all_files_with_ext()

output_parts = []

if files[".jpg"]:
    output_parts.append(convert_to_js_structure("cards", files[".jpg"]))
if files[".png"]:
    output_parts.append(convert_to_js_structure("coins", files[".png"]))

# Combine and save
output = "\n".join(output_parts)
with open("list.txt", "w", encoding="utf-8") as f:
    f.write(output)

print(output)