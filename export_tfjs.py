"""
Manual TensorFlow.js Model Export
Creates model.json and weight binary files compatible with TensorFlow.js
"""

import tensorflow as tf
import json
import os
import struct
import numpy as np

MODEL_PATH = "./model/padang_food_model.keras"
OUTPUT_PATH = "./public/model"

def export_to_tfjs():
    print("=" * 60)
    print("Manual TensorFlow.js Export")
    print("=" * 60)
    
    # Load model
    print("\n[1/5] Loading Keras model...")
    model = tf.keras.models.load_model(MODEL_PATH)
    
    # Create output directory
    os.makedirs(OUTPUT_PATH, exist_ok=True)
    
    # Get model config
    print("\n[2/5] Extracting model configuration...")
    model_config = model.get_config()
    
    # Collect weights info
    print("\n[3/5] Processing weights...")
    weights_manifest = []
    weight_specs = []
    all_weights = []
    
    total_bytes = 0
    for layer in model.layers:
        layer_weights = layer.get_weights()
        if not layer_weights:
            continue
            
        for i, w in enumerate(layer_weights):
            weight_name = f"{layer.name}/{['kernel', 'bias', 'gamma', 'beta', 'moving_mean', 'moving_variance'][i % 6]}"
            
            # Convert to float32
            w_float32 = w.astype(np.float32)
            
            weight_specs.append({
                "name": weight_name,
                "shape": list(w.shape),
                "dtype": "float32"
            })
            
            all_weights.append(w_float32)
            total_bytes += w_float32.nbytes
    
    print(f"   Total weights: {len(weight_specs)}")
    print(f"   Total size: {total_bytes / 1024 / 1024:.2f} MB")
    
    # Save weights to binary file
    print("\n[4/5] Saving weight binaries...")
    weights_path = os.path.join(OUTPUT_PATH, "group1-shard1of1.bin")
    
    with open(weights_path, 'wb') as f:
        for w in all_weights:
            f.write(w.tobytes())
    
    print(f"   Saved: {weights_path}")
    
    # Create model.json
    print("\n[5/5] Creating model.json...")
    
    # Build the model topology for TensorFlow.js
    model_json = {
        "format": "layers-model",
        "generatedBy": "manual-export-1.0",
        "convertedBy": "padang-recognition-trainer",
        "modelTopology": {
            "keras_version": "3.0",
            "backend": "tensorflow",
            "model_config": {
                "class_name": "Functional",
                "config": {
                    "name": "padang_food_model",
                    "trainable": True,
                    "input_layers": [["input_layer", 0, 0]],
                    "output_layers": [["dense_2", 0, 0]]
                }
            }
        },
        "weightsManifest": [{
            "paths": ["group1-shard1of1.bin"],
            "weights": weight_specs
        }]
    }
    
    model_json_path = os.path.join(OUTPUT_PATH, "model.json")
    with open(model_json_path, 'w') as f:
        json.dump(model_json, f, indent=2)
    
    print(f"   Saved: {model_json_path}")
    
    print("\n" + "=" * 60)
    print("Export complete!")
    print("=" * 60)
    print(f"\nFiles created:")
    print(f"   - {model_json_path}")
    print(f"   - {weights_path}")
    
    return True

if __name__ == '__main__':
    export_to_tfjs()
