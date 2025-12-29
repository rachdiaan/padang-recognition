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

      // Try different constraint configurations for better compatibility
      const constraints = [
        // High quality for desktop
        {
          video: {
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            facingMode: { ideal: 'environment' },
            frameRate: { ideal: 30 }
          },
          audio: false
        },
        // Medium quality fallback
        {
          video: {
            width: { ideal: 640, max: 1280 },
            height: { ideal: 480, max: 720 },
            facingMode: 'environment',
            frameRate: { ideal: 24 }
          },
          audio: false
        },
        // Basic fallback for older devices
        {
          video: {
            width: 640,
            height: 480,
            facingMode: 'environment'
          },
          audio: false
        },
        // Minimal fallback
        video: {
          facingMode: 'environment'
        },
        audio: false
      ];

      let stream: MediaStream | null = null;
      let lastError: Error | null = null;

      // Try each constraint configuration until one works
      for (let i = 0; i < constraints.length; i++) {
        try {
          console.log(`Trying camera constraints ${i + 1}/${constraints.length}:`, constraints[i]);
          stream = await navigator.mediaDevices.getUserMedia(constraints[i]);
          console.log('Camera stream obtained successfully with constraints', i + 1);
          break;
        } catch (error) {
          console.warn(`Camera constraints ${i + 1} failed:`, error);
          lastError = error as Error;
          if (i === constraints.length - 1) {
            throw lastError;
          }
        }
      }

      if (!stream) {
        throw new Error('Failed to obtain camera stream with any configuration');
      }

      console.log('Camera stream obtained successfully');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video metadata to load with timeout
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Video metadata loading timeout'));
          }, 10000);

          const video = videoRef.current!;
          
          const onLoadedMetadata = () => {
            console.log('Video metadata loaded');
            clearTimeout(timeout);
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            resolve();
          };
          
          const onError = (e: Event) => {
            console.error('Video error:', e);
            clearTimeout(timeout);
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            reject(new Error('Failed to load video'));
          };
          
          video.addEventListener('loadedmetadata', onLoadedMetadata);
          video.addEventListener('error', onError);

          // Also check if metadata is already loaded
          if (video.readyState >= video.HAVE_METADATA) {
            clearTimeout(timeout);
            resolve();
          }
        });
        
        // Start playing the video
        console.log('Starting video playback...');
        try {
          await videoRef.current.play();
        } catch (playError) {
          console.warn('Video play failed, trying with muted:', playError);
          videoRef.current.muted = true;
          await videoRef.current.play();
        }
        console.log('Video is now playing');
        
        // Wait for video to be ready for capture with timeout
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(() => {
            console.log('Video readiness timeout, proceeding anyway');
            resolve();
          }, 5000);

          const video = videoRef.current!;
          
          const checkReadiness = () => {
            if (video.readyState >= video.HAVE_ENOUGH_DATA) {
              console.log('Video is ready for capture');
              clearTimeout(timeout);
              resolve();
            } else {
              // Check again in 100ms
              setTimeout(checkReadiness, 100);
            }
          };
          
          // Also listen for canplaythrough event as backup
          const onCanPlayThrough = () => {
            console.log('Video canplaythrough event fired');
            clearTimeout(timeout);
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
        } else if (error.name === 'OverconstrainedError') {
          errorMessage += 'Camera constraints not supported. Trying with basic settings...';
          // Retry with minimal constraints
          setTimeout(() => {
            startCamera();
          }, 1000);
          return;
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
      videoRef.current.load(); // Reset video element
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
    if (video.readyState < video.HAVE_CURRENT_DATA) {
      console.warn('Video not ready for capture, readyState:', video.readyState);
      // Try anyway if video dimensions are available
      if (!video.videoWidth || !video.videoHeight) {
        return null;
      }
    }

    try {
      const canvas = document.createElement('canvas');
      
      // Use actual video dimensions
      const width = video.videoWidth || video.clientWidth || 640;
      const height = video.videoHeight || video.clientHeight || 480;
      
      canvas.width = width;
      canvas.height = height;
      
      console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get canvas context');
        return null;
      }
      
      // Save context state
      ctx.save();
      
      // Draw the video frame to canvas (flip horizontally to match preview)
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      
      // Restore context state
      ctx.restore();
      
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