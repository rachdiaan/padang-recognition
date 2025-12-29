import { useState, useRef, useCallback, useEffect } from 'react';
import { CameraState } from '../types/food';

export const useCamera = () => {
  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false,
    isReadyForCapture: false,
    stream: null,
    error: null
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useCallback(async () => {
    try {
      console.log('Requesting camera access...');
      setCameraState(prev => ({ ...prev, error: null }));
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      const constraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: { ideal: 'environment' },
          frameRate: { ideal: 30 }
        },
        audio: false
      };

      console.log('Getting user media with constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained successfully');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video metadata to load
        await new Promise<void>((resolve, reject) => {
          const video = videoRef.current!;
          
          const onLoadedMetadata = () => {
            console.log('Video metadata loaded');
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            resolve();
          };
          
          const onError = (e: Event) => {
            console.error('Video error:', e);
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            reject(new Error('Failed to load video'));
          };
          
          video.addEventListener('loadedmetadata', onLoadedMetadata);
          video.addEventListener('error', onError);
        });
        
        // Start playing the video
        console.log('Starting video playback...');
        await videoRef.current.play();
        console.log('Video is now playing');
        
        // Wait for video to be ready for capture
        await new Promise<void>((resolve) => {
          const video = videoRef.current!;
          
          const checkReadiness = () => {
            if (video.readyState >= video.HAVE_ENOUGH_DATA) {
              console.log('Video is ready for capture');
              resolve();
            } else {
              // Check again in 100ms
              setTimeout(checkReadiness, 100);
            }
          };
          
          // Also listen for canplaythrough event as backup
          const onCanPlayThrough = () => {
            console.log('Video canplaythrough event fired');
            video.removeEventListener('canplaythrough', onCanPlayThrough);
            resolve();
          };
          
          video.addEventListener('canplaythrough', onCanPlayThrough);
          checkReadiness();
        });
      }

      setCameraState({
        isActive: true,
        isReadyForCapture: true,
        stream,
        error: null
      });
      
      console.log('Camera started successfully');
    } catch (error) {
      console.error('Camera error:', error);
      let errorMessage = 'Failed to access camera. ';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Camera permission denied. Please allow camera access and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera found. Please connect a camera and try again.';
        } else if (error.name === 'NotReadableError') {
          errorMessage += 'Camera is being used by another application. Please close other apps and try again.';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'Unknown error occurred.';
      }
      
      setCameraState({
        isActive: false,
        isReadyForCapture: false,
        stream: null,
        error: errorMessage
      });
    }
  }, []);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera...');
    
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraState({
      isActive: false,
      isReadyForCapture: false,
      stream: null,
      error: null
    });
    
    console.log('Camera stopped successfully');
  }, [cameraState.stream]);

  const captureImage = useCallback((): string | null => {
    console.log('Attempting to capture image...');
    
    if (!videoRef.current || !cameraState.isActive || !cameraState.isReadyForCapture) {
      console.error('Video not available, camera not active, or not ready for capture');
      return null;
    }

    const video = videoRef.current;
    
    // Check if video is ready
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      console.warn('Video not ready for capture, readyState:', video.readyState);
      return null;
    }

    try {
      const canvas = document.createElement('canvas');
      
      // Use actual video dimensions
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get canvas context');
        return null;
      }
      
      // Draw the video frame to canvas (flip horizontally to match preview)
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      
      // Convert to data URL with high quality
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      
      console.log('Image captured successfully, data URL length:', dataUrl.length);
      
      // Clean up
      canvas.remove();
      
      return dataUrl;
    } catch (error) {
      console.error('Error capturing image:', error);
      return null;
    }
  }, [cameraState.isActive, cameraState.isReadyForCapture]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraState.stream) {
        console.log('Cleaning up camera stream on unmount');
        cameraState.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraState.stream]);

  return {
    cameraState,
    videoRef,
    startCamera,
    stopCamera,
    captureImage
  };
};