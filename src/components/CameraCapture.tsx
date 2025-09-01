import React from 'react';
import { Camera, CameraOff, Aperture as Capture, AlertTriangle, Zap } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';

interface CameraCaptureProps {
  onImageCaptured: (imageDataUrl: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCaptured }) => {
  const { cameraState, videoRef, startCamera, stopCamera, captureImage } = useCamera();

  const handleCapture = () => {
    const imageData = captureImage();
    if (imageData) {
      console.log('Image captured successfully');
      onImageCaptured(imageData);
    } else {
      console.error('Failed to capture image');
      alert('Failed to capture image. Please make sure the camera is active and try again.');
    }
  };

  const handleStartCamera = async () => {
    console.log('Starting camera...');
    await startCamera();
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
      <div className="p-8 bg-gradient-to-br from-orange-600/80 via-red-600/80 to-pink-600/80 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-3">📷 Camera Capture</h2>
        <p className="text-orange-100 text-lg">Take a high-quality photo of your Padang dish</p>
      </div>
      
      <div className="p-8">
        {!cameraState.isActive ? (
          <div className="text-center py-16">
            <div className="relative mb-6">
              <Camera size={80} className="mx-auto text-gray-400" />
              <div className="absolute inset-0 animate-ping">
                <Camera size={80} className="mx-auto text-gray-500/30 opacity-30" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Ready to Capture</h3>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              Enable your camera to start identifying delicious Padang dishes with AI-powered recognition
            </p>
            <button
              onClick={handleStartCamera}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25 flex items-center space-x-3 mx-auto"
            >
              <Zap size={24} />
              <span>🎥 Start Camera</span>
            </button>
            
            {/* Camera permissions info */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-2xl max-w-md mx-auto backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Camera className="text-blue-400" size={20} />
                <span className="text-blue-300 font-medium">Camera Permissions Required</span>
              </div>
              <p className="text-blue-200 text-sm">
                This app needs camera access to capture photos of your food. Please allow camera permissions when prompted.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-gray-900/50 shadow-2xl backdrop-blur-sm">
              <video
                ref={videoRef}
                className="w-full h-80 object-cover"
                autoPlay
                playsInline
                muted
                style={{ transform: 'scaleX(-1)' }}
              />
              <div className="absolute inset-0 border-4 border-dashed border-orange-400/40 rounded-2xl pointer-events-none"></div>
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium">
                🔴 Live Camera
              </div>
              
              {/* Camera guidelines */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm">
                <p className="text-center">Position your Padang dish in the center of the frame</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-6">
              <button
                onClick={handleCapture}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25 flex items-center space-x-3"
              >
                <Capture size={24} />
                <span>📸 Capture Photo</span>
              </button>
              
              <button
                onClick={stopCamera}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-3"
              >
                <CameraOff size={24} />
                <span>⏹️ Stop Camera</span>
              </button>
            </div>
          </div>
        )}
        
        {cameraState.error && (
          <div className="mt-6 p-6 bg-red-500/10 border border-red-400/20 rounded-2xl backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-red-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-red-300 font-medium">Camera Error</p>
                <p className="text-red-200 text-sm mt-1">{cameraState.error}</p>
                <div className="mt-3 text-red-200 text-sm">
                  <p className="font-medium">Troubleshooting tips:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Make sure you allow camera permissions</li>
                    <li>Check if another app is using the camera</li>
                    <li>Try refreshing the page</li>
                    <li>Ensure you're using HTTPS (required for camera access)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
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