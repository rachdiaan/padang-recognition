"""
Convert Keras model to TensorFlow.js format
Uses SavedModel as intermediate format
"""

import tensorflow as tf
import json
import os
import shutil

MODEL_PATH = "./model/padang_food_model_optimized.keras"
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
    
    # Run conversion
    print("\n[4/4] Running tensorflowjs_converter...")

    # PATCH: Fix for numpy.object removal in newer numpy versions
    try:
        import numpy as np
        if not hasattr(np, 'object'):
            np.object = object
    except ImportError:
        pass

    import subprocess
    import sys

    # Construct command to run via the current python executable to ensure env consistency
    # We call the module directly if possible, or via shell command, but patching 'numpy'
    # only works if we run it IN-PROCESS. 
    # Since patching in-process is hard with subprocess, we will try to invoke the 
    # tensorflowjs library directly from here.
    
    try:
        from tensorflowjs.converters.converter import pip_main
        
        # Simulate command line arguments
        sys.argv = [
            "tensorflowjs_converter",
            "--input_format=tf_saved_model",
            SAVED_MODEL_PATH,
            OUTPUT_PATH
        ]
        
        print(f"   Invoking tensorflowjs internally with args: {sys.argv}")
        pip_main()
        print("   [OK] Conversion successful!")
        
    except Exception as e:
        print(f"   [WARNING] In-process conversion failed: {e}")
        print("   Attempting subprocess fallback (might fail if numpy issue persists)...")
        
        cmd = [
            "tensorflowjs_converter",
            "--input_format=tf_saved_model",
            SAVED_MODEL_PATH,
            OUTPUT_PATH
        ]
        
        try:
            result = subprocess.run(cmd, check=True, shell=(os.name == 'nt'), capture_output=True, text=True)
            print("   [OK] Conversion successful!")
            print(result.stdout)
        except subprocess.CalledProcessError as e:
            print(f"   [ERROR] Conversion failed with error code {e.returncode}")
            print("   STDOUT:", e.stdout)
            print("   STDERR:", e.stderr)
        except Exception as e:
            print(f"   [ERROR] Conversion failed: {e}")

    print("\n" + "=" * 60)
    print("Conversion Complete!")
    print("=" * 60)
    
    return model

if __name__ == '__main__':
    convert_keras_to_tfjs()
