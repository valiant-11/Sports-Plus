import { useState, useRef, useEffect } from 'react';
import { Camera, Eye, AlertCircle, CheckCircle2, X, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';

interface FaceVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  userName: string;
}

type VerificationStep = 'instructions' | 'camera' | 'detecting-face' | 'blink-detection' | 'processing' | 'success' | 'failed';

export function FaceVerificationDialog({ isOpen, onClose, onVerified, userName }: FaceVerificationDialogProps) {
  const [step, setStep] = useState<VerificationStep>('instructions');
  const [blinkCount, setBlinkCount] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(3);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const blinkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    };
  }, []);

  const startCamera = async () => {
    try {
      setStep('camera');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.play();
        setCameraReady(true);
        
        // Start face detection after camera is ready
        setTimeout(() => {
          setStep('detecting-face');
          startFaceDetection();
        }, 1000);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setErrorMessage('Unable to access camera. Please grant camera permissions.');
      setStep('failed');
      toast.error('Camera access denied');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  };

  const startFaceDetection = () => {
    // Simulate face detection (in production, use face-api.js or similar)
    setTimeout(() => {
      // Face detected, start countdown
      setStep('blink-detection');
      startCountdown();
    }, 2000);
  };

  const startCountdown = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          startBlinkDetection();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startBlinkDetection = () => {
    setBlinkCount(0);
    toast.info('Please blink twice naturally');
    
    // Simulate blink detection
    // In production, use face-api.js or similar to detect eye closures
    let detectedBlinks = 0;
    detectionIntervalRef.current = setInterval(() => {
      // Simulate random blink detection
      const blinkDetected = Math.random() > 0.7; // 30% chance per interval
      
      if (blinkDetected) {
        detectedBlinks++;
        setBlinkCount(detectedBlinks);
        toast.success(`Blink ${detectedBlinks} detected!`);
        
        if (detectedBlinks >= 2) {
          if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current);
          }
          handleBlinkComplete();
        }
      }
    }, 1500); // Check every 1.5 seconds

    // Timeout after 15 seconds
    blinkTimerRef.current = setTimeout(() => {
      if (detectedBlinks < 2) {
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
        }
        setErrorMessage('Verification timeout. Please try again.');
        setStep('failed');
        toast.error('Verification failed');
      }
    }, 15000);
  };

  const handleBlinkComplete = () => {
    setStep('processing');
    toast.success('Blinks detected successfully!');
    
    // Simulate processing and verification
    setTimeout(() => {
      setStep('success');
      toast.success('Face verification complete!');
      
      setTimeout(() => {
        stopCamera();
        onVerified();
        onClose();
      }, 2000);
    }, 2000);
  };

  const handleRetry = () => {
    setBlinkCount(0);
    setErrorMessage('');
    if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    setStep('instructions');
    stopCamera();
  };

  const handleClose = () => {
    stopCamera();
    if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    setBlinkCount(0);
    setStep('instructions');
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 'instructions':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-blue-900 font-semibold mb-2">Verification Instructions</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Position your face in the center of the camera</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Ensure good lighting on your face</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Remove glasses or hats if possible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span className="font-semibold">Blink naturally TWICE when prompted</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl p-6 text-white text-center">
              <Eye className="w-16 h-16 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Face Verification</h3>
              <p className="text-white/90 text-sm">We'll verify that you're a real person by detecting your blinks</p>
            </div>

            <Button
              onClick={startCamera}
              className="w-full rounded-2xl py-6 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold"
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Verification
            </Button>
          </div>
        );

      case 'camera':
      case 'detecting-face':
      case 'blink-detection':
        return (
          <div className="space-y-4">
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Face detection overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-80 border-4 border-white/50 rounded-3xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-2xl"></div>
                </div>
              </div>

              {/* Status overlay */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                {step === 'camera' && (
                  <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Initializing camera...</span>
                  </div>
                )}
                {step === 'detecting-face' && (
                  <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Detecting face...</span>
                  </div>
                )}
                {step === 'blink-detection' && countdown > 0 && (
                  <div className="bg-blue-600 backdrop-blur-sm px-6 py-3 rounded-full text-white text-2xl font-bold animate-pulse">
                    {countdown}
                  </div>
                )}
                {step === 'blink-detection' && countdown === 0 && (
                  <div className="bg-green-600 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>Blink twice now! ({blinkCount}/2)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">Blinks Detected:</span>
                <div className="flex items-center gap-1">
                  {[1, 2].map((num) => (
                    <div
                      key={num}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        blinkCount >= num
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {blinkCount >= num ? '✓' : num}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full rounded-2xl"
            >
              Cancel
            </Button>
          </div>
        );

      case 'processing':
        return (
          <div className="text-center py-8 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-blue-100 mx-auto flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Processing...</h3>
              <p className="text-gray-600">Verifying your identity</p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-green-100 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Complete!</h3>
              <p className="text-gray-600">Your identity has been verified successfully</p>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-24 h-24 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4">
                <X className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h3>
              <p className="text-gray-600 mb-4">{errorMessage || 'Unable to verify your identity'}</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full rounded-2xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90%] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            Face Verification
          </DialogTitle>
          <DialogDescription>
            {step === 'instructions' ? 'Verify your identity with face detection' : `Verifying ${userName}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="pt-4">
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}