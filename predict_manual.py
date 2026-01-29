
import sys
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

# Suppress TF logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Image path from args
if len(sys.argv) < 2:
    print("Usage: python predict_manual.py <image_path>")
    sys.exit(1)

IMG_PATH = sys.argv[1]

# Model Path
MODEL_PATH = "./model/padang_food_model_optimized.keras"

# Classes (Alphabetical order from dataset)
CLASSES = [
    'ayam_goreng', 'ayam_pop', 'daging_rendang', 'dendeng_batokok',
    'gulai_ikan', 'gulai_tambusu', 'gulai_tunjang', 'telur_balado', 'telur_dadar'
]

CLASS_NAMES = {
    'ayam_goreng': 'Ayam Goreng',
    'ayam_pop': 'Ayam Pop',
    'daging_rendang': 'Rendang',
    'dendeng_batokok': 'Dendeng Batokok',
    'gulai_ikan': 'Gulai Ikan',
    'gulai_tambusu': 'Gulai Tambusu',
    'gulai_tunjang': 'Gulai Tunjang',
    'telur_balado': 'Telur Balado',
    'telur_dadar': 'Telur Dadar'
}

def predict():
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Model not found at {MODEL_PATH}")
        return

    print(f"Loading model from {MODEL_PATH}...")
    try:
        model = load_model(MODEL_PATH)
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    print(f"Processing image: {IMG_PATH}")
    try:
        # Load and resize
        # EfficientNetV2 expects inputs in range [0, 255]
        img = load_img(IMG_PATH, target_size=(224, 224))
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) # Add batch dimension
        
        # Predict
        predictions = model.predict(img_array, verbose=0)
        
        # Get top 3
        top_indices = predictions[0].argsort()[-3:][::-1]
        
        print("\n--- Prediction Results ---")
        for i in top_indices:
            cls = CLASSES[i]
            conf = predictions[0][i]
            print(f"{CLASS_NAMES[cls]}: {conf:.2%}")
            
    except Exception as e:
        print(f"Error during prediction: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    predict()
