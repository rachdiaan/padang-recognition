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
  const streamRef = useRef<MediaStream | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Advanced camera constraints with progressive fallback
  const getCameraConstraints = useCallback((attempt: number) => {
    const constraints = [
      // Ultra HD - Best quality for desktop
      {
        video: {
          width: { ideal: 1920, max: 3840 },
          height: { ideal: 1080, max: 2160 },
          facingMode: { ideal: 'environment' },
          frameRate: { ideal: 60, min: 30 },
          aspectRatio: { ideal: 16/9 }
        },
        audio: false
      },
      // Full HD - High quality
      {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: { ideal: 'environment' },
          frameRate: { ideal: 30, min: 24 }
        },
        audio: false
      },
      // HD - Standard quality
      {
        video: {
          width: { ideal: 720, max: 1280 },
          height: { ideal: 480, max: 720 },
          facingMode: 'environment',
          frameRate: { ideal: 24, min: 15 }
        },
        audio: false
      },
      // SD - Basic quality
      {
        video: {
          width: 640,
          height: 480,
          facingMode: 'environment'
        },
        audio: false
      },
      // Minimal - Last resort
      {
        video: {
          facingMode: 'environment'
        },
        audio: false
      },
      // Any camera - Ultimate fallback
      {
        video: true,
        audio: false
      }
    ];

    return constraints[Math.min(attempt, constraints.length - 1)];
  }, []);

  // Advanced device detection
  const detectDeviceCapabilities = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isIOS = /ipad|iphone|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isDesktop = !isMobile;
    
    return {
      isMobile,
      isIOS,
      isAndroid,
      isDesktop,
      supportsGetUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      isSecureContext: window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost'
    };
  }, []);

  // Enhanced error message generator
  const getEnhancedErrorMessage = useCallback((error: any, deviceInfo: any) => {
    let message = 'Camera access failed. ';
    let suggestions: string[] = [];

    if (!deviceInfo.supportsGetUserMedia) {
      message += 'Your browser does not support camera access.';
      suggestions.push('Please use a modern browser like Chrome, Firefox, Safari, or Edge');
      return { message, suggestions };
    }

    if (!deviceInfo.isSecureContext) {
      message += 'Camera requires secure connection (HTTPS).';
      suggestions.push('Please access the site via HTTPS or localhost');
      return { message, suggestions };
    }

    switch (error.name) {
      case 'NotAllowedError':
        message += 'Camera permission was denied.';
        suggestions = [
          'Click the camera icon in your browser\'s address bar',
          'Select "Allow" for camera permissions',
          'Refresh the page and try again',
          deviceInfo.isMobile ? 'Check your browser settings for camera permissions' : 'Check browser settings under Privacy & Security'
        ];
        break;
      
      case 'NotFoundError':
        message += 'No camera device found.';
        suggestions = [
          'Make sure your camera is connected and working',
          'Try connecting an external camera if using desktop',
          'Check if other apps are using the camera',
          'Restart your browser and try again'
        ];
        break;
      
      case 'NotReadableError':
        message += 'Camera is being used by another application.';
        suggestions = [
          'Close other apps that might be using the camera',
          'Close other browser tabs with camera access',
          'Restart your browser',
          deviceInfo.isMobile ? 'Close camera or video calling apps' : 'Close video conferencing software'
        ];
        break;
      
      case 'OverconstrainedError':
        message += 'Camera settings not supported by your device.';
        suggestions = [
          'Your camera doesn\'t support the requested quality',
          'The app will automatically try lower quality settings',
          'Please wait while we adjust the camera settings'
        ];
        break;
      
      case 'SecurityError':
        message += 'Camera access blocked for security reasons.';
        suggestions = [
          'Make sure you\'re on a secure connection (HTTPS)',
          'Check if camera access is blocked in browser settings',
          'Try refreshing the page'
        ];
        break;
      
      case 'AbortError':
        message += 'Camera access was interrupted.';
        suggestions = [
          'Please try starting the camera again',
          'Make sure no other app interrupted the process'
        ];
        break;
      
      default:
        message += error.message || 'Unknown camera error occurred.';
        suggestions = [
          'Try refreshing the page',
          'Check your camera permissions',
          'Make sure your camera is working properly',
          'Try using a different browser'
        ];
    }

    // Add device-specific suggestions
    if (deviceInfo.isIOS) {
      suggestions.push('On iOS: Settings > Safari > Camera & Microphone Access');
    } else if (deviceInfo.isAndroid) {
      suggestions.push('On Android: Browser Settings > Site Settings > Camera');
    }

    return { message, suggestions };
  }, []);

  // World-class camera initialization
  const startCamera = useCallback(async () => {
    console.log('🚀 Starting world-class camera system...');
    
    const deviceInfo = detectDeviceCapabilities();
    console.log('📱 Device capabilities:', deviceInfo);

    // Reset state
    setCameraState(prev => ({ ...prev, error: null, isActive: false, isReadyForCapture: false }));
    retryCountRef.current = 0;

    // Pre-flight checks
    if (!deviceInfo.supportsGetUserMedia) {
      const errorInfo = getEnhancedErrorMessage({ name: 'NotSupportedError' }, deviceInfo);
      setCameraState(prev => ({ 
        ...prev, 
        error: `${errorInfo.message}\n\nSuggestions:\n${errorInfo.suggestions.map(s => `• ${s}`).join('\n')}`
      }));
      return;
    }

    if (!deviceInfo.isSecureContext) {
      const errorInfo = getEnhancedErrorMessage({ name: 'SecurityError' }, deviceInfo);
      setCameraState(prev => ({ 
        ...prev, 
        error: `${errorInfo.message}\n\nSuggestions:\n${errorInfo.suggestions.map(s => `• ${s}`).join('\n')}`
      }));
      return;
    }

    // Progressive camera initialization with retries
    const attemptCameraAccess = async (attemptNumber: number): Promise<MediaStream> => {
      console.log(`📹 Camera attempt ${attemptNumber + 1}/${maxRetries + 1}`);
      
      const constraints = getCameraConstraints(attemptNumber);
      console.log('🎛️ Using constraints:', constraints);

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('✅ Camera stream obtained successfully');
        
        // Validate stream
        if (!stream || stream.getTracks().length === 0) {
          throw new Error('Invalid stream received');
        }

        const videoTrack = stream.getVideoTracks()[0];
        if (!videoTrack) {
          throw new Error('No video track found in stream');
        }

        console.log('📊 Video track settings:', videoTrack.getSettings());
        return stream;
        
      } catch (error: any) {
        console.warn(`❌ Camera attempt ${attemptNumber + 1} failed:`, error);
        
        if (error.name === 'OverconstrainedError' && attemptNumber < maxRetries) {
          console.log('🔄 Retrying with lower quality settings...');
          return attemptCameraAccess(attemptNumber + 1);
        }
        
        throw error;
      }
    };

    try {
      // Get camera stream with progressive fallback
      const stream = await attemptCameraAccess(0);
      streamRef.current = stream;

      if (!videoRef.current) {
        throw new Error('Video element not available');
      }

      const video = videoRef.current;
      video.srcObject = stream;

      // Enhanced video setup with multiple event listeners
      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          cleanup();
          reject(new Error('Video setup timeout - camera may be slow to initialize'));
        }, 15000); // Increased timeout for slower devices

        let resolved = false;
        const cleanup = () => {
          if (resolved) return;
          resolved = true;
          clearTimeout(timeoutId);
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('canplaythrough', onCanPlayThrough);
          video.removeEventListener('error', onError);
        };

        const onLoadedMetadata = () => {
          console.log('📺 Video metadata loaded');
          console.log(`📐 Video dimensions: ${video.videoWidth}x${video.videoHeight}`);
        };

        const onCanPlay = () => {
          console.log('▶️ Video can start playing');
        };

        const onCanPlayThrough = () => {
          console.log('🎬 Video can play through without buffering');
          cleanup();
          resolve();
        };

        const onError = (e: Event) => {
          console.error('📺 Video error:', e);
          cleanup();
          reject(new Error('Video element failed to load stream'));
        };

        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('canplay', onCanPlay);
        video.addEventListener('canplaythrough', onCanPlayThrough);
        video.addEventListener('error', onError);

        // Fallback resolution for slower devices
        setTimeout(() => {
          if (!resolved && video.readyState >= video.HAVE_CURRENT_DATA) {
            console.log('⏰ Using fallback resolution - video has current data');
            cleanup();
            resolve();
          }
        }, 8000);
      });

      // Start video playback with enhanced error handling
      console.log('▶️ Starting video playback...');
      try {
        await video.play();
        console.log('✅ Video playing successfully');
      } catch (playError: any) {
        console.warn('🔇 Video play failed, trying muted:', playError);
        video.muted = true;
        try {
          await video.play();
          console.log('✅ Video playing muted successfully');
        } catch (mutedError) {
          console.warn('⚠️ Muted play also failed, but continuing:', mutedError);
          // Continue anyway - some browsers are strict about autoplay
        }
      }

      // Wait for video to be ready for capture with smart detection
      await new Promise<void>((resolve) => {
        const timeoutId = setTimeout(() => {
          console.log('⏰ Video readiness timeout, but proceeding anyway');
          resolve();
        }, 10000);

        const checkReadiness = () => {
          const isReady = video.readyState >= video.HAVE_CURRENT_DATA && 
                          video.videoWidth > 0 && 
                          video.videoHeight > 0;
          
          if (isReady) {
            console.log('✅ Video is ready for capture');
            console.log(`📊 Final video state: ${video.videoWidth}x${video.videoHeight}, readyState: ${video.readyState}`);
            clearTimeout(timeoutId);
            resolve();
          } else {
            setTimeout(checkReadiness, 200);
          }
        };

        checkReadiness();
      });

      // Success! Update state
      setCameraState({
        isActive: true,
        isReadyForCapture: true,
        stream,
        error: null
      });

      console.log('🎉 Camera system initialized successfully!');

    } catch (error: any) {
      console.error('💥 Camera initialization failed:', error);
      
      // Clean up any partial stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      const errorInfo = getEnhancedErrorMessage(error, deviceInfo);
      setCameraState({
        isActive: false,
        isReadyForCapture: false,
        stream: null,
        error: `${errorInfo.message}\n\nSuggestions:\n${errorInfo.suggestions.map(s => `• ${s}`).join('\n')}`
      });
    }
  }, [detectDeviceCapabilities, getEnhancedErrorMessage, getCameraConstraints]);

  // Enhanced camera stop with complete cleanup
  const stopCamera = useCallback(() => {
    console.log('🛑 Stopping camera system...');
    
    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log(`🔌 Stopping ${track.kind} track`);
        track.stop();
      });
      streamRef.current = null;
    }

    // Clean up video element
    if (videoRef.current) {
      const video = videoRef.current;
      video.pause();
      video.srcObject = null;
      video.load(); // Reset video element completely
      console.log('📺 Video element cleaned up');
    }

    // Reset state
    setCameraState({
      isActive: false,
      isReadyForCapture: false,
      stream: null,
      error: null
    });

    retryCountRef.current = 0;
    console.log('✅ Camera system stopped successfully');
  }, []);

  // World-class image capture with multiple fallbacks
  const captureImage = useCallback((): string | null => {
    console.log('📸 Attempting world-class image capture...');
    
    if (!videoRef.current || !cameraState.isActive) {
      console.error('❌ Video not available or camera not active');
      return null;
    }

    const video = videoRef.current;
    
    // Enhanced readiness check
    const isVideoReady = video.readyState >= video.HAVE_CURRENT_DATA &&
                        video.videoWidth > 0 &&
                        video.videoHeight > 0 &&
                        !video.paused &&
                        !video.ended;

    if (!isVideoReady) {
      console.warn('⚠️ Video not fully ready, but attempting capture anyway');
      console.log(`📊 Video state: readyState=${video.readyState}, dimensions=${video.videoWidth}x${video.videoHeight}, paused=${video.paused}`);
    }

    try {
      // Create high-quality canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { 
        alpha: false, // Better performance for photos
        willReadFrequently: false // Optimize for single capture
      });
      
      if (!ctx) {
        console.error('❌ Failed to get canvas context');
        return null;
      }

      // Use actual video dimensions or fallback to display dimensions
      const width = video.videoWidth || video.clientWidth || 640;
      const height = video.videoHeight || video.clientHeight || 480;
      
      // Set canvas to optimal size
      canvas.width = width;
      canvas.height = height;
      
      console.log(`🎨 Canvas dimensions: ${canvas.width}x${canvas.height}`);
      
      // Configure high-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Save context state
      ctx.save();
      
      // Mirror image horizontally for natural selfie effect
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
      
      // Draw video frame with high quality
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Restore context
      ctx.restore();
      
      // Convert to high-quality JPEG
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      
      console.log(`✅ Image captured successfully! Size: ${(dataUrl.length / 1024).toFixed(1)}KB`);
      
      // Clean up canvas
      canvas.remove();
      
      return dataUrl;
      
    } catch (error) {
      console.error('💥 Image capture failed:', error);
      return null;
    }
  }, [cameraState.isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up camera hook...');
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Monitor stream health
  useEffect(() => {
    if (!streamRef.current) return;

    const stream = streamRef.current;
    const videoTrack = stream.getVideoTracks()[0];
    
    if (!videoTrack) return;

    const handleTrackEnded = () => {
      console.warn('📹 Video track ended unexpectedly');
      setCameraState(prev => ({
        ...prev,
        isActive: false,
        isReadyForCapture: false,
        error: 'Camera connection lost. Please restart the camera.'
      }));
    };

    videoTrack.addEventListener('ended', handleTrackEnded);
    
    return () => {
      videoTrack.removeEventListener('ended', handleTrackEnded);
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