import kagglehub
import shutil
import os
import time

# Define target local directory within the project
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
# We will verify what's inside cache and copy the 'dataset_padang_food' content directly to 'dataset/train'
TARGET_DIR = os.path.join(PROJECT_DIR, "dataset", "train")

# Check if local dataset already exists and is not empty
if os.path.exists(TARGET_DIR) and len(os.listdir(TARGET_DIR)) > 0:
    print(f"Dataset already exists at: {TARGET_DIR}")
    # Force check emptiness of a subfolder
    subfolders = [f.path for f in os.scandir(TARGET_DIR) if f.is_dir()]
    if subfolders and len(os.listdir(subfolders[0])) > 0:
        print("Dataset verification passed. Skipping download.")
        exit(0)
    else:
        print("Dataset seems empty/corrupted. Re-downloading...")
        shutil.rmtree(TARGET_DIR, ignore_errors=True)

print(f"Downloading dataset to cache first...")
# Download latest version to cache
cache_path = kagglehub.dataset_download("faldoae/padangfood")
print(f"Cached path: {cache_path}")

# Identify the actual data folder
# Usually cache_path/dataset_padang_food
source_data_path = os.path.join(cache_path, "dataset_padang_food")
if not os.path.exists(source_data_path):
    print(f"Warning: Expected subfolder 'dataset_padang_food' not found. Using root cache path.")
    source_data_path = cache_path

print(f"Source data path: {source_data_path}")
print(f"Target local path: {TARGET_DIR}")

# Copy
print("Copying files... (This may take a moment)")
try:
    if os.path.exists(TARGET_DIR):
        shutil.rmtree(TARGET_DIR)
    shutil.copytree(source_data_path, TARGET_DIR)
    print("✅ Copy complete!")
except Exception as e:
    print(f"Error copying files: {e}")
    # Fallback: Try system copy command if python fails (permissions)
    print("Trying system fallback copy...")
    os.makedirs(TARGET_DIR, exist_ok=True)
    import subprocess
    subprocess.run(f'xcopy /E /I /Y "{source_data_path}" "{TARGET_DIR}"', shell=True)

print(f"\nLocation: {TARGET_DIR}")

