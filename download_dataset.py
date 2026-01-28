import kagglehub
import shutil
import os

# Define target local directory within the project
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
LOCAL_DATASET_DIR = os.path.join(PROJECT_DIR, "dataset", "padangfood")

# Check if local dataset already exists
if os.path.exists(LOCAL_DATASET_DIR):
    print(f"Dataset already exists at: {LOCAL_DATASET_DIR}")
    print("Skipping download/move. Delete folder manually to force update.")
    exit(0)

print(f"Downloading dataset to cache first...")
# Download latest version to cache
cache_path = kagglehub.dataset_download("faldoae/padangfood")

print(f"Cached path: {cache_path}")
print(f"Moving to local project folder: {LOCAL_DATASET_DIR}")

# Remove existing local dataset if it exists
if os.path.exists(LOCAL_DATASET_DIR):
    print("Removing existing local dataset...")
    shutil.rmtree(LOCAL_DATASET_DIR)

# Copy from cache to local project folder
shutil.copytree(cache_path, LOCAL_DATASET_DIR)

print("\n" + "="*50)
print("✅ Dataset successfully moved to project folder!")
print(f"Location: {LOCAL_DATASET_DIR}")
print("="*50)
