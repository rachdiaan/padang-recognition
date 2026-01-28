"""
Padang Food Recognition - Model Training Script
Uses Transfer Learning with MobileNetV2 for efficient web deployment
"""

import os
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
import json
import subprocess

# Configuration
DATASET_PATH = r"C:\Users\rachd\.cache\kagglehub\datasets\faldoae\padangfood\versions\1\dataset_padang_food"
MODEL_OUTPUT_DIR = "./model"
TFJS_OUTPUT_DIR = "./public/model"
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 30

# Class mappings for the web app
CLASS_MAPPING = {
    'ayam_goreng': {
        'id': 'ayam-goreng',
        'name': 'Ayam Goreng',
        'nameEn': 'Fried Chicken'
    },
    'ayam_pop': {
        'id': 'ayam-pop',
        'name': 'Ayam Pop',
        'nameEn': 'Pop Chicken'
    },
    'daging_rendang': {
        'id': 'rendang',
        'name': 'Rendang',
        'nameEn': 'Rendang Beef'
    },
    'dendeng_batokok': {
        'id': 'dendeng-batokok',
        'name': 'Dendeng Batokok',
        'nameEn': 'Pounded Beef Jerky'
    },
    'gulai_ikan': {
        'id': 'gulai-ikan',
        'name': 'Gulai Ikan',
        'nameEn': 'Fish Curry'
    },
    'gulai_tambusu': {
        'id': 'gulai-tambusu',
        'name': 'Gulai Tambusu',
        'nameEn': 'Intestine Curry'
    },
    'gulai_tunjang': {
        'id': 'gulai-tunjang',
        'name': 'Gulai Tunjang',
        'nameEn': 'Beef Tendon Curry'
    },
    'telur_balado': {
        'id': 'telur-balado',
        'name': 'Telur Balado',
        'nameEn': 'Spicy Egg'
    },
    'telur_dadar': {
        'id': 'telur-dadar',
        'name': 'Telur Dadar Padang',
        'nameEn': 'Padang Omelette'
    }
}

def create_model(num_classes):
    """Create MobileNetV2-based model for transfer learning"""
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(*IMAGE_SIZE, 3)
    )
    
    base_model.trainable = False
    
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.3)(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    
    return model, base_model

def prepare_data():
    """Prepare data generators with augmentation"""
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2
    )
    
    val_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2
    )
    
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
    """Main training function"""
    print("=" * 60)
    print("Padang Food Recognition - Model Training")
    print("=" * 60)
    
    print("\n[1/6] Loading dataset...")
    train_gen, val_gen = prepare_data()
    
    num_classes = len(train_gen.class_indices)
    print(f"Found {num_classes} classes:")
    for cls, idx in train_gen.class_indices.items():
        print(f"   {idx}: {cls}")
    
    print("\n[2/6] Creating model...")
    model, base_model = create_model(num_classes)
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print("\nModel Summary:")
    model.summary()
    
    os.makedirs(MODEL_OUTPUT_DIR, exist_ok=True)
    os.makedirs(TFJS_OUTPUT_DIR, exist_ok=True)
    
    callbacks = [
        EarlyStopping(
            monitor='val_accuracy',
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-7,
            verbose=1
        ),
        ModelCheckpoint(
            os.path.join(MODEL_OUTPUT_DIR, 'best_model.keras'),
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        )
    ]
    
    print("\n[3/6] Phase 1: Training classification head...")
    history1 = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=10,
        callbacks=callbacks,
        verbose=1
    )
    
    print("\n[4/6] Phase 2: Fine-tuning top layers...")
    base_model.trainable = True
    
    for layer in base_model.layers[:-30]:
        layer.trainable = False
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=1e-5),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    history2 = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS,
        initial_epoch=10,
        callbacks=callbacks,
        verbose=1
    )
    
    print("\n[5/6] Evaluating model...")
    val_loss, val_acc = model.evaluate(val_gen, verbose=0)
    print(f"   Validation Loss: {val_loss:.4f}")
    print(f"   Validation Accuracy: {val_acc:.4f}")
    
    keras_model_path = os.path.join(MODEL_OUTPUT_DIR, 'padang_food_model.keras')
    print(f"\n[6/6] Saving model to {keras_model_path}...")
    model.save(keras_model_path)
    
    saved_model_path = os.path.join(MODEL_OUTPUT_DIR, 'saved_model')
    print(f"Saving SavedModel to {saved_model_path}...")
    model.export(saved_model_path)
    
    class_indices = train_gen.class_indices
    idx_to_class = {v: k for k, v in class_indices.items()}
    
    metadata = {
        'classes': [],
        'classIndices': class_indices,
        'imageSize': IMAGE_SIZE[0],
        'modelVersion': '1.0.0',
        'accuracy': float(val_acc)
    }
    
    for idx in range(num_classes):
        folder_name = idx_to_class[idx]
        if folder_name in CLASS_MAPPING:
            metadata['classes'].append({
                'index': idx,
                'folder': folder_name,
                **CLASS_MAPPING[folder_name]
            })
        else:
            metadata['classes'].append({
                'index': idx,
                'folder': folder_name,
                'id': folder_name.replace('_', '-'),
                'name': folder_name.replace('_', ' ').title(),
                'nameEn': folder_name.replace('_', ' ').title()
            })
    
    metadata_path = os.path.join(TFJS_OUTPUT_DIR, 'metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved metadata to {metadata_path}")
    
    print("\n" + "=" * 60)
    print("Training complete!")
    print("=" * 60)
    print(f"\nOutput files:")
    print(f"   - Keras model: {keras_model_path}")
    print(f"   - SavedModel: {saved_model_path}")
    print(f"   - Metadata: {metadata_path}")
    print(f"\nFinal accuracy: {val_acc:.2%}")
    
    print(f"\nTo convert to TensorFlow.js, run:")
    print(f"   tensorflowjs_converter --input_format=keras {keras_model_path} {TFJS_OUTPUT_DIR}")
    
    return model, history1, history2

if __name__ == '__main__':
    train_model()
