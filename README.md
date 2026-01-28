# 🍛 Padang Food Recognition

AI-powered web application for recognizing traditional Padang (West Sumatran) cuisine using TensorFlow.js and deep learning.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22.0-FF6F00?logo=tensorflow)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?logo=tailwindcss)

## ✨ Features

- 📸 **Camera Capture** - Real-time camera access with progressive quality fallback
- 📁 **Image Upload** - Support for JPG, PNG, WebP images up to 15MB
- 🧠 **AI Recognition** - TensorFlow.js MobileNet-based image analysis
- 🍽️ **9 Padang Dishes** - Trained on Kaggle dataset with 86% accuracy
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🌙 **Dark Theme** - Modern glassmorphism UI

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/padang-recognition.git
cd padang-recognition

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🍛 Supported Dishes

| # | Dish | English Name | Spice Level |
|---|------|--------------|-------------|
| 1 | Ayam Goreng | Fried Chicken | Mild |
| 2 | Ayam Pop | Pop Chicken | Mild |
| 3 | Rendang | Rendang Beef | Medium |
| 4 | Dendeng Batokok | Pounded Beef Jerky | Hot |
| 5 | Gulai Ikan | Fish Curry | Medium |
| 6 | Gulai Tambusu | Intestine Curry | Medium |
| 7 | Gulai Tunjang | Beef Tendon Curry | Medium |
| 8 | Telur Balado | Spicy Egg | Hot |
| 9 | Telur Dadar Padang | Padang Omelette | Mild |

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI/ML**: TensorFlow.js, MobileNetV2
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/          # React UI components
│   ├── CameraCapture.tsx
│   ├── PredictionResults.tsx
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useCamera.ts     # Camera management
│   └── useImageClassification.ts  # AI inference
├── data/                # Food dataset (9 classes)
├── types/               # TypeScript definitions
└── App.tsx              # Main application

public/
└── model/               # TensorFlow.js model & metadata

model/                   # Trained Keras model
├── padang_food_model.keras
└── saved_model/
```

## 🧠 Model Training

The custom model was trained using transfer learning:

- **Base Model**: MobileNetV2 (ImageNet weights)
- **Dataset**: [Kaggle padangfood](https://www.kaggle.com/datasets/faldoae/padangfood) (993 images, 9 classes)
- **Accuracy**: 86.08%
- **Training**: 2-phase (frozen → fine-tuning)

To retrain the model:
```bash
python train_model.py
```

## 🔄 How It Works

1. **Image Capture** - User captures/uploads a food image
2. **Preprocessing** - Image is resized to 224x224 for MobileNet
3. **Feature Extraction** - MobileNet extracts visual features
4. **Color Analysis** - Additional color and texture analysis
5. **Matching** - Features matched against Padang food profiles
6. **Results** - Top predictions displayed with confidence scores

## 📄 License

MIT © 2025 Rachdian

---

Made with ❤️ for Padang food lovers
