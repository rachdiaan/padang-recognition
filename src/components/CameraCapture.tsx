import React from 'react';
import { Camera, CameraOff, Aperture as Capture, AlertTriangle, Zap, Upload, Smartphone, Monitor, Wifi, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';

interface CameraCaptureProps {
  onImageCaptured: (imageDataUrl: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCaptured }) => {
  const { cameraState, videoRef, startCamera, stopCamera, captureImage } = useCamera();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📁 Processing uploaded file:', file.name);

    // Enhanced file validation
    if (!file.type.startsWith('image/')) {
      console.error('❌ Invalid file type:', file.type);
      alert('❌ Please select a valid image file (JPG, PNG, WebP, etc.)');
      return;
    }

    // File size validation (max 15MB for high-quality images)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('❌ File too large:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
      alert(`❌ File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Please select an image smaller than 15MB.`);
      return;
    }

    console.log(`✅ File validation passed: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        console.log('✅ File uploaded and processed successfully');
        onImageCaptured(result);
      } else {
        console.error('❌ Failed to read file as data URL');
        alert('❌ Failed to process the selected file. Please try again.');
      }
    };

    reader.onerror = () => {
      console.error('❌ FileReader error');
      alert('❌ Error reading the selected file. Please try a different file.');
    };

    reader.readAsDataURL(file);
    event.target.value = ''; // Reset for reselection
  };

  const handleCapture = () => {
    if (!cameraState.isReadyForCapture) {
      console.warn('⚠️ Camera not ready for capture');
      return;
    }
    
    console.log('📸 Initiating capture...');
    const imageData = captureImage();
    
    if (imageData) {
      console.log('✅ Image captured and processed successfully');
      onImageCaptured(imageData);
    } else {
      console.error('❌ Failed to capture image');
      alert('❌ Failed to capture image. Please ensure the camera is working properly and try again.');
    }
  };

  const handleStartCamera = async () => {
    console.log('🚀 User initiated camera start');
    await startCamera();
  };

  const renderCameraStatus = () => {
    if (cameraState.error) {
      return (
        <div className="mt-8 p-6 bg-red-500/10 border border-red-400/20 rounded-3xl backdrop-blur-sm">
          <div className="flex items-start space-x-4">
            <XCircle className="text-red-400 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h4 className="text-red-300 font-bold text-lg mb-2">Camera Access Issue</h4>
              <div className="text-red-200 text-sm whitespace-pre-line leading-relaxed">
                {cameraState.error}
              </div>
              <button
                onClick={handleStartCamera}
                className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                🔄 Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSystemStatus = () => {
    const isSecure = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
    const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

    return (
      <div className="mt-6 p-6 bg-blue-500/10 border border-blue-400/20 rounded-3xl backdrop-blur-sm">
        <h4 className="text-blue-300 font-bold text-lg mb-4 flex items-center">
          <Shield className="mr-2" size={20} />
          System Status
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              {isSecure ? (
                <CheckCircle className="text-green-400" size={16} />
              ) : (
                <XCircle className="text-red-400" size={16} />
              )}
              <span className={`text-sm ${isSecure ? 'text-green-300' : 'text-red-300'}`}>
                Secure Connection (HTTPS)
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              {hasMediaDevices ? (
                <CheckCircle className="text-green-400" size={16} />
              ) : (
                <XCircle className="text-red-400" size={16} />
              )}
              <span className={`text-sm ${hasMediaDevices ? 'text-green-300' : 'text-red-300'}`}>
                Camera API Support
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              {isMobile ? (
                <Smartphone className="text-blue-400" size={16} />
              ) : (
                <Monitor className="text-blue-400" size={16} />
              )}
              <span className="text-blue-300 text-sm">
                {isMobile ? 'Mobile Device' : 'Desktop Device'}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Wifi className="text-blue-400" size={16} />
              <span className="text-blue-300 text-sm">
                {navigator.onLine ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
      <div className="p-8 bg-gradient-to-br from-orange-600/80 via-red-600/80 to-pink-600/80 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-3">📷 Advanced Camera System</h2>
        <p className="text-orange-100 text-lg">World-class image capture with intelligent error handling</p>
      </div>
      
      <div className="p-8">
        {!cameraState.isActive ? (
          <div className="text-center py-12">
            <div className="relative mb-8">
              <Camera size={96} className="mx-auto text-gray-400" />
              <div className="absolute inset-0 animate-ping">
                <Camera size={96} className="mx-auto text-gray-500/20 opacity-30" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">🚀 Ready for World-Class Capture</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              Our advanced camera system automatically optimizes settings for your device, 
              provides intelligent error recovery, and ensures the highest quality image capture possible.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={handleStartCamera}
                disabled={cameraState.error !== null}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25 flex items-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap size={28} className="group-hover:animate-pulse" />
                <span>🎥 Start Advanced Camera</span>
              </button>
              
              <div className="text-gray-400 font-medium">OR</div>
              
              <label className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-3 cursor-pointer group">
                <Upload size={28} className="group-hover:animate-bounce" />
                <span>📁 Upload from Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Upload image file"
                />
              </label>
            </div>

            {renderSystemStatus()}
            {renderCameraStatus()}
            
            {/* Enhanced Features Info */}
            <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-400/20 rounded-3xl backdrop-blur-sm">
              <h4 className="text-emerald-300 font-bold text-lg mb-4">🌟 Advanced Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-200">Progressive quality fallback</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-200">Intelligent error recovery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-200">Multi-device optimization</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-200">High-quality image processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-200">Real-time stream monitoring</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-200">Cross-platform compatibility</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Live Camera Feed */}
            <div className="relative rounded-3xl overflow-hidden bg-gray-900/50 shadow-2xl backdrop-blur-sm">
              <video
                ref={videoRef}
                className="w-full h-96 object-cover"
                autoPlay
                playsInline
                muted
                style={{ transform: 'scaleX(-1)' }}
              />
              
              {/* Camera Overlay */}
              <div className="absolute inset-0 border-4 border-dashed border-orange-400/40 rounded-3xl pointer-events-none">
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span>🔴 LIVE</span>
                </div>
                
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium">
                  {cameraState.isReadyForCapture ? '✅ Ready' : '⏳ Preparing...'}
                </div>
              </div>
              
              {/* Center Focus Guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-2 border-white/30 rounded-2xl flex items-center justify-center">
                  <div className="text-white/50 text-center">
                    <Camera size={32} className="mx-auto mb-2" />
                    <p className="text-sm font-medium">Center your dish here</p>
                  </div>
                </div>
              </div>
              
              {/* Bottom Instructions */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-center">
                <p className="text-sm font-medium">
                  🍽️ Position your Padang dish in the center • Ensure good lighting • Avoid shadows
                </p>
              </div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleCapture}
                disabled={!cameraState.isReadyForCapture}
                className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform shadow-2xl flex items-center space-x-3 ${
                  cameraState.isReadyForCapture
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:scale-105 hover:shadow-green-500/25'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50'
                }`}
              >
                <Capture size={28} />
                <span>{cameraState.isReadyForCapture ? '📸 Capture Perfect Shot' : '⏳ Preparing Camera...'}</span>
              </button>
              
              <button
                onClick={stopCamera}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-3"
              >
                <CameraOff size={28} />
                <span>⏹️ Stop Camera</span>
              </button>
              
              <label className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-3 cursor-pointer">
                <Upload size={28} />
                <span>📁 Upload Instead</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Upload image file"
                />
              </label>
            </div>

            {/* Camera Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="text-white font-bold mb-3 flex items-center">
                <Camera className="mr-2 text-blue-400" size={20} />
                Camera Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-300 ml-2 font-medium">
                    {cameraState.isReadyForCapture ? '✅ Ready for capture' : '⏳ Initializing...'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Quality:</span>
                  <span className="text-blue-300 ml-2 font-medium">Auto-optimized</span>
                </div>
                <div>
                  <span className="text-gray-400">Mode:</span>
                  <span className="text-purple-300 ml-2 font-medium">High-quality capture</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Hidden video element for camera initialization - always present in DOM */}
        {!cameraState.isActive && (
          <video
            ref={videoRef}
            className="hidden"
            autoPlay
            playsInline
            muted
            style={{ display: 'none' }}
          />
        )}
      </div>
    </div>
  );
};