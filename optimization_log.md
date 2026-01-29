# 📊 Model Optimization Log
**Date**: 2026-01-30
**Model Version**: V2 Optimized (MobileNetV2 + Color Invariant)
**Status**: 🔄 Training in Progress (Check `training.log`)

## 1. Dataset Analysis
User requested a full check of the dataset. Below is the distribution analysis.

| Class | Count | Percentage |
| :--- | :--- | :--- |
| **gulai_tunjang** | 119 | 12.0% |
| **telur_dadar** | 116 | 11.7% |
| **ayam_pop** | 113 | 11.4% |
| **gulai_ikan** | 111 | 11.2% |
| **telur_balado** | 111 | 11.2% |
| **dendeng_batokok** | 109 | 11.0% |
| **ayam_goreng** | 107 | 10.8% |
| **daging_rendang** | 104 | 10.5% |
| **gulai_tambusu** | 103 | 10.4% |
| **TOTAL** | **993** | **100%** |

**Health Check**:
- ✅ **Balance**: Good (Ratio 1.16). No synthetic balancing needed.
- ✅ **Integrity**: All images verified readable.
- ✅ **Path**: `dataset/train` verified.

## 2. Optimization Strategy (V2)
We are upgrading the model from a basic classifier to a robust, color-invariant predictor.

### A. Data Augmentation Updates
To handle "Red vs Green Chili" and lighting differences:
*   `brightness_range=[0.6, 1.4]`: Handles dark/bright environments.
*   `channel_shift_range=40.0`: **CRITICAL**. Shifts RGB channels to simulate different chili colors/lighting tints without changing the object structure.
*   `rotation_range=45` & `zoom_range=0.35`: Robustness against camera angles.

### B. Architecture Improvements
*   **Backbone**: MobileNetV2 (Pre-trained on ImageNet).
*   **Custom Head**:
    *   `GlobalAveragePooling2D`
    *   `Dense(512, relu)` + `BatchNormalization` + `Dropout(0.5)`
    *   `Dense(256, relu)` + `Dropout(0.3)`
    *   `Dense(9, softmax)`
*   **Optimizer**: **AdamW** (Adaptive Moment Estimation with Weight Decay). Better generalization than standard Adam.
*   **Loss**: Categorical Crossentropy with **Label Smoothing (0.15)**. Prevents overconfidence (e.g., predicting 99% probability when it's ambiguous).

## 3. Training Phases
The training pipeline is split to preserve pre-trained knowledge while adapting to specific Padang food features.

1.  **Phase 1: Head Training (20 Epochs)**
    *   Base model acts as a fixed feature extractor.
    *   Only the new dense layers learn.
    *   *Goal*: Stabilize the weights before fine-tuning.

2.  **Phase 2: Deep Fine-Tuning (60 Epochs)**
    *   Unfreeze the last **80 layers** of MobileNetV2.
    *   Low Learning Rate (`3e-5`) to gently nudge the pre-trained weights.
    *   *Goal*: Learn specific texture details (e.g., Rendang vs Dendeng texture).

## 4. Next Steps
The training script is currently running in the background.

1.  **Monitor**: `Get-Content training.log -Tail 20`
2.  **Convert**: Once finished, run:
    ```bash
    python convert_to_tfjs.py
    ```
3.  **Deploy**: The new `model.json` will be saved to `public/model` and automatically picked up by the web app.
