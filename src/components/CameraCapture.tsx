import React from 'react';
import { Camera, CameraOff, Aperture as Capture, Upload, Smartphone, Monitor, Wifi, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';

interface CameraCaptureProps {
  onImageCaptured: (imageDataUrl: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCaptured }) => {
  const { cameraState, videoRef, startCamera, stopCamera, captureImage } = useCamera();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File type validation
    if (!file.type.startsWith('image/')) {
      alert('❌ Please select a valid image file (JPG, PNG, WebP, etc.)');
      return;
    }

    // File size validation (max 15MB)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`❌ File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Please select an image smaller than 15MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        onImageCaptured(result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = ''; // Reset
  };

  const handleCapture = () => {
    if (!cameraState.isReadyForCapture) return;
    const imageData = captureImage();
    if (imageData) {
      onImageCaptured(imageData);
    }
  };

  const handleStartCamera = async () => {
    await startCamera();
  };

  const renderCameraStatus = () => {
    if (cameraState.error) {
      return (
        <div className="mt-4 p-3 bg-danger bg-opacity-10 border border-danger rounded-3">
          <div className="d-flex align-items-start">
            <XCircle className="text-danger flex-shrink-0 mt-1 me-3" size={24} />
            <div>
              <h5 className="text-danger fw-bold mb-2">Camera Access Issue</h5>
              <p className="text-danger small mb-0">{cameraState.error}</p>
              <button
                onClick={handleStartCamera}
                className="btn btn-sm btn-danger mt-3"
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
      <div className="mt-4 p-3 bg-info bg-opacity-10 border border-info rounded-3">
        <h6 className="text-info fw-bold mb-3 d-flex align-items-center">
          <Shield className="me-2" size={18} />
          System Status
        </h6>

        <div className="row g-2">
          <div className="col-md-6">
            <div className="d-flex align-items-center mb-2">
              {isSecure ? <CheckCircle className="text-success me-2" size={16} /> : <XCircle className="text-danger me-2" size={16} />}
              <small className={isSecure ? 'text-success' : 'text-danger'}>HTTPS / Secure</small>
            </div>
            <div className="d-flex align-items-center">
              {hasMediaDevices ? <CheckCircle className="text-success me-2" size={16} /> : <XCircle className="text-danger me-2" size={16} />}
              <small className={hasMediaDevices ? 'text-success' : 'text-danger'}>Camera API</small>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex align-items-center mb-2">
              {isMobile ? <Smartphone className="text-info me-2" size={16} /> : <Monitor className="text-info me-2" size={16} />}
              <small className="text-info">{isMobile ? 'Mobile' : 'Desktop'}</small>
            </div>
            <div className="d-flex align-items-center">
              <Wifi className="text-info me-2" size={16} />
              <small className="text-info">{navigator.onLine ? 'Online' : 'Offline'}</small>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card border-0 bg-dark text-white overflow-hidden rounded-4 shadow-lg">
      {!cameraState.isActive ? (
        <div className="card-body p-5 text-center">
          <div className="mb-4">
            <CameraOff size={64} className="text-secondary opacity-50 mx-auto" />
          </div>
          <h3 className="card-title fw-bold mb-3">Camera Access Needed</h3>
          <p className="card-text text-white-50 mb-4 px-lg-5">
            To identify Padang food, we need access to your camera.
            Please allow permission when prompted or check your browser settings.
          </p>
          <div className="d-grid gap-3 d-sm-flex justify-content-center">
            <button
              onClick={handleStartCamera}
              className="btn btn-primary btn-lg px-4 fw-bold rounded-pill"
            >
              <Camera className="me-2" size={20} />
              Enable Camera
            </button>
            <label className="btn btn-outline-light btn-lg px-4 fw-bold rounded-pill">
              <Upload className="me-2" size={20} />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="d-none"
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="card-body p-0">
          <div className="position-relative bg-black" style={{ minHeight: '400px' }}>
            {/* Live Camera Feed */}
            <div className={`w-100 h-100 transition-fade ${cameraState.isActive ? 'opacity-100' : 'opacity-0'}`}>
              <video
                ref={videoRef}
                className="w-100 h-100 object-cover"
                autoPlay
                playsInline
                muted
                style={{ transform: 'scaleX(-1)', height: '400px' }}
              />

              {/* Camera Overlay */}
              {cameraState.isActive && (
                <>
                  <div className="position-absolute top-0 start-0 m-3 d-flex align-items-center bg-dark bg-opacity-75 text-white px-3 py-1 rounded-pill small fw-bold">
                    <div className="spinner-grow spinner-grow-sm text-danger me-2" role="status"></div>
                    LIVE
                  </div>

                  <div className="position-absolute top-0 end-0 m-3 bg-dark bg-opacity-75 text-white px-3 py-1 rounded-pill small">
                    {cameraState.isReadyForCapture ? '✅ Ready' : '⏳ Preparing...'}
                  </div>

                  {/* Center Focus Guide */}
                  <div className="position-absolute top-50 start-50 translate-middle pe-none">
                    <div className="border border-2 border-white border-opacity-50 rounded-3 d-flex align-items-center justify-content-center transition-all" style={{ width: 'min(250px, 75vw)', height: 'min(250px, 75vw)' }}>
                      <div className="text-center text-white text-opacity-75">
                        <Camera size={32} className="mb-2" />
                        <p className="small fw-bold mb-0">Center dish here</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Instructions */}
            <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-gradient-black-bottom text-center text-white small">
              Position your Padang dish in the center • Ensure good lighting
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 bg-dark">
            {cameraState.isActive ? (
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <button
                  onClick={handleCapture}
                  disabled={!cameraState.isReadyForCapture}
                  className={`btn btn-lg fw-bold rounded-pill px-5 d-flex align-items-center ${cameraState.isReadyForCapture ? 'btn-success' : 'btn-secondary disabled'}`}
                >
                  <Capture size={24} className="me-2" />
                  {cameraState.isReadyForCapture ? 'Capture Shot' : 'Preparing...'}
                </button>

                <button
                  onClick={stopCamera}
                  className="btn btn-outline-light btn-lg rounded-pill px-4 d-flex align-items-center"
                >
                  <CameraOff size={24} className="me-2" />
                  Stop
                </button>

                <label className="btn btn-primary btn-lg rounded-pill px-4 d-flex align-items-center">
                  <Upload size={24} className="me-2" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="d-none"
                  />
                </label>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-white-50 mb-0">Camera is initializing...</p>
              </div>
            )}

            {/* Camera Info */}
            <div className="mt-4 pt-3 border-top border-secondary">
              <div className="d-flex align-items-center text-white-50 small mb-2">
                <Camera size={16} className="me-2 text-info" />
                <span>Camera Information</span>
              </div>
              <div className="row g-2 small text-light">
                <div className="col-4"><span className="text-secondary">Status:</span> <span className="text-white fw-bold">{cameraState.isReadyForCapture ? 'Ready' : 'Init'}</span></div>
                <div className="col-4"><span className="text-secondary">Mode:</span> <span className="text-white fw-bold">HQ</span></div>
              </div>
            </div>

            {renderSystemStatus()}
            {renderCameraStatus()}
          </div>
        </div>
      )}

      {/* Persistent Hidden Video */}
      <video
        ref={videoRef}
        className="d-none"
        autoPlay
        playsInline
        muted
      />
    </div>
  );
};