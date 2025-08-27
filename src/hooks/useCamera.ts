import { useState, useRef, useCallback, useEffect } from 'react';
import { CameraState } from '../types/food';

export const useCamera = () => {
  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false,
    stream: null,
    error: null
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setCameraState(prev => ({ ...prev, error: null }));
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: { ideal: 'environment' }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise<void>((resolve) => {
          const video = videoRef.current!;
          const onLoadedMetadata = () => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            resolve();
          };
          video.addEventListener('loadedmetadata', onLoadedMetadata);
        });
        
        await videoRef.current.play();
      }

      setCameraState({
        isActive: true,
        stream,
        error: null
      });
    } catch (error) {
      console.error('Camera error:', error);
      setCameraState({
        isActive: false,
        stream: null,
        error: error instanceof Error ? error.message : 'Failed to access camera. Please check permissions and try again.'
      });
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach(track => track.stop());
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraState({
      isActive: false,
      stream: null,
      error: null
    });
  }, [cameraState.stream]);

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !cameraState.isActive) return null;

    const video = videoRef.current;
    
    // Check if video is ready
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      console.warn('Video not ready for capture');
      return null;
    }

    const canvas = document.createElement('canvas');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // Draw the video frame to canvas
    ctx.drawImage(video, 0, 0);
    
    // Convert to data URL with high quality
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    // Clean up
    canvas.remove();
    
    return dataUrl;
  }, [cameraState.isActive]);

  useEffect(() => {
    return () => {
      if (cameraState.stream) {
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