import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { CameraCapture } from '../components/CameraCapture';
import { ImagePreview } from '../components/ImagePreview';
import { PredictionResults } from '../components/PredictionResults';
import { useImageClassification } from '../hooks/useImageClassification';
import { PredictionResult } from '../types/food';

export const HomePage: React.FC = () => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [predictions, setPredictions] = useState<PredictionResult[]>([]);
    const { isLoading: modelLoading, isClassifying, modelLoadProgress, classifyImage } = useImageClassification();

    const handleImageCaptured = async (imageDataUrl: string) => {
        // Validate image data
        if (!imageDataUrl || !imageDataUrl.startsWith('data:image/')) {
            alert('❌ Invalid image data. Please try capturing or uploading again.');
            return;
        }

        setCapturedImage(imageDataUrl);
        setPredictions([]);

        try {
            const results = await classifyImage(imageDataUrl);
            setPredictions(results);
        } catch {
            setPredictions([]);
        }
    };

    const handleCloseImage = () => {
        setCapturedImage(null);
        setPredictions([]);
    };

    return (
        <>
            {modelLoading && (
                <div className="card mb-4 bg-dark text-white border-secondary">
                    <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                            <div className="position-relative me-3">
                                <Brain className="text-info" size={32} />
                            </div>
                            <div className="flex-grow-1">
                                <p className="fw-bold fs-5 mb-0">🧠 Loading MobileNet AI Model...</p>
                                <p className="text-light small mb-0">Preparing TensorFlow.js for image recognition</p>
                            </div>
                            <div className="text-info fw-bold fs-5">{modelLoadProgress}%</div>
                        </div>
                        <div className="progress" style={{ height: '12px' }}>
                            <div
                                className="progress-bar bg-gradient-primary-info"
                                role="progressbar"
                                style={{ width: `${modelLoadProgress}%` }}
                            />
                        </div>
                        <div className="d-flex justify-content-between small text-secondary mt-2">
                            <span>Initializing WebGL</span>
                            <span>Loading weights</span>
                            <span>Ready</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="row g-4 justify-content-center">
                {/* Left Column - Camera */}
                <div className={`transition-all duration-500 ${capturedImage ? 'col-lg-6' : 'col-lg-8 col-xl-6'}`}>
                    {!capturedImage ? (
                        <div className="d-flex flex-column gap-4">
                            {/* Hero Text when idle */}
                            <div className="text-center mb-2">
                                <h1 className="display-5 fw-bold mb-2">Padang Food AI</h1>
                                <p className="lead text-secondary">Instantly identify authentic Padang dishes with a single photo</p>
                            </div>

                            <CameraCapture onImageCaptured={handleImageCaptured} />

                            {/* How It Works - Compact Horizontal Version */}
                            <div className="card shadow-sm border-0 bg-white bg-opacity-50 backdrop-blur">
                                <div className="card-body p-4">
                                    <h6 className="fw-bold text-uppercase text-secondary mb-3 small letter-spacing-1">How it works</h6>
                                    <div className="row g-3 text-center">
                                        <div className="col-4">
                                            <div className="mb-2">
                                                <div className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle p-3">
                                                    <span className="fw-bold">1</span>
                                                </div>
                                            </div>
                                            <small className="fw-bold d-block">Start Camera</small>
                                        </div>
                                        <div className="col-4">
                                            <div className="mb-2">
                                                <div className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle p-3">
                                                    <span className="fw-bold">2</span>
                                                </div>
                                            </div>
                                            <small className="fw-bold d-block">Capture Dish</small>
                                        </div>
                                        <div className="col-4">
                                            <div className="mb-2">
                                                <div className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle p-3">
                                                    <span className="fw-bold">3</span>
                                                </div>
                                            </div>
                                            <small className="fw-bold d-block">Get Results</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-100">
                            <ImagePreview imageDataUrl={capturedImage} onClose={handleCloseImage} />
                        </div>
                    )}
                </div>

                {/* Right Column - Results (Only visible when image captured) */}
                {capturedImage && (
                    <div className="col-lg-6 animation-slide-in-right">
                        <PredictionResults
                            predictions={predictions}
                            isLoading={isClassifying}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
