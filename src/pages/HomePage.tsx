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
        <div className="min-vh-100 d-flex flex-column">
            {/* Model Loading Overlay - Modernized */}
            {modelLoading && (
                <div className="position-fixed top-0 start-0 w-100 h-100 z-50 d-flex align-items-center justify-content-center bg-dark bg-opacity-90 backdrop-blur-md">
                    <div className="card bg-black border-secondary text-white shadow-2xl" style={{ maxWidth: '400px', width: '90%' }}>
                        <div className="card-body p-5 text-center">
                            <div className="mb-4 position-relative d-inline-block">
                                <div className="spinner-border text-info" role="status" style={{ width: '4rem', height: '4rem' }}></div>
                                <div className="position-absolute top-50 start-50 translate-middle">
                                    <Brain className="text-white" size={24} />
                                </div>
                            </div>
                            <h4 className="fw-bold mb-2">Initializing AI</h4>
                            <p className="text-secondary mb-4">Loading Padang Food Model v2.0...</p>
                            <div className="progress bg-secondary bg-opacity-25 rounded-pill" style={{ height: '8px' }}>
                                <div
                                    className="progress-bar bg-gradient-primary-info rounded-pill transition-all duration-300"
                                    role="progressbar"
                                    style={{ width: `${modelLoadProgress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-grow-1 d-flex align-items-center">
                <div className="container-fluid px-lg-5">
                    <div className={`row g-4 align-items-center justify-content-center transition-all duration-700 ${capturedImage ? 'pb-5' : 'py-5'}`}>

                        {/* Left Column: Camera / Input */}
                        <div className={`transition-all duration-700 ${capturedImage ? 'col-lg-5 order-lg-1' : 'col-lg-8 col-xl-7'}`}>

                            {!capturedImage && (
                                <div className="text-center mb-5 animation-fade-in-up">
                                    <h1 className="display-4 fw-800 mb-3 letter-spacing-tight text-shadow-sm text-adaptive">
                                        Padang <span className="text-gradient-primary">Cuisine</span> Recognition
                                    </h1>
                                    <p className="lead text-secondary mx-auto" style={{ maxWidth: '600px' }}>
                                        Experience the power of AI. Instantly identify authentic Padang dishes with professional-grade accuracy directly from your browser.
                                    </p>
                                </div>
                            )}

                            <div className={`card border-0 bg-glass shadow-2xl rounded-5 overflow-hidden transition-all duration-500 hover-transform-sm ${!capturedImage ? 'mx-auto' : ''}`} style={{ maxWidth: capturedImage ? '100%' : '800px' }}>
                                <div className="card-body p-2 p-md-3">
                                    {capturedImage ? (
                                        <ImagePreview imageDataUrl={capturedImage} onClose={handleCloseImage} />
                                    ) : (
                                        <CameraCapture onImageCaptured={handleImageCaptured} />
                                    )}
                                </div>
                            </div>

                            {/* Modern Features Grid (Only visible when idle) */}
                            {!capturedImage && (
                                <div className="row g-4 mt-4 justify-content-center animation-fade-in-up delay-200">
                                    {[
                                        { icon: "⚡", title: "Real-time", desc: "Instant analysis using TensorFlow.js" },
                                        { icon: "🔒", title: "Private", desc: "Images never leave your device" },
                                        { icon: "🍛", title: "9 Classes", desc: "Detects popular Padang dishes" }
                                    ].map((feature, idx) => (
                                        <div key={idx} className="col-md-4 col-sm-6" style={{ maxWidth: '300px' }}>
                                            <div className="p-3 rounded-4 bg-glass text-center h-100 hover-bg-opacity-10 transition-all cursor-default shadow-sm border-0">
                                                <div className="fs-2 mb-2">{feature.icon}</div>
                                                <h6 className="fw-bold mb-1 text-adaptive">{feature.title}</h6>
                                                <p className="text-secondary small mb-0">{feature.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Column: Results (Appears on side) */}
                        {capturedImage && (
                            <div className="col-lg-5 col-xl-4 order-lg-2 animation-slide-in-right">
                                <div className="sticky-top" style={{ top: '100px', zIndex: 10 }}>
                                    <PredictionResults
                                        predictions={predictions}
                                        isLoading={isClassifying}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
