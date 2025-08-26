import React, { useState } from 'react';
import { ChefHat, Sparkles, Menu, X, Camera, FileText, Database } from 'lucide-react';
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
  const { isLoading: modelLoading, isClassifying, classifyImage } = useImageClassification();

  const handleImageCaptured = async (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    setPredictions([]);
    
    try {
      const results = await classifyImage(imageDataUrl);
      setPredictions(results);
    } catch (error) {
      console.error('Classification failed:', error);
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
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 rounded-2xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Sparkles className="text-blue-500 animate-pulse" size={24} />
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="text-blue-300" size={24} />
              </div>
            </div>
            <div>
              <p className="text-blue-700 font-semibold">Loading AI Model...</p>
              <p className="text-blue-600 text-sm">Initializing TensorFlow.js engine</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {!capturedImage ? (
            <CameraCapture onImageCaptured={handleImageCaptured} />
          ) : (
            <ImagePreview imageDataUrl={capturedImage} onClose={handleCloseImage} />
          )}
          
          {!capturedImage && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              <div className="p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
                <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
                <p className="text-indigo-100">AI-powered food recognition in 3 simple steps</p>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Start Camera</h3>
                    <p className="text-gray-600">Enable your device camera with advanced image processing capabilities</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Capture Food</h3>
                    <p className="text-gray-600">Take a high-quality photo of your Padang dish for analysis</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Get Results</h3>
                    <p className="text-gray-600">Receive instant AI predictions with confidence scores and detailed information</p>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-red-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Navigation */}
      <FloatingNav currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg">
              <ChefHat className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Padang Food Recognition
              </h1>
              <p className="text-gray-600 mt-1 font-medium">Advanced AI-powered food identification system</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <ChefHat className="text-orange-500" size={24} />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Padang Food Recognition
              </span>
            </div>
            <p className="text-gray-700 font-medium mb-2">
              Powered by TensorFlow.js and modern web technologies
            </p>
            <p className="text-gray-600">
              © 2025. Created with 💖 by Rachdian
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;