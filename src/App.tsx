import { useState } from 'react';
import { ChefHat, Brain } from 'lucide-react';
import { CameraCapture } from './components/CameraCapture';
import { ImagePreview } from './components/ImagePreview';
import { PredictionResults } from './components/PredictionResults';
import { DatasetInfo } from './components/DatasetInfo';
import { Documentation } from './components/Documentation';
import { FloatingNav } from './components/FloatingNav';
import { useImageClassification } from './hooks/useImageClassification';
import { PredictionResult } from './types/food';

function App() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [currentPage, setCurrentPage] = useState<'home' | 'docs' | 'dataset'>('home');
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

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'docs':
        return <Documentation />;
      case 'dataset':
        return <DatasetInfo />;
      default:
        return renderHomePage();
    }
  };

  const renderHomePage = () => (
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
                className="progress-bar bg-gradient-to-r from-primary to-info"
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

      <div className="row g-4">
        {/* Left Column */}
        <div className="col-lg-6">
          {!capturedImage ? (
            <CameraCapture onImageCaptured={handleImageCaptured} />
          ) : (
            <ImagePreview imageDataUrl={capturedImage} onClose={handleCloseImage} />
          )}

          {!capturedImage && (
            <div className="card mt-4 shadow-sm border-0 overflow-hidden">
              <div className="card-header bg-danger text-white p-4">
                <h2 className="card-title fw-bold mb-0">How It Works</h2>
                <p className="card-text opacity-75">AI-powered food recognition in 3 simple steps</p>
              </div>

              <div className="card-body p-4">
                <div className="d-flex mb-4">
                  <div className="flex-shrink-0 bg-danger text-white rounded-3 d-flex align-items-center justify-content-center fw-bold fs-5 shadow-sm" style={{ width: '48px', height: '48px' }}>
                    1
                  </div>
                  <div className="ms-3">
                    <h5 className="fw-bold mb-1">Choose Input Method</h5>
                    <p className="text-muted small">Start camera for live capture or upload an image from your device storage</p>
                  </div>
                </div>

                <div className="d-flex mb-4">
                  <div className="flex-shrink-0 bg-danger text-white rounded-3 d-flex align-items-center justify-content-center fw-bold fs-5 shadow-sm" style={{ width: '48px', height: '48px' }}>
                    2
                  </div>
                  <div className="ms-3">
                    <h5 className="fw-bold mb-1">Capture or Upload</h5>
                    <p className="text-muted small">Take a photo with camera or select an existing image from your gallery</p>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="flex-shrink-0 bg-danger text-white rounded-3 d-flex align-items-center justify-content-center fw-bold fs-5 shadow-sm" style={{ width: '48px', height: '48px' }}>
                    3
                  </div>
                  <div className="ms-3">
                    <h5 className="fw-bold mb-1">Get Results</h5>
                    <p className="text-muted small">Receive instant AI predictions with confidence scores and detailed information</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="col-lg-6">
          {capturedImage && (
            <PredictionResults
              predictions={predictions}
              isLoading={isClassifying}
            />
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-vh-100 bg-light position-relative overflow-hidden">
      {/* Floating Navigation */}
      <FloatingNav currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Header */}
      <header className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-3">
        <div className="container">
          <div className="d-flex align-items-center">
            <div className="p-2 bg-danger rounded-3 shadow-sm me-3">
              <ChefHat className="text-white" size={24} />
            </div>
            <div>
              <h1 className="h4 fw-bold text-white mb-0">
                Padang Food Recognition
              </h1>
              <p className="text-white-50 small mb-0">Advanced AI-powered food identification system</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-5 position-relative z-1">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-5 mt-auto">
        <div className="container text-center">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <ChefHat className="text-danger me-2" size={20} />
            <span className="fw-bold fs-5 text-white">
              Padang Food Recognition
            </span>
          </div>
          <p className="text-white-50 small mb-1">
            Powered by TensorFlow.js and modern web technologies
          </p>
          <p className="text-secondary small">
            © 2025. Created with 💖 by Rachdian
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;