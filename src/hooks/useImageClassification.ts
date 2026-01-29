import { useState, useEffect, useCallback, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { padangFoodDataset, getFoodByClassIndex } from '../data/padangFoodDataset';
import { PredictionResult, FoodItem } from '../types/food';

// Configuration
const USE_CUSTOM_MODEL = true; // Custom model now available!
const CUSTOM_MODEL_URL = '/model/model.json';
const MOBILENET_URL = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/feature_vector/3/default/1';

// Model metadata interface
interface ModelMetadata {
  classes: Array<{
    index: number;
    folder: string;
    id: string;
    name: string;
    nameEn: string;
  }>;
  imageSize: number;
  accuracy: number;
}

// Food visual characteristics for matching (aligned with 9 model classes)
interface FoodVisualProfile {
  food: FoodItem;
  colorProfile: {
    dominant: string[];
    secondary: string[];
  };
  textureKeywords: string[];
  shapeKeywords: string[];
}

// Create visual profiles aligned with the 9 trained model classes
const foodVisualProfiles: FoodVisualProfile[] = [
  // ayam_goreng (index 0)
  {
    food: padangFoodDataset.find(f => f.id === 'ayam-goreng')!,
    colorProfile: { dominant: ['golden', 'brown'], secondary: ['yellow', 'orange', 'dark-brown'] },
    textureKeywords: ['crispy', 'fried', 'skin'],
    shapeKeywords: ['pieces', 'chunks']
  },
  // ayam_pop (index 1)
  {
    food: padangFoodDataset.find(f => f.id === 'ayam-pop')!,
    colorProfile: { dominant: ['white', 'cream'], secondary: ['yellow', 'light-brown'] },
    textureKeywords: ['smooth', 'skin', 'soft'],
    shapeKeywords: ['whole', 'pieces']
  },
  // daging_rendang (index 2)
  {
    food: padangFoodDataset.find(f => f.id === 'rendang')!,
    colorProfile: { dominant: ['brown', 'dark-brown'], secondary: ['red', 'black'] },
    textureKeywords: ['rough', 'fibrous', 'dry'],
    shapeKeywords: ['chunks', 'irregular']
  },
  // dendeng_batokok (index 3)
  {
    food: padangFoodDataset.find(f => f.id === 'dendeng-batokok')!,
    colorProfile: { dominant: ['red', 'dark-red'], secondary: ['brown', 'orange'] },
    textureKeywords: ['crispy', 'flat', 'thin'],
    shapeKeywords: ['slices', 'flat']
  },
  // gulai_ikan (index 4)
  {
    food: padangFoodDataset.find(f => f.id === 'gulai-ikan')!,
    colorProfile: { dominant: ['yellow', 'orange'], secondary: ['white', 'brown'] },
    textureKeywords: ['creamy', 'liquid', 'soft'],
    shapeKeywords: ['fish', 'whole']
  },
  // gulai_tambusu (index 5)
  {
    food: padangFoodDataset.find(f => f.id === 'gulai-tambusu')!,
    colorProfile: { dominant: ['yellow', 'orange'], secondary: ['cream', 'white', 'brown'] },
    textureKeywords: ['creamy', 'smooth', 'soft'],
    shapeKeywords: ['tube', 'rolls']
  },
  // gulai_tunjang (index 6)
  {
    food: padangFoodDataset.find(f => f.id === 'gulai-tunjang')!,
    colorProfile: { dominant: ['yellow', 'white'], secondary: ['orange', 'cream'] },
    textureKeywords: ['gelatinous', 'soft', 'chewy'],
    shapeKeywords: ['chunks', 'irregular']
  },
  // telur_balado (index 7)
  {
    food: padangFoodDataset.find(f => f.id === 'telur-balado')!,
    colorProfile: { dominant: ['red', 'dark-red'], secondary: ['yellow', 'white', 'orange'] },
    textureKeywords: ['smooth', 'saucy'],
    shapeKeywords: ['round', 'oval']
  },
  // telur_dadar (index 8)
  {
    food: padangFoodDataset.find(f => f.id === 'telur-dadar')!,
    colorProfile: { dominant: ['yellow', 'golden'], secondary: ['green', 'light-brown'] },
    textureKeywords: ['soft', 'thick'],
    shapeKeywords: ['flat', 'rectangular']
  }
];

export const useImageClassification = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isClassifying, setIsClassifying] = useState(false);
  const [modelLoadProgress, setModelLoadProgress] = useState(0);
  const [modelAccuracy, setModelAccuracy] = useState<number | null>(null);
  const modelRef = useRef<tf.LayersModel | tf.GraphModel | null>(null);
  const metadataRef = useRef<ModelMetadata | null>(null);
  const isModelLoadingRef = useRef(false);
  const isCustomModelRef = useRef(false);

  // Load model on mount
  useEffect(() => {
    const loadModel = async () => {
      if (isModelLoadingRef.current || modelRef.current) return;
      isModelLoadingRef.current = true;

      try {
        setModelLoadProgress(10);

        // Set TensorFlow.js backend
        await tf.setBackend('webgl');
        await tf.ready();
        setModelLoadProgress(20);

        // Try to load custom trained model first
        if (USE_CUSTOM_MODEL) {
          try {
            // Load metadata
            const metadataResponse = await fetch('/model/metadata.json');
            if (metadataResponse.ok) {
              metadataRef.current = await metadataResponse.json();
              setModelAccuracy(metadataRef.current?.accuracy || null);
            }
            setModelLoadProgress(30);

            // Load custom model
            modelRef.current = await tf.loadLayersModel(CUSTOM_MODEL_URL, {
              onProgress: (fraction: number) => {
                setModelLoadProgress(30 + Math.round(fraction * 60));
              }
            });

            isCustomModelRef.current = true;
            setModelLoadProgress(100);
            setIsLoading(false);
            return;
          } catch (customError) {
            console.warn('Custom model not available, falling back to MobileNet:', customError);
          }
        }

        // Fallback to MobileNet
        setModelLoadProgress(30);
        modelRef.current = await tf.loadGraphModel(MOBILENET_URL, {
          onProgress: (fraction: number) => {
            setModelLoadProgress(30 + Math.round(fraction * 60));
          }
        });

        isCustomModelRef.current = false;
        setModelLoadProgress(100);
        setIsLoading(false);

      } catch (error) {
        console.warn('Model load failed, using fallback analysis:', error);
        setIsLoading(false);
        setModelLoadProgress(100);
      }
    };

    loadModel();

    return () => {
      if (modelRef.current) {
        modelRef.current.dispose();
      }
    };
  }, []);

  // Extract color features from image
  const extractColorFeatures = useCallback((canvas: HTMLCanvasElement): { [key: string]: number } => {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const colorCounts: { [key: string]: number } = {
      'red': 0, 'orange': 0, 'yellow': 0, 'green': 0, 'brown': 0,
      'dark-brown': 0, 'white': 0, 'cream': 0, 'black': 0, 'dark-red': 0,
      'dark-green': 0, 'golden': 0, 'light-brown': 0
    };

    let totalPixels = 0;

    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      totalPixels++;

      const brightness = (r + g + b) / 3;
      const saturation = Math.max(r, g, b) - Math.min(r, g, b);

      if (brightness > 220 && saturation < 30) {
        colorCounts['white']++;
      } else if (brightness > 180 && r > g && g > b && saturation < 60) {
        colorCounts['cream']++;
      } else if (brightness < 50) {
        colorCounts['black']++;
      } else if (r > 180 && g < 80 && b < 80) {
        colorCounts['red']++;
      } else if (r > 120 && g < 60 && b < 60) {
        colorCounts['dark-red']++;
      } else if (r > 180 && g > 100 && g < 180 && b < 80) {
        colorCounts['orange']++;
      } else if (r > 180 && g > 150 && b < 80) {
        colorCounts['golden']++;
      } else if (r > 200 && g > 180 && b < 100) {
        colorCounts['yellow']++;
      } else if (g > 120 && r < 100 && b < 100) {
        colorCounts['green']++;
      } else if (g > 80 && g < 130 && r < 80 && b < 80) {
        colorCounts['dark-green']++;
      } else if (r > 139 && r < 200 && g > 69 && g < 140 && b < 80) {
        colorCounts['brown']++;
      } else if (r > 80 && r < 140 && g > 40 && g < 90 && b < 60) {
        colorCounts['dark-brown']++;
      } else if (r > 160 && g > 120 && b < 100 && brightness > 140) {
        colorCounts['light-brown']++;
      }
    }

    Object.keys(colorCounts).forEach(key => {
      colorCounts[key] = colorCounts[key] / totalPixels;
    });

    return colorCounts;
  }, []);

  // Extract texture features
  const extractTextureFeatures = useCallback((canvas: HTMLCanvasElement): { complexity: number; edgeDensity: number } => {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    let edgeCount = 0;
    let varianceSum = 0;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x += 2) {
        const idx = (y * width + x) * 4;
        const current = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;

        const right = (data[idx + 4] + data[idx + 5] + data[idx + 6]) / 3;
        const bottom = (data[idx + width * 4] + data[idx + width * 4 + 1] + data[idx + width * 4 + 2]) / 3;

        const gradX = Math.abs(current - right);
        const gradY = Math.abs(current - bottom);
        const gradient = Math.sqrt(gradX * gradX + gradY * gradY);

        if (gradient > 30) edgeCount++;
        varianceSum += gradient;
      }
    }

    const totalSamples = (width - 2) * (height - 2) / 2;

    return {
      complexity: varianceSum / totalSamples / 255,
      edgeDensity: edgeCount / totalSamples
    };
  }, []);

  // Match image features to food profiles (fallback method)
  const matchToFoodProfiles = useCallback((
    colorFeatures: { [key: string]: number },
    textureFeatures: { complexity: number; edgeDensity: number }
  ): PredictionResult[] => {
    const scores: { food: FoodItem; score: number }[] = [];

    foodVisualProfiles.forEach(profile => {
      if (!profile.food) return; // Skip if food not found

      let score = 0;

      // Color matching (weighted heavily)
      profile.colorProfile.dominant.forEach(color => {
        score += (colorFeatures[color] || 0) * 3;
      });
      profile.colorProfile.secondary.forEach(color => {
        score += (colorFeatures[color] || 0) * 1.5;
      });

      // Texture matching
      const hasRoughTexture = profile.textureKeywords.includes('rough') ||
        profile.textureKeywords.includes('crispy') ||
        profile.textureKeywords.includes('fibrous');
      if (hasRoughTexture && textureFeatures.edgeDensity > 0.3) {
        score += 0.2;
      }

      const hasSmoothTexture = profile.textureKeywords.includes('smooth') ||
        profile.textureKeywords.includes('creamy');
      if (hasSmoothTexture && textureFeatures.edgeDensity < 0.2) {
        score += 0.2;
      }

      scores.push({ food: profile.food, score });
    });

    // Sort by score and take top 4
    const sorted = scores.sort((a, b) => b.score - a.score).slice(0, 4);

    // Normalize scores to confidence
    const maxScore = sorted[0]?.score || 1;

    return sorted.map((item, index) => ({
      food: item.food,
      confidence: Math.min(0.95, Math.max(0.15, (item.score / maxScore) * 0.85 - index * 0.08)),
      matchScore: Math.min(0.98, Math.max(0.2, item.score / maxScore - index * 0.05))
    }));
  }, []);

  // Classify using custom trained model
  const classifyWithCustomModel = useCallback(async (
    tensor: tf.Tensor
  ): Promise<PredictionResult[]> => {
    if (!modelRef.current || !isCustomModelRef.current) {
      throw new Error('Custom model not available');
    }

    const predictions = modelRef.current.predict(tensor) as tf.Tensor;
    const probabilities = await predictions.data();
    predictions.dispose();

    // Get top predictions
    const results: { index: number; probability: number }[] = [];
    for (let i = 0; i < probabilities.length; i++) {
      results.push({ index: i, probability: probabilities[i] });
    }

    // Sort by probability and take top 4
    results.sort((a, b) => b.probability - a.probability);
    const topResults = results.slice(0, 4);

    // Map to food items using metadata if available, otherwise fallback
    return topResults.map(result => {
      let food: FoodItem | undefined;

      // Try to find food ID from metadata first (More robust)
      if (metadataRef.current?.classes) {
        const classMeta = metadataRef.current.classes.find(modeClass => modeClass.index === result.index);
        if (classMeta) {
          food = padangFoodDataset.find(f => f.id === classMeta.id);
        }
      }

      // Fallback to hardcoded map if metadata fails
      if (!food) {
        food = getFoodByClassIndex(result.index);
      }

      if (!food) {
        // Ultimate fallback
        return {
          food: padangFoodDataset[result.index % padangFoodDataset.length],
          confidence: result.probability,
          matchScore: result.probability
        };
      }
      return {
        food,
        confidence: result.probability,
        matchScore: result.probability
      };
    });
  }, []);

  // Main classification function
  const classifyImage = useCallback(async (imageDataUrl: string): Promise<PredictionResult[]> => {
    setIsClassifying(true);

    try {
      // Validate input
      if (!imageDataUrl || !imageDataUrl.startsWith('data:image/')) {
        throw new Error('Invalid image data provided');
      }

      // Create image element
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Needed for external images but harmless for data URLs

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Image loading timeout')), 10000);
        img.onload = () => {
          clearTimeout(timeout);
          resolve();
        };
        img.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Failed to load image'));
        };
        img.src = imageDataUrl;
      });

      // Create canvas for analysis
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = 224;
      canvas.height = 224;

      // IMPLEMENTATION: Center Crop Strategy
      // This preserves aspect ratio features (plates, shapes) instead of squashing
      const minDimension = Math.min(img.width, img.height);
      const startX = (img.width - minDimension) / 2;
      const startY = (img.height - minDimension) / 2;

      // Draw cropped center square to canvas
      ctx.drawImage(img, startX, startY, minDimension, minDimension, 0, 0, 224, 224);

      let predictions: PredictionResult[];

      // Prepare tensor for model
      const tensor = tf.tidy(() => {
        const imgTensor = tf.browser.fromPixels(canvas);
        // Normalization: [0, 1] seems correct based on training script (rescale=1./255)
        const normalized = imgTensor.toFloat().div(255);
        return normalized.expandDims(0);
      });

      try {
        // Use custom model if available
        if (isCustomModelRef.current && modelRef.current) {
          console.log('🤖 Using Custom Model for Inference');
          predictions = await classifyWithCustomModel(tensor);
        } else if (modelRef.current) {
          console.log('⚠️ Using Fallback MobileNet + Heuristics');
          // Use MobileNet for feature extraction
          const features = await modelRef.current.predict(tensor) as tf.Tensor;
          const featureArray = await features.data();
          features.dispose();

          // Combine with color/texture analysis
          const colorFeatures = extractColorFeatures(canvas);
          const textureFeatures = extractTextureFeatures(canvas);

          // Enhanced matching using MobileNet features
          const numericFeatures = Array.from(featureArray) as number[];
          const featureSum = numericFeatures.reduce((a, b) => a + Math.abs(b), 0);
          const normalizedFeatureSum = featureSum / numericFeatures.length;

          predictions = matchToFoodProfiles(colorFeatures, textureFeatures);

          // Boost confidence for food-like images
          if (normalizedFeatureSum > 0.01) {
            predictions = predictions.map(p => ({
              ...p,
              confidence: Math.min(0.95, p.confidence * 1.1),
              matchScore: Math.min(0.98, p.matchScore * 1.1)
            }));
          }
        } else {
          // Fallback to basic analysis
          const colorFeatures = extractColorFeatures(canvas);
          const textureFeatures = extractTextureFeatures(canvas);
          predictions = matchToFoodProfiles(colorFeatures, textureFeatures);
        }
      } finally {
        tensor.dispose();
      }

      // Clean up
      canvas.remove();

      return predictions;

    } catch (error) {
      console.error('Classification error:', error);
      // Fallback: return predictions based on most common Padang dishes
      return padangFoodDataset.slice(0, 3).map((food, index) => ({
        food,
        confidence: 0.4 - index * 0.1,
        matchScore: 0.5 - index * 0.1
      }));
    } finally {
      setIsClassifying(false);
    }
  }, [extractColorFeatures, extractTextureFeatures, matchToFoodProfiles, classifyWithCustomModel]);

  return {
    isLoading,
    isClassifying,
    modelLoadProgress,
    modelAccuracy,
    classifyImage
  };
};