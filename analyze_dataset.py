import os


dataset_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dataset", "train")
if not os.path.exists(dataset_path):
    dataset_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dataset", "padangfood")

print(f"Analyzing dataset at: {dataset_path}")

if not os.path.exists(dataset_path):
    print("Dataset path not found!")
    exit(1)

class_counts = {}
total_images = 0

for class_name in os.listdir(dataset_path):
    class_dir = os.path.join(dataset_path, class_name)
    if os.path.isdir(class_dir):
        count = len([f for f in os.listdir(class_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))])
        class_counts[class_name] = count
        total_images += count

print(f"\nTotal Images: {total_images}")
print("\nClass Distribution:")
print("-" * 30)
for cls, count in sorted(class_counts.items(), key=lambda x: x[1], reverse=True):
    percentage = (count / total_images) * 100
    print(f"{cls:<20}: {count:>3} ({percentage:.1f}%)")
print("-" * 30)

# Check for imbalance
counts = list(class_counts.values())
min_count = min(counts)
max_count = max(counts)
ratio = max_count / min_count

print(f"\nImbalance Ratio (Max/Min): {ratio:.2f}")
if ratio > 1.5:
    print("WARNING: Dataset is imbalanced. Class weights recommended.")
else:
    print("Dataset is relatively balanced.")
