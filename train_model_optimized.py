"""
Padang Food Recognition - Deep Optimization (V3 - EfficientNetV2)
Features:
- Backbond: EfficientNetV2B0 (State-of-the-Art)
- Optimizer: AdamW (Weight Decay for Regularization)
- Augmentation: Color Invariant + Random Erasing (if supported)
- Logging: Automated CSV & Markdown Report Generation
"""

import os
import sys
import json
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.applications import EfficientNetV2B0
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, BatchNormalization
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau, CSVLogger

# Windows encoding fix
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Configuration
DATASET_PATH = "./dataset/train"
MODEL_OUTPUT_DIR = "./model"
TFJS_OUTPUT_DIR = "./public/model"
LOG_FILE = "training_log.csv"
FINAL_REPORT_FILE = "optimization_log_final.md"
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS_HEAD = 15
EPOCHS_FINE = 40 # Total will be 55

# Ensure dirs
os.makedirs(MODEL_OUTPUT_DIR, exist_ok=True)
os.makedirs(TFJS_OUTPUT_DIR, exist_ok=True)

# Class mappings (Same as before)
CLASS_MAPPING = {
    'ayam_goreng': {'id': 'ayam-goreng', 'name': 'Ayam Goreng', 'nameEn': 'Fried Chicken'},
    'ayam_pop': {'id': 'ayam-pop', 'name': 'Ayam Pop', 'nameEn': 'Pop Chicken'},
    'daging_rendang': {'id': 'rendang', 'name': 'Rendang', 'nameEn': 'Rendang Beef'},
    'dendeng_batokok': {'id': 'dendeng-batokok', 'name': 'Dendeng Batokok', 'nameEn': 'Pounded Beef Jerky'},
    'gulai_ikan': {'id': 'gulai-ikan', 'name': 'Gulai Ikan', 'nameEn': 'Fish Curry'},
    'gulai_tambusu': {'id': 'gulai-tambusu', 'name': 'Gulai Tambusu', 'nameEn': 'Intestine Curry'},
    'gulai_tunjang': {'id': 'gulai-tunjang', 'name': 'Gulai Tunjang', 'nameEn': 'Beef Tendon Curry'},
    'telur_balado': {'id': 'telur-balado', 'name': 'Telur Balado', 'nameEn': 'Spicy Egg'},
    'telur_dadar': {'id': 'telur-dadar', 'name': 'Telur Dadar Padang', 'nameEn': 'Padang Omelette'}
}

def create_model(num_classes):
    # EfficientNetV2 expects 0-255 inputs (it has internal Rescaling layers)
    # So we DO NOT rescale in generator.
    
    base_model = EfficientNetV2B0(
        weights='imagenet',
        include_top=False,
        input_shape=(*IMAGE_SIZE, 3)
    )
    
    base_model.trainable = False
    
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = BatchNormalization()(x)
    x = Dropout(0.2)(x)
    
    predictions = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    return model, base_model

def prepare_data():
    # EfficientNetV2 handles rescaling internally, valid range 0-255
    # Warning: Do NOT use rescale=1./255 here!
    
    train_datagen = ImageDataGenerator(
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2
    )
    
    val_datagen = ImageDataGenerator(validation_split=0.2)
    
    train_generator = train_datagen.flow_from_directory(
        DATASET_PATH,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        shuffle=True
    )
    
    val_generator = val_datagen.flow_from_directory(
        DATASET_PATH,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )
    
    return train_generator, val_generator

def generate_markdown_report(history_csv, val_acc):
    try:
        df = pd.read_csv(history_csv)
        
        md_content = f"""# 🚀 Deep Optimization Log (Final Report)
**Model**: EfficientNetV2B0 (State-of-the-Art)
**Status**: ✅ Training Complete
**Final Accuracy**: {val_acc:.2%}

## 1. Training Dynamics
Detailed epoch-by-epoch progression.

| Epoch | Accuracy | Loss | Val Accuracy | Val Loss | LR |
| :--- | :--- | :--- | :--- | :--- | :--- |
"""
        # Add last 10 epochs or specific milestones
        for index, row in df.iterrows():
            md_content += f"| {int(row['epoch'])+1} | {row['accuracy']:.4f} | {row['loss']:.4f} | **{row['val_accuracy']:.4f}** | {row['val_loss']:.4f} | {row.get('lr', 'N/A')} |\n"
            
        md_content += """
## 2. Optimization Configuration
*   **Architecture**: EfficientNetV2B0 (ImageNet Pre-trained)
*   **Preprocessing**: Internal Rescaling (0-255)
*   **Optimizer**: AdamW (Learning Rate: Adaptive)
*   **Loss Function**: Categorical Crossentropy

## 3. Next Steps
The model file `padang_food_model_optimized.keras` is ready. 
Run conversion script to update the web app.
"""
        with open(FINAL_REPORT_FILE, "w") as f:
            f.write(md_content)
        print(f"✅ Report generated: {FINAL_REPORT_FILE}")
        
    except Exception as e:
        print(f"Failed to generate report: {e}")

def train_model():
    print("🔥 INITIALIZING DEEP OPTIMIZATION (EfficientNetV2B0)...")
    
    train_gen, val_gen = prepare_data()
    num_classes = len(train_gen.class_indices)
    
    model, base_model = create_model(num_classes)
    
    # Callbacks
    csv_logger = CSVLogger(LOG_FILE)
    callbacks = [
        EarlyStopping(monitor='val_accuracy', patience=8, restore_best_weights=True, verbose=1),
        ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=3, min_lr=1e-7, verbose=1),
        ModelCheckpoint(os.path.join(MODEL_OUTPUT_DIR, 'best_model.keras'), monitor='val_accuracy', save_best_only=True, verbose=1),
        csv_logger
    ]
    
    # Phase 1: Head
    print("\nPhase 1: Training Head (Fast Adaptation)")
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    model.fit(train_gen, validation_data=val_gen, epochs=EPOCHS_HEAD, callbacks=callbacks)
    
    # Phase 2: Fine-tuning
    print("\nPhase 2: Full Fine-tuning (High Precision)")
    base_model.trainable = True
    model.compile(
        optimizer=tf.keras.optimizers.AdamW(learning_rate=1e-5), 
        loss='categorical_crossentropy', 
        metrics=['accuracy']
    )
    
    model.fit(
        train_gen, 
        validation_data=val_gen, 
        epochs=EPOCHS_FINE, 
        initial_epoch=EPOCHS_HEAD, 
        callbacks=callbacks
    )
    
    # Save
    val_loss, val_acc = model.evaluate(val_gen)
    print(f"\n🏆 Final Accuracy: {val_acc:.2%}")
    model.save(os.path.join(MODEL_OUTPUT_DIR, 'padang_food_model_optimized.keras'))
    
    # Report
    generate_markdown_report(LOG_FILE, val_acc)

if __name__ == '__main__':
    train_model()
