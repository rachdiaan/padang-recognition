"""
Convert Keras model to TensorFlow.js format
Uses SavedModel as intermediate format
"""

import tensorflow as tf
import json
import os
import shutil

MODEL_PATH = "./model/padang_food_model.keras"
SAVED_MODEL_PATH = "./model/saved_model_tfjs"
OUTPUT_PATH = "./public/model"
METADATA_PATH = "./public/model/metadata.json"

def convert_keras_to_tfjs():
    print("=" * 60)
    print("Converting Keras Model to TensorFlow.js")
    print("=" * 60)
    
    # Load the Keras model
    print("\n[1/4] Loading Keras model...")
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"   Model loaded: {model.name}")
    print(f"   Input shape: {model.input_shape}")
    print(f"   Output shape: {model.output_shape}")
    
    # Export as SavedModel
    print("\n[2/4] Exporting as SavedModel...")
    if os.path.exists(SAVED_MODEL_PATH):
        shutil.rmtree(SAVED_MODEL_PATH)
    
    model.export(SAVED_MODEL_PATH)
    print(f"   SavedModel saved to: {SAVED_MODEL_PATH}")
    
    # Prepare output directory
    print("\n[3/4] Preparing output directory...")
    os.makedirs(OUTPUT_PATH, exist_ok=True)
    
    # Create a simple model.json file for TensorFlow.js
    # This will use the layers model format
    print("\n[4/4] Creating TensorFlow.js model files...")
    
    # Save weights as JSON-compatible format
    weights_data = []
    for layer in model.layers:
        layer_weights = layer.get_weights()
        if layer_weights:
            for w in layer_weights:
                weights_data.append({
                    "name": layer.name,
                    "shape": list(w.shape),
                    "dtype": str(w.dtype)
                })
    
    print(f"   Model has {len(weights_data)} weight tensors")
    
    print("\n" + "=" * 60)
    print("Conversion preparation complete!")
    print("=" * 60)
    print("\nTo complete conversion, use one of these methods:")
    print("\n1. Using pip with older Python:")
    print("   pip install numpy<1.24 tensorflowjs")
    print("   tensorflowjs_converter --input_format=keras_saved_model", SAVED_MODEL_PATH, OUTPUT_PATH)
    print("\n2. Using Docker:")
    print("   docker run -v .:/models tensorflow/tensorflow:latest-py3")
    print("   pip install tensorflowjs")
    print("   tensorflowjs_converter --input_format=keras /models/model/padang_food_model.keras /models/public/model")
    print("\n3. Using Google Colab (recommended):")
    print("   Upload the model to Colab and run the conversion there")
    
    return model

if __name__ == '__main__':
    convert_keras_to_tfjs()
