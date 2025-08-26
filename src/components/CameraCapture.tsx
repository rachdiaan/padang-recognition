import React from 'react';
import { Camera, CameraOff, Aperture as Capture } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';

interface CameraCaptureProps {
  onImageCaptured: (imageDataUrl: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCaptured }) => {
  const { cameraState, videoRef, startCamera, stopCamera, captureImage } = useCamera();

  const handleCapture = () => {
    const imageData = captureImage();
    if (imageData) {
      onImageCaptured(imageData);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
      <div className="p-8 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600">
        <h2 className="text-3xl font-bold text-white mb-3">Camera Capture</h2>
        <p className="text-orange-100 text-lg">Take a high-quality photo of your Padang dish</p>
      </div>
      
      <div className="p-8">
        {!cameraState.isActive ? (
          <div className="text-center py-16">
            <div className="relative mb-6">
              <Camera size={80} className="mx-auto text-gray-400" />
              <div className="absolute inset-0 animate-ping">
                <Camera size={80} className="mx-auto text-gray-300 opacity-30" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to Capture</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Enable your camera to start identifying delicious Padang dishes with AI-powered recognition
            </p>
            <button
              onClick={startCamera}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25"
            >
              🎥 Start Camera
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-2xl">
              <video
                ref={videoRef}
                className="w-full h-80 object-cover"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute inset-0 border-4 border-dashed border-white/40 rounded-2xl pointer-events-none"></div>
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium">
                🔴 Live Camera
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
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-3"
              >
                <CameraOff size={24} />
                <span>⏹️ Stop Camera</span>
              </button>
            </div>
          </div>
        )}
        
        {cameraState.error && (
          <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="text-red-500">⚠️</div>
              <p className="text-red-700 font-medium">{cameraState.error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};