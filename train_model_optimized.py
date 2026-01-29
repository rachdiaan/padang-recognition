"""
Padang Food Recognition - Optimized Model Training (V2)
Features:
- Advanced Data Augmentation
- Deep Fine-tuning
- Label Smoothing
- AdamW Optimizer
- Mixed Precision (if available)
"""

import os
import sys

# Windows encoding fix
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, BatchNormalization
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
import json
import numpy as np

# Configuration
DATASET_PATH = "./dataset/train"
if not os.path.exists(DATASET_PATH):
    # Fallback to check if user ran old script
    DATASET_PATH = "./dataset/padangfood/dataset_padang_food"
MODEL_OUTPUT_DIR = "./model"
TFJS_OUTPUT_DIR = "./public/model"
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS_HEAD = 20 # Increased from 15
EPOCHS_FINE = 60 # Increased from 40

# Class mappings
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
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(*IMAGE_SIZE, 3)
    )
    
    # Originally frozen
    base_model.trainable = False
    
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    
    # Enhanced Head Architecture
    x = BatchNormalization()(x)
    x = Dense(512, activation='relu')(x) # Increased capacity
    x = Dropout(0.5)(x)
    x = BatchNormalization()(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.3)(x)
    
    predictions = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    return model, base_model

def prepare_data():
    # Advanced Augmentation - Optimized for Color Invariance (Red/Green Chili handling)
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=45,
        width_shift_range=0.25,
        height_shift_range=0.25,
        shear_range=0.25,
        zoom_range=0.35,
        brightness_range=[0.6, 1.4], # Wider brightness to handle lighting
        channel_shift_range=40.0,    # High shift to reduce color bias (Green vs Red chili)
        horizontal_flip=True,
        vertical_flip=False,         # Food usually has gravity
        fill_mode='nearest',
        validation_split=0.2
    )
    
    val_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)
    
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

def train_model():
    print("🚀 STARTING OPTIMIZED TRAINING (V3 - Color Invariant)...")
    
    train_gen, val_gen = prepare_data()
    num_classes = len(train_gen.class_indices)
    
    model, base_model = create_model(num_classes)
    
    # 1. Train Classification Head
    print("\nPhase 1: Training Head (AdamW + Label Smoothing)")
    model.compile(
        optimizer=tf.keras.optimizers.AdamW(learning_rate=0.001, weight_decay=1e-4),
        loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.15), # Increased smoothing
        metrics=['accuracy']
    )
    
    callbacks = [
        EarlyStopping(monitor='val_accuracy', patience=10, restore_best_weights=True, verbose=1),
        ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=4, min_lr=1e-7, verbose=1),
        ModelCheckpoint(os.path.join(MODEL_OUTPUT_DIR, 'best_model.keras'), monitor='val_accuracy', save_best_only=True, verbose=1)
    ]
    
    model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS_HEAD,
        callbacks=callbacks
    )
    
    # 2. Deep Fine-tuning
    print("\nPhase 2: Deep Fine-tuning (Unfreezing last 80 layers)")
    base_model.trainable = True
    
    # Unfreeze deeper
    for layer in base_model.layers[:-80]: 
        layer.trainable = False
        
    model.compile(
        optimizer=tf.keras.optimizers.AdamW(learning_rate=3e-5, weight_decay=1e-5), # Slower learning
        loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.15),
        metrics=['accuracy']
    )
    
    model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS_FINE,
        initial_epoch=EPOCHS_HEAD,
        callbacks=callbacks
    )
    
    # 3. Save & Metadata
    val_loss, val_acc = model.evaluate(val_gen)
    print(f"\n🏆 Final Optimized Accuracy: {val_acc:.2%}")
    
    model.save(os.path.join(MODEL_OUTPUT_DIR, 'padang_food_model_optimized.keras'))
    
    # Generate Metadata
    metadata = {
        'classes': [],
        'classIndices': train_gen.class_indices,
        'imageSize': IMAGE_SIZE[0],
        'modelVersion': '2.0.0-optimized',
        'accuracy': float(val_acc),
        'modelFormat': 'tfjs-layers-model',
        'modelFile': 'model.json'
    }
    
    # Use existing CLASS_MAPPING... (same logic as before)
    idx_to_class = {v: k for k, v in train_gen.class_indices.items()}
    for idx in range(num_classes):
        folder = idx_to_class[idx]
        if folder in CLASS_MAPPING:
            metadata['classes'].append({'index': idx, 'folder': folder, **CLASS_MAPPING[folder]})
        else:
            metadata['classes'].append({'index': idx, 'folder': folder, 'id': folder, 'name': folder, 'nameEn': folder})
            
    with open(os.path.join(TFJS_OUTPUT_DIR, 'metadata.json'), 'w') as f:
        json.dump(metadata, f, indent=2)

if __name__ == '__main__':
    train_model()
