"""
Manual TensorFlow.js Model Converter
Converts Keras model to TF.js format without using tensorflowjs library
"""
import os
import sys
import json
import struct
import numpy as np

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def convert_keras_to_tfjs():
    print("=" * 60)
    print("MANUAL TENSORFLOW.JS MODEL CONVERTER")
    print("=" * 60)
    
    try:
        import tensorflow as tf
        print(f"TensorFlow version: {tf.__version__}")
    except ImportError:
        print("ERROR: TensorFlow not installed")
        return False
    
    # Paths
    keras_model_path = "model/best_model.keras"  # Use best model (smaller)
    output_dir = "public/model"
    
    # Check if model exists
    if not os.path.exists(keras_model_path):
        keras_model_path = "model/padang_food_model.keras"
    
    if not os.path.exists(keras_model_path):
        print(f"ERROR: No model found!")
        return False
    
    print(f"Loading model: {keras_model_path}")
    
    # Load model
    model = tf.keras.models.load_model(keras_model_path)
    print(f"Model loaded successfully!")
    print(f"Input shape: {model.input_shape}")
    print(f"Output shape: {model.output_shape}")
    
    # Get model architecture as JSON
    model_config = model.get_config()
    
    # Get weights
    weights = model.get_weights()
    print(f"Number of weight arrays: {len(weights)}")
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Build TF.js model topology
    layer_specs = []
    weight_specs = []
    weight_data = []
    
    for i, layer in enumerate(model.layers):
        layer_config = layer.get_config()
        layer_weights = layer.get_weights()
        
        if len(layer_weights) > 0:
            for j, w in enumerate(layer_weights):
                weight_name = f"{layer.name}/kernel" if j == 0 else f"{layer.name}/bias"
                weight_specs.append({
                    "name": weight_name,
                    "shape": list(w.shape),
                    "dtype": "float32"
                })
                # Flatten and append
                weight_data.append(w.astype(np.float32).tobytes())
    
    # Concatenate all weight data
    all_weights = b''.join(weight_data)
    
    # Save weights as binary
    weights_path = os.path.join(output_dir, "group1-shard1of1.bin")
    with open(weights_path, 'wb') as f:
        f.write(all_weights)
    print(f"Weights saved: {weights_path} ({len(all_weights)} bytes)")
    
    # Create model.json (TF.js Layers Model format)
    model_json = {
        "format": "layers-model",
        "generatedBy": "keras v" + tf.keras.__version__,
        "convertedBy": "Manual Converter for Padang Recognition",
        "modelTopology": {
            "keras_version": tf.keras.__version__,
            "backend": "tensorflow",
            "model_config": {
                "class_name": model.__class__.__name__,
                "config": model_config
            }
        },
        "weightsManifest": [{
            "paths": ["group1-shard1of1.bin"],
            "weights": weight_specs
        }]
    }
    
    # Save model.json
    model_json_path = os.path.join(output_dir, "model.json")
    with open(model_json_path, 'w') as f:
        json.dump(model_json, f, indent=2)
    print(f"Model JSON saved: {model_json_path}")
    
    # Update metadata
    metadata_path = os.path.join(output_dir, "metadata.json")
    if os.path.exists(metadata_path):
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        metadata['modelFormat'] = 'tfjs-layers-model'
        metadata['modelFile'] = 'model.json'
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        print(f"Metadata updated: {metadata_path}")
    
    print("\n" + "=" * 60)
    print("CONVERSION COMPLETE!")
    print("=" * 60)
    print(f"Output files in: {output_dir}")
    print("  - model.json")
    print("  - group1-shard1of1.bin")
    print("  - metadata.json")
    
    return True

if __name__ == "__main__":
    success = convert_keras_to_tfjs()
    sys.exit(0 if success else 1)
