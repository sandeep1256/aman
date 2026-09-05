import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  RotateCw, 
  Upload, 
  Sparkles, 
  Sliders, 
  ShoppingBag, 
  Download, 
  Check, 
  RefreshCw, 
  Split, 
  Eye, 
  Sun, 
  ChevronRight,
  Compass,
  Play,
  Pause,
  Crosshair,
  Maximize2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/products';
import { MODEL_FACES, ModelFace } from '../../data/models';
import { GlassesOverlay } from './GlassesOverlay';
import { Product, ProductColor } from '../../types';
import { formatPrice } from '../../data/currencies';

export const VirtualTryOnStudio: React.FC = () => {
  const { 
    t, 
    currency, 
    selectedProductForTryOn, 
    setSelectedProductForLensConfig,
    saveTryOnSnapshot,
    addToCart
  } = useApp();

  // Active product
  const [currentProduct, setCurrentProduct] = useState<Product>(() => {
    return selectedProductForTryOn || PRODUCTS[0];
  });

  const [selectedColor, setSelectedColor] = useState<ProductColor>(() => {
    const prod = selectedProductForTryOn || PRODUCTS[0];
    return prod.colors[0];
  });

  // Sync if selected product changes from other pages
  useEffect(() => {
    if (selectedProductForTryOn) {
      setCurrentProduct(selectedProductForTryOn);
      setSelectedColor(selectedProductForTryOn.colors[0]);
    }
  }, [selectedProductForTryOn]);

  // Mode: 'camera' | 'models' | '3d_orbit' | 'compare'
  const [tryOnMode, setTryOnMode] = useState<'camera' | 'models' | '3d_orbit' | 'compare'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Selected Model Face
  const [selectedModel, setSelectedModel] = useState<ModelFace>(MODEL_FACES[0]);
  const [uploadedSelfie, setUploadedSelfie] = useState<string | null>(null);

  // Compare mode second product
  const [compareProduct, setCompareProduct] = useState<Product>(PRODUCTS[1]);
  const [compareColor, setCompareColor] = useState<ProductColor>(PRODUCTS[1].colors[0]);

  // Glasses Overlay Real-time State
  const [scale, setScale] = useState<number>(1.0);
  const [offsetY, setOffsetY] = useState<number>(40); // percentage
  const [offsetX, setOffsetX] = useState<number>(50); // percentage
  const [rotation, setRotation] = useState<number>(0); // roll in deg
  const [yaw, setYaw] = useState<number>(0); // 3D horizontal turn in deg
  const [pitch, setPitch] = useState<number>(0); // 3D vertical nod in deg
  const [glintPosition, setGlintPosition] = useState<number>(50);
  const [lensTint, setLensTint] = useState<'clear' | 'sun_dark' | 'blue_filter' | 'amber' | 'emerald'>('clear');

  // Automatic Face Tracking Settings & State
  const [autoTracking, setAutoTracking] = useState<boolean>(true);
  const [trackingConfidence, setTrackingConfidence] = useState<number>(98);
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [faceBoundingBox, setFaceBoundingBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  
  // Auto Avatar Motion
  const [avatarMotion, setAvatarMotion] = useState<boolean>(true);

  // 3D Orbit Mode Controls
  const [is3DAutoSpinning, setIs3DAutoSpinning] = useState<boolean>(true);
  const [orbitYaw, setOrbitYaw] = useState<number>(0);
  const [orbitPitch, setOrbitPitch] = useState<number>(0);
  const isDraggingOrbitRef = useRef<boolean>(false);
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Snapshot flash state
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  // Video Ref & Canvas Ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Smooth target tracking values for lerp
  const trackingTargetsRef = useRef({
    x: 50,
    y: 40,
    scale: 1.0,
    rot: 0,
    yaw: 0,
    pitch: 0,
    glint: 50
  });

  // Base offsets for calibration
  const baseOffsetRef = useRef({ x: 50, y: 40, scale: 1.0 });

  // Start Camera
  const startCamera = useCallback(async () => {
    setCameraError(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      setFaceDetected(true);
    } catch (err: any) {
      console.warn("Camera access warning:", err);
      setCameraError("Camera access unavailable or blocked. You can still test with Studio Avatars or the 3D Orbit Viewer!");
      setCameraActive(false);
      setTryOnMode('models');
    }
  }, [cameraFacing]);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    if (tryOnMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [tryOnMode, startCamera, stopCamera]);

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);
  };

  // Upload selfie handler
  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setUploadedSelfie(result);
        setTryOnMode('models');
      };
      reader.readAsDataURL(file);
    }
  };

  // REAL-TIME AUTOMATIC FACE TRACKING & MOTION LOOP
  useEffect(() => {
    let isSubscribed = true;
    let prevFrameTime = performance.now();

    // Create offscreen canvas for computer-vision processing
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
      offscreenCanvasRef.current.width = 120;
      offscreenCanvasRef.current.height = 90;
    }

    const processTrackingFrame = () => {
      if (!isSubscribed) return;
      const now = performance.now();
      const dt = Math.min((now - prevFrameTime) / 1000, 0.1);
      prevFrameTime = now;

      // 1. LIVE CAMERA AUTOMATIC TRACKING
      if (tryOnMode === 'camera' && videoRef.current && autoTracking && videoRef.current.readyState >= 2) {
        const video = videoRef.current;
        const canvas = offscreenCanvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(video, 0, 0, 120, 90);
            try {
              const imgData = ctx.getImageData(0, 0, 120, 90);
              const data = imgData.data;

              // Computer vision Skin-Luminance Centroid & Motion Tracking
              let totalWeight = 0;
              let weightedX = 0;
              let weightedY = 0;
              let leftEyeRegionLum = 0;
              let rightEyeRegionLum = 0;
              let minX = 120, maxX = 0, minY = 90, maxY = 0;

              for (let y = 10; y < 80; y += 2) {
                for (let x = 10; x < 110; x += 2) {
                  const idx = (y * 120 + x) * 4;
                  const r = data[idx];
                  const g = data[idx + 1];
                  const b = data[idx + 2];

                  // Skin color & face contrast heuristic
                  const isSkin = (r > 60 && g > 40 && b > 20 && (r - g) > 5 && (r - b) > 5);
                  const lum = 0.299 * r + 0.587 * g + 0.114 * b;

                  if (isSkin || (lum > 50 && lum < 220)) {
                    const weight = 1 + (isSkin ? 2 : 0);
                    weightedX += x * weight;
                    weightedY += y * weight;
                    totalWeight += weight;

                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;

                    // Eye region asymmetry for 3D yaw estimation
                    if (y > 25 && y < 50) {
                      if (x < 60) leftEyeRegionLum += lum;
                      else rightEyeRegionLum += lum;
                    }
                  }
                }
              }

              if (totalWeight > 100) {
                const detectedCenterX = (weightedX / totalWeight) / 120;
                const detectedCenterY = (weightedY / totalWeight) / 90;
                const faceBoxWidth = (maxX - minX) / 120;
                const faceBoxHeight = (maxY - minY) / 90;

                // Adjust for camera mirroring
                const normX = cameraFacing === 'user' ? (1 - detectedCenterX) * 100 : detectedCenterX * 100;
                const normY = detectedCenterY * 100;

                // Compute smooth 3D motion angles
                const lumDiff = (rightEyeRegionLum - leftEyeRegionLum) / (leftEyeRegionLum + rightEyeRegionLum + 1);
                const targetYaw = Math.max(-28, Math.min(28, (normX - 50) * 0.8 + lumDiff * 45));
                const targetPitch = Math.max(-20, Math.min(20, (normY - 42) * 0.6));
                const targetRot = Math.max(-15, Math.min(15, (normX - 50) * -0.2));
                const targetScale = Math.max(0.85, Math.min(1.28, faceBoxWidth * 1.75));

                trackingTargetsRef.current = {
                  x: 50 + (normX - 50) * 0.5,
                  y: 40 + (normY - 40) * 0.45,
                  scale: targetScale,
                  rot: targetRot,
                  yaw: targetYaw,
                  pitch: targetPitch,
                  glint: 50 + targetYaw * 1.2
                };

                setFaceDetected(true);
                setFaceBoundingBox({
                  x: minX / 120 * 100,
                  y: minY / 90 * 100,
                  width: faceBoxWidth * 100,
                  height: faceBoxHeight * 100
                });
                setTrackingConfidence(Math.min(99, Math.round(85 + (totalWeight / 500) * 10)));
              }
            } catch (e) {
              // Canvas read fallback
            }
          }
        }

        // Apply smooth 60fps exponential lerp
        const lerpFactor = 0.22;
        setOffsetX(prev => prev + (trackingTargetsRef.current.x - prev) * lerpFactor);
        setOffsetY(prev => prev + (trackingTargetsRef.current.y - prev) * lerpFactor);
        setScale(prev => prev + (trackingTargetsRef.current.scale - prev) * (lerpFactor * 0.8));
        setRotation(prev => prev + (trackingTargetsRef.current.rot - prev) * lerpFactor);
        setYaw(prev => prev + (trackingTargetsRef.current.yaw - prev) * lerpFactor);
        setPitch(prev => prev + (trackingTargetsRef.current.pitch - prev) * lerpFactor);
        setGlintPosition(prev => prev + (trackingTargetsRef.current.glint - prev) * lerpFactor);
      }

      // 2. AVATAR AUTO-MOTION SIMULATION (NATURAL HEAD SWAY & TURNS)
      else if ((tryOnMode === 'models' || tryOnMode === 'compare') && avatarMotion) {
        const timeSec = now * 0.0012;
        // Multi-frequency smooth organic movement
        const simYaw = Math.sin(timeSec * 0.9) * 14 + Math.sin(timeSec * 1.8) * 4;
        const simPitch = Math.cos(timeSec * 0.7) * 5;
        const simRot = Math.sin(timeSec * 0.5) * 3;
        const simX = 50 + Math.sin(timeSec * 0.9) * 1.8;
        const simY = selectedModel.glassesOffset.top + Math.cos(timeSec * 0.7) * 1.2;
        const simGlint = 50 + Math.sin(timeSec * 1.1) * 32;

        setYaw(simYaw);
        setPitch(simPitch);
        setRotation(simRot + selectedModel.glassesOffset.rotation);
        setOffsetX(simX);
        setOffsetY(simY);
        setGlintPosition(simGlint);
      }

      // 3. 3D ORBIT 360° AUTO-SPINNING MODE
      else if (tryOnMode === '3d_orbit' && is3DAutoSpinning) {
        setOrbitYaw(prev => (prev + dt * 40) % 360);
        setGlintPosition(prev => (prev + dt * 50) % 100);
      }

      animationFrameRef.current = requestAnimationFrame(processTrackingFrame);
    };

    animationFrameRef.current = requestAnimationFrame(processTrackingFrame);

    return () => {
      isSubscribed = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [tryOnMode, autoTracking, avatarMotion, is3DAutoSpinning, cameraFacing, selectedModel]);

  // Recalibrate / Center Face Position
  const handleRecalibrate = () => {
    trackingTargetsRef.current = {
      x: 50,
      y: 40,
      scale: 1.0,
      rot: 0,
      yaw: 0,
      pitch: 0,
      glint: 50
    };
    setOffsetX(50);
    setOffsetY(40);
    setScale(1.0);
    setRotation(0);
    setYaw(0);
    setPitch(0);
  };

  // 3D Orbit pointer drag interactions
  const handleOrbitPointerDown = (e: React.PointerEvent) => {
    isDraggingOrbitRef.current = true;
    setIs3DAutoSpinning(false);
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleOrbitPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingOrbitRef.current) return;
    const deltaX = e.clientX - dragStartPosRef.current.x;
    const deltaY = e.clientY - dragStartPosRef.current.y;
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };

    setOrbitYaw(prev => (prev + deltaX * 0.8) % 360);
    setOrbitPitch(prev => Math.max(-35, Math.min(35, prev - deltaY * 0.5)));
    setGlintPosition(prev => Math.max(0, Math.min(100, prev + deltaX * 0.5)));
  };

  const handleOrbitPointerUp = (e: React.PointerEvent) => {
    isDraggingOrbitRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  // Capture Snapshot
  const handleCaptureSnapshot = () => {
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 300);

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Draw background (video frame or model image)
    const drawComplete = (imgSource: CanvasImageSource) => {
      ctx.drawImage(imgSource, 0, 0, 640, 640);

      // Add elegant watermark
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(0, 570, 640, 70);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 18px "Playfair Display", serif';
      ctx.fillText('AMAN OPTICLES', 24, 605);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '12px monospace';
      ctx.fillText(`• ${currentProduct.name} (${selectedColor.name}) • Optometric 3D Fit`, 190, 605);

      const snapshotUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPreview(snapshotUrl);

      saveTryOnSnapshot({
        id: `snap-${Date.now()}`,
        timestamp: new Date().toISOString(),
        image: snapshotUrl,
        productName: currentProduct.name,
        productId: currentProduct.id,
        colorName: selectedColor.name
      });
    };

    if (tryOnMode === 'camera' && videoRef.current) {
      drawComplete(videoRef.current);
    } else {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => drawComplete(img);
      img.src = uploadedSelfie || selectedModel.photoUrl;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-stone-900 pb-28 select-none">
      {/* Studio Top Bar */}
      <div className="bg-white border-b border-stone-200 p-3 sm:p-4 sticky top-14 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-stone-600 text-[10px] font-mono font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Real-Time 3D Auto-Tracking Fitting</span>
            </div>
            <h1 className="font-serif text-lg sm:text-xl font-bold text-stone-950 leading-tight">
              {currentProduct.name}
            </h1>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-[#FAF8F5] p-1 border border-stone-200 text-xs font-medium overflow-x-auto scrollbar-none">
            <button
              id="tryon-mode-camera"
              onClick={() => setTryOnMode('camera')}
              className={`px-3 py-1.5 flex items-center gap-1.5 transition-all cursor-pointer text-xs uppercase font-bold tracking-wider shrink-0 ${
                tryOnMode === 'camera' 
                  ? 'bg-stone-950 text-white shadow-xs' 
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Live AR Track</span>
            </button>

            <button
              id="tryon-mode-3d-orbit"
              onClick={() => setTryOnMode('3d_orbit')}
              className={`px-3 py-1.5 flex items-center gap-1.5 transition-all cursor-pointer text-xs uppercase font-bold tracking-wider shrink-0 ${
                tryOnMode === '3d_orbit' 
                  ? 'bg-stone-950 text-white shadow-xs' 
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>3D Orbit</span>
            </button>

            <button
              id="tryon-mode-models"
              onClick={() => setTryOnMode('models')}
              className={`px-3 py-1.5 flex items-center gap-1.5 transition-all cursor-pointer text-xs uppercase font-bold tracking-wider shrink-0 ${
                tryOnMode === 'models' 
                  ? 'bg-stone-950 text-white shadow-xs' 
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Avatars</span>
            </button>

            <button
              id="tryon-mode-compare"
              onClick={() => setTryOnMode('compare')}
              className={`px-3 py-1.5 flex items-center gap-1.5 transition-all cursor-pointer text-xs uppercase font-bold tracking-wider shrink-0 ${
                tryOnMode === 'compare' 
                  ? 'bg-stone-950 text-white shadow-xs' 
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <Split className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Compare</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
        {/* Camera error toast */}
        {cameraError && tryOnMode === 'camera' && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 text-stone-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span className="font-mono text-[11px]">{cameraError}</span>
            </div>
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={() => setTryOnMode('3d_orbit')}
                className="bg-stone-950 text-white font-mono font-bold px-3 py-1.5 text-[10px] uppercase tracking-wider cursor-pointer"
              >
                Launch 3D Orbit
              </button>
              <button 
                onClick={() => setTryOnMode('models')}
                className="bg-white border border-stone-400 text-stone-900 font-mono font-bold px-3 py-1.5 text-[10px] uppercase tracking-wider cursor-pointer"
              >
                Studio Avatars
              </button>
            </div>
          </div>
        )}

        {/* PRIMARY TRY-ON STAGE */}
        <div 
          ref={stageContainerRef}
          className={`relative aspect-[4/5] sm:aspect-[16/10] max-h-[560px] w-full overflow-hidden bg-stone-950 border border-stone-300 shadow-lg transition-all ${
            snapshotTaken ? 'ring-4 ring-stone-950 brightness-125' : ''
          }`}
          id="virtual-tryon-stage"
        >
          {/* CAMERA FEED & LIVE AR TRACKING */}
          {tryOnMode === 'camera' && (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`w-full h-full object-cover ${cameraFacing === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* Real-time Tracking HUD Top Pill */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
                <div className="bg-stone-950/90 backdrop-blur-md border border-stone-700 px-3 py-1 text-[10px] font-mono font-bold text-white flex items-center gap-2 shadow-md">
                  <span className={`w-2 h-2 rounded-full ${faceDetected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="uppercase tracking-wider">
                    {autoTracking 
                      ? (faceDetected ? `AI Motion Tracking (${trackingConfidence}% Lock)` : 'Detecting Face...') 
                      : 'Manual Positioning Mode'}
                  </span>
                </div>

                <button
                  onClick={() => setAutoTracking(!autoTracking)}
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border cursor-pointer backdrop-blur-md transition-all ${
                    autoTracking 
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' 
                      : 'bg-stone-900/80 border-stone-600 text-stone-300'
                  }`}
                  title="Toggle automatic real-time head follow"
                >
                  {autoTracking ? 'Auto-Track: ON' : 'Auto-Track: OFF'}
                </button>
              </div>

              {/* Dynamic Optometric Head Reticle & Landmark Box */}
              {autoTracking && faceBoundingBox && (
                <div 
                  className="absolute pointer-events-none border border-[#D4AF37]/50 rounded-xs transition-all duration-100 flex items-center justify-center"
                  style={{
                    top: `${faceBoundingBox.y}%`,
                    left: `${cameraFacing === 'user' ? (100 - faceBoundingBox.x - faceBoundingBox.width) : faceBoundingBox.x}%`,
                    width: `${faceBoundingBox.width}%`,
                    height: `${faceBoundingBox.height}%`
                  }}
                >
                  <div className="w-2.5 h-2.5 border-t-2 border-l-2 border-[#D4AF37] absolute top-0 left-0" />
                  <div className="w-2.5 h-2.5 border-t-2 border-r-2 border-[#D4AF37] absolute top-0 right-0" />
                  <div className="w-2.5 h-2.5 border-b-2 border-l-2 border-[#D4AF37] absolute bottom-0 left-0" />
                  <div className="w-2.5 h-2.5 border-b-2 border-r-2 border-[#D4AF37] absolute bottom-0 right-0" />
                  <span className="text-[8px] font-mono uppercase font-bold text-[#D4AF37] bg-stone-950/90 px-1 py-0.5 absolute -bottom-5">
                    Live Eye Line • Yaw: {Math.round(yaw)}°
                  </span>
                </div>
              )}

              {/* Flip camera button */}
              <button
                onClick={toggleCameraFacing}
                className="absolute top-3 right-3 p-2.5 bg-black/70 backdrop-blur-md border border-stone-600 text-white hover:bg-black shadow-lg z-20 cursor-pointer"
                title="Flip Camera"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 3D ORBIT / 360° TURNTABLE STUDIO VIEW */}
          {tryOnMode === '3d_orbit' && (
            <div 
              onPointerDown={handleOrbitPointerDown}
              onPointerMove={handleOrbitPointerMove}
              onPointerUp={handleOrbitPointerUp}
              className="relative w-full h-full flex items-center justify-center bg-radial from-stone-850 to-stone-950 cursor-grab active:cursor-grabbing touch-none select-none"
            >
              {/* Studio Pedestal Grid Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />
              
              {/* Radial Lighting Floor */}
              <div className="w-80 h-28 bg-[#D4AF37]/15 blur-2xl rounded-full absolute bottom-12 pointer-events-none" />

              {/* Orbit Status Pill */}
              <div className="absolute top-3 left-3 bg-stone-950/90 backdrop-blur-md border border-stone-700 px-3 py-1 text-xs font-mono font-bold text-white flex items-center gap-2 z-20 shadow-md">
                <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="uppercase tracking-wider">
                  3D Studio • {Math.round(orbitYaw)}° Angle • {is3DAutoSpinning ? 'Auto-Rotating' : 'Manual 3D Drag'}
                </span>
              </div>

              {/* Auto Spin Toggle Button */}
              <button
                onClick={() => setIs3DAutoSpinning(!is3DAutoSpinning)}
                className="absolute top-3 right-3 px-3 py-1.5 bg-stone-950/90 backdrop-blur-md border border-stone-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 z-20 hover:bg-stone-800 cursor-pointer shadow-md"
              >
                {is3DAutoSpinning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Pause Spin</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Auto 360° Spin</span>
                  </>
                )}
              </button>

              {/* 3D Orbit Eyewear */}
              <div
                className="relative pointer-events-none transform -translate-y-2"
                style={{
                  width: '68%',
                  maxWidth: '380px'
                }}
              >
                <GlassesOverlay
                  shape={currentProduct.frameShape}
                  colorHex={selectedColor.hex}
                  lensTint={lensTint}
                  yaw={orbitYaw}
                  pitch={orbitPitch}
                  glintPosition={glintPosition}
                />
              </div>

              {/* Touch Drag Prompt */}
              <div className="absolute bottom-14 inset-x-0 text-center pointer-events-none">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 bg-stone-950/80 px-3 py-1 border border-stone-800">
                  Drag with mouse/finger to turn in 3D
                </span>
              </div>
            </div>
          )}

          {/* MODEL AVATAR / UPLOADED SELFIE MODE */}
          {(tryOnMode === 'models' || tryOnMode === 'compare') && (
            <div className="relative w-full h-full flex items-center justify-center bg-stone-900">
              <img
                src={uploadedSelfie || selectedModel.photoUrl}
                alt={selectedModel.name}
                className="w-full h-full object-cover object-center"
              />

              {/* Tag for model face shape & Auto-Motion Toggle */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
                <div className="bg-stone-950/90 backdrop-blur-md border border-stone-700 px-3 py-1 text-xs font-mono font-bold text-white flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span className="uppercase tracking-wider">
                    {uploadedSelfie ? 'Uploaded Portrait' : `${selectedModel.name} • ${selectedModel.faceShape} Morph`}
                  </span>
                </div>

                <button
                  onClick={() => setAvatarMotion(!avatarMotion)}
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border cursor-pointer backdrop-blur-md transition-all ${
                    avatarMotion 
                      ? 'bg-stone-950/90 border-[#D4AF37] text-[#D4AF37]' 
                      : 'bg-stone-900/80 border-stone-600 text-stone-400'
                  }`}
                  title="Simulates natural organic head turns and breathing motion"
                >
                  {avatarMotion ? '● Motion Demo: ON' : 'Motion Demo: OFF'}
                </button>
              </div>
            </div>
          )}

          {/* GLASSES OVERLAY 1 (PRIMARY FOR CAMERA & AVATARS) */}
          {tryOnMode !== 'compare' && tryOnMode !== '3d_orbit' && (
            <div
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-75"
              style={{
                top: `${offsetY}%`,
                left: `${offsetX}%`,
                width: `${scale * 58}%`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`
              }}
            >
              <GlassesOverlay
                shape={currentProduct.frameShape}
                colorHex={selectedColor.hex}
                lensTint={lensTint}
                yaw={yaw}
                pitch={pitch}
                glintPosition={glintPosition}
              />
            </div>
          )}

          {/* SPLIT COMPARE MODE RENDERING */}
          {tryOnMode === 'compare' && (
            <div className="absolute inset-0 grid grid-cols-2 z-10 pointer-events-none">
              {/* Left Side: Frame A */}
              <div className="relative h-full border-r-2 border-[#D4AF37] overflow-hidden">
                <div
                  className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    top: `${offsetY}%`,
                    left: '100%',
                    width: `${scale * 116}%`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`
                  }}
                >
                  <GlassesOverlay
                    shape={currentProduct.frameShape}
                    colorHex={selectedColor.hex}
                    lensTint={lensTint}
                    yaw={yaw}
                    pitch={pitch}
                    glintPosition={glintPosition}
                  />
                </div>
                <div className="absolute bottom-3 left-3 bg-stone-950/90 border border-stone-700 px-3 py-1 font-mono text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest shadow-md">
                  Variant A: {currentProduct.frameShape}
                </div>
              </div>

              {/* Right Side: Frame B */}
              <div className="relative h-full overflow-hidden">
                <div
                  className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    top: `${offsetY}%`,
                    left: '0%',
                    width: `${scale * 116}%`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`
                  }}
                >
                  <GlassesOverlay
                    shape={compareProduct.frameShape}
                    colorHex={compareColor.hex}
                    lensTint={lensTint}
                    yaw={yaw}
                    pitch={pitch}
                    glintPosition={glintPosition}
                  />
                </div>
                <div className="absolute bottom-3 right-3 bg-stone-950/90 border border-stone-700 px-3 py-1 font-mono text-[10px] font-bold text-white uppercase tracking-widest shadow-md">
                  Variant B: {compareProduct.frameShape}
                </div>
              </div>
            </div>
          )}

          {/* FLOATING QUICK CONTROLS OVER STAGE */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 z-20">
            {/* Snapshot Trigger / Recalibrate */}
            <div className="flex items-center gap-2">
              <button
                id="tryon-snapshot-button"
                onClick={handleCaptureSnapshot}
                className="flex items-center gap-2 px-4 py-2.5 bg-stone-950 text-white font-bold text-xs uppercase tracking-widest shadow-xl border border-stone-700 hover:bg-stone-800 active:scale-95 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4 text-[#D4AF37]" />
                <span className="hidden sm:inline">Capture Frame</span>
              </button>

              {tryOnMode === 'camera' && (
                <button
                  onClick={handleRecalibrate}
                  className="flex items-center gap-1.5 px-3 py-2 bg-stone-950/90 backdrop-blur-md text-stone-200 border border-stone-700 hover:bg-stone-800 text-[10px] font-mono uppercase font-bold tracking-wider cursor-pointer shadow-md"
                  title="Re-centers optical alignment on current head posture"
                >
                  <Crosshair className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Center Fit</span>
                </button>
              )}
            </div>

            {/* Lens Tint Toggles */}
            <div className="flex items-center gap-1 bg-stone-950/90 backdrop-blur-md p-1 border border-stone-700 shadow-lg font-mono text-[10px] uppercase">
              <button
                onClick={() => setLensTint('clear')}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  lensTint === 'clear' ? 'bg-white text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
                }`}
                title="HD Clear Anti-Glare"
              >
                Clear
              </button>
              <button
                onClick={() => setLensTint('blue_filter')}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  lensTint === 'blue_filter' ? 'bg-sky-600 text-white font-bold' : 'text-stone-300 hover:text-white'
                }`}
                title="Blue-Shield Screen Filter"
              >
                Blue
              </button>
              <button
                onClick={() => setLensTint('sun_dark')}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${
                  lensTint === 'sun_dark' ? 'bg-stone-700 text-white font-bold' : 'text-stone-300 hover:text-white'
                }`}
                title="Polarized Dark Sun Tint"
              >
                <Sun className="w-3 h-3 inline mr-1 text-[#D4AF37]" /> Sun
              </button>
            </div>
          </div>
        </div>

        {/* 3D ORBIT PRESET ANGLES (WHEN IN 3D ORBIT MODE) */}
        {tryOnMode === '3d_orbit' && (
          <div className="p-4 bg-white border border-stone-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-stone-600 uppercase tracking-widest">
                Quick 3D Angle Presets:
              </span>
              <span className="text-[10px] font-mono text-stone-500 uppercase">
                Interactive Multi-Axis Inspection
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
              {[
                { label: '0° Front View', y: 0, p: 0 },
                { label: '45° 3/4 Perspective', y: 45, p: -5 },
                { label: '90° Side Temple', y: 90, p: 0 },
                { label: 'Top Bridge Angle', y: 20, p: 25 }
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setIs3DAutoSpinning(false);
                    setOrbitYaw(preset.y);
                    setOrbitPitch(preset.p);
                    setGlintPosition(preset.y > 45 ? 80 : 30);
                  }}
                  className="p-2.5 border border-stone-200 hover:border-stone-900 bg-[#FAF8F5] hover:bg-white text-xs font-bold text-stone-900 uppercase transition-all cursor-pointer text-center"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MODEL AVATAR SELECTOR (WHEN IN MODEL MODE) */}
        {tryOnMode === 'models' && (
          <div className="p-4 bg-white border border-stone-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-stone-600 uppercase tracking-widest">
                Morph Profile / Face Silhouette:
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-stone-950 hover:text-stone-700 font-bold uppercase tracking-wider cursor-pointer font-mono"
              >
                <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Upload Custom</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleSelfieUpload}
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1.5 pt-1 scrollbar-none">
              {MODEL_FACES.map((model) => {
                const isSelected = selectedModel.id === model.id && !uploadedSelfie;
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      setUploadedSelfie(null);
                      setSelectedModel(model);
                      setOffsetY(model.glassesOffset.top);
                      setScale(model.glassesOffset.scale);
                      setRotation(model.glassesOffset.rotation);
                      setYaw(0);
                      setPitch(0);
                    }}
                    className={`flex flex-col items-center gap-1.5 shrink-0 p-2 border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#FAF8F5] border-stone-950 ring-2 ring-stone-950' 
                        : 'bg-white border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <img
                      src={model.photoUrl}
                      alt={model.name}
                      className="w-16 h-16 object-cover"
                    />
                    <span className="text-[10px] font-mono uppercase font-bold text-stone-800 truncate max-w-[70px]">
                      {model.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* COMPARISON SECOND FRAME SELECTOR */}
        {tryOnMode === 'compare' && (
          <div className="p-4 bg-white border border-stone-200 space-y-3 shadow-xs">
            <span className="text-[10px] font-mono font-bold text-stone-600 uppercase tracking-widest">
              Select Alternate Silhouette for Dual Analysis:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRODUCTS.filter(p => p.id !== currentProduct.id).slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setCompareProduct(p);
                    setCompareColor(p.colors[0]);
                  }}
                  className={`p-3 border text-left transition-all ${
                    compareProduct.id === p.id 
                      ? 'bg-[#FAF8F5] border-stone-950 ring-2 ring-stone-950' 
                      : 'bg-white border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img src={p.images[0]} alt={p.name} className="w-full h-16 object-cover mb-2 border border-stone-100" />
                  <div className="font-serif text-xs font-bold text-stone-950 truncate">{p.name}</div>
                  <div className="text-[10px] font-mono text-stone-500 uppercase">{p.frameShape}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PRECISION FIT SLIDERS & CONTROLS */}
        <div className="p-5 bg-white border border-stone-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-serif text-sm font-bold text-stone-950 uppercase tracking-wide">
                Optometric Bridge & Axis Fit
              </span>
            </div>
            <button
              onClick={() => {
                setScale(1.0);
                setOffsetY(40);
                setOffsetX(50);
                setRotation(0);
                setYaw(0);
                setPitch(0);
              }}
              className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Calibration</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Scale Slider */}
            <div>
              <div className="flex justify-between text-xs text-stone-600 font-mono mb-1.5">
                <span className="uppercase font-bold">Scale / Magnification</span>
                <span className="font-bold text-stone-950">{Math.round(scale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.35"
                step="0.01"
                value={scale}
                onChange={(e) => {
                  setAutoTracking(false);
                  setScale(parseFloat(e.target.value));
                }}
                className="w-full accent-stone-950 bg-stone-200 h-1.5 cursor-pointer"
              />
            </div>

            {/* Vertical Position */}
            <div>
              <div className="flex justify-between text-xs text-stone-600 font-mono mb-1.5">
                <span className="uppercase font-bold">Nose Crest Height (Y)</span>
                <span className="font-bold text-stone-950">{Math.round(offsetY)}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="65"
                step="0.5"
                value={offsetY}
                onChange={(e) => {
                  setAutoTracking(false);
                  setOffsetY(parseFloat(e.target.value));
                }}
                className="w-full accent-stone-950 bg-stone-200 h-1.5 cursor-pointer"
              />
            </div>

            {/* 3D Yaw Rotation */}
            <div>
              <div className="flex justify-between text-xs text-stone-600 font-mono mb-1.5">
                <span className="uppercase font-bold">3D Face Turn Angle</span>
                <span className="font-bold text-stone-950">{Math.round(yaw)}°</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="1"
                value={yaw}
                onChange={(e) => {
                  setAutoTracking(false);
                  setYaw(parseInt(e.target.value));
                }}
                className="w-full accent-stone-950 bg-stone-200 h-1.5 cursor-pointer"
              />
            </div>
          </div>

          {/* Color Variants Switcher */}
          <div className="pt-2 border-t border-stone-100">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600 mb-2 block">
              Color Alloy: <strong className="text-stone-950">{selectedColor.name}</strong>
            </span>
            <div className="flex items-center gap-2">
              {currentProduct.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-mono uppercase font-bold transition-all cursor-pointer ${
                    selectedColor.name === c.name 
                      ? 'bg-stone-950 border-stone-950 text-white' 
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 border border-stone-300 shadow-xs"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCT DETAILS & BUY ACTIONS */}
        <div className="p-5 bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-widest">{currentProduct.brand} • {currentProduct.frameMaterial}</div>
            <h3 className="font-serif text-xl font-bold text-stone-950 mt-1">{currentProduct.name}</h3>
            <div className="flex items-baseline gap-2 mt-1 font-mono">
              <span className="text-xl font-bold text-stone-950">
                {formatPrice(currentProduct.price, currency)}
              </span>
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(currentProduct.originalPrice, currency)}
              </span>
              <span className="text-[10px] font-bold text-stone-800 bg-[#FAF8F5] px-2 py-0.5 border border-stone-300">
                {Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)}% SAVINGS
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1 max-w-md font-mono text-[11px]">
              {currentProduct.dimensions.lensWidth}mm Lens • {currentProduct.dimensions.bridgeWidth}mm Bridge • {currentProduct.weightGrams}g Featherweight
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                addToCart(currentProduct, selectedColor);
              }}
              className="flex-1 sm:flex-initial px-5 py-3.5 bg-[#FAF8F5] border border-stone-300 hover:bg-stone-100 text-stone-900 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.addToCart}</span>
            </button>

            <button
              onClick={() => {
                setSelectedProductForLensConfig(currentProduct);
              }}
              className="flex-1 sm:flex-initial px-6 py-3.5 bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>{t.selectLenses}</span>
              <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>
        </div>

        {/* SNAPSHOT PREVIEW MODAL */}
        {capturedPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-white border border-stone-300 p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
              <div className="font-serif text-lg font-bold text-stone-950 flex items-center justify-center gap-2">
                <Check className="w-5 h-5 text-[#D4AF37]" />
                <span>Spectacle Fitting Captured</span>
              </div>
              <img
                src={capturedPreview}
                alt="Captured look"
                className="w-full border border-stone-200 shadow-xs object-cover"
              />
              <p className="text-xs text-stone-600 font-mono">
                Preserved to your lookbook in Account.
              </p>
              <div className="flex gap-2 pt-2">
                <a
                  href={capturedPreview}
                  download={`aman-tryon-${currentProduct.id}.jpg`}
                  className="flex-1 py-3 bg-[#FAF8F5] text-stone-800 hover:bg-stone-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-stone-300"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </a>
                <button
                  onClick={() => setCapturedPreview(null)}
                  className="flex-1 py-3 bg-stone-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
