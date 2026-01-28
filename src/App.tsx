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
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <Brain className="text-blue-400 animate-pulse" size={32} />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-lg">🧠 Loading MobileNet AI Model...</p>
              <p className="text-gray-300 text-sm">Preparing TensorFlow.js for image recognition</p>
            </div>
            <div className="text-blue-400 font-bold text-xl">{modelLoadProgress}%</div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${modelLoadProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Initializing WebGL</span>
            <span>Loading weights</span>
            <span>Ready</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {!capturedImage ? (
            <CameraCapture onImageCaptured={handleImageCaptured} />
          ) : (
            <ImagePreview imageDataUrl={capturedImage} onClose={handleCloseImage} />
          )}

          {!capturedImage && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              <div className="p-8 bg-gradient-to-br from-orange-600/80 via-red-600/80 to-pink-600/80 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
                <p className="text-orange-100">AI-powered food recognition in 3 simple steps</p>
              </div>

              <div className="p-8 space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2 text-lg">Choose Input Method</h3>
                    <p className="text-gray-300">Start camera for live capture or upload an image from your device storage</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2 text-lg">Capture or Upload</h3>
                    <p className="text-gray-300">Take a photo with camera or select an existing image from your gallery</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2 text-lg">Get Results</h3>
                    <p className="text-gray-300">Receive instant AI predictions with confidence scores and detailed information</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Navigation */}
      <FloatingNav currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md shadow-2xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg">
              <ChefHat className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Padang Food Recognition
              </h1>
              <p className="text-gray-300 mt-1 font-medium">Advanced AI-powered food identification system</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-300">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <ChefHat className="text-orange-400" size={24} />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Padang Food Recognition
              </span>
            </div>
            <p className="text-gray-400 font-medium mb-2">
              Powered by TensorFlow.js and modern web technologies
            </p>
            <p className="text-gray-500">
              © 2025. Created with 💖 by Rachdian
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;