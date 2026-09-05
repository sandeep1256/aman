import React from 'react';
import { FrameShape } from '../../types';

interface GlassesOverlayProps {
  shape: FrameShape | string;
  colorHex: string;
  lensTint?: 'clear' | 'sun_dark' | 'blue_filter' | 'amber' | 'emerald' | 'gradient';
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  yaw?: number; // 3D head horizontal turn (-45 to 45 deg)
  pitch?: number; // 3D vertical nod (-30 to 30 deg)
  glintPosition?: number; // Dynamic light glint offset (0 to 100)
}

export const GlassesOverlay: React.FC<GlassesOverlayProps> = ({
  shape,
  colorHex = '#1E293B',
  lensTint = 'clear',
  width = '100%',
  className = '',
  style = {},
  yaw = 0,
  pitch = 0,
  glintPosition = 50
}) => {
  const normalizedShape = (shape || 'Round').toLowerCase();

  // Dynamic glare offset based on yaw/pitch and glint
  const glareShiftX = (yaw * 2.5) + (glintPosition - 50) * 0.8;
  const glareShiftY = (pitch * 1.5);

  // Dynamic 3D shadow and perspective
  const shadowX = -yaw * 0.4;
  const shadowY = 8 + pitch * 0.3;
  const shadowBlur = 12 + Math.abs(yaw) * 0.2;

  // 3D perspective style with dynamic lighting
  const perspectiveTransformStyle: React.CSSProperties = {
    transform: `perspective(850px) rotateY(${yaw}deg) rotateX(${-pitch}deg) translateZ(${Math.abs(yaw) * 0.5}px)`,
    transformStyle: 'preserve-3d',
    filter: `drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.4))`,
    willChange: 'transform',
    ...style
  };

  // Determine lens fill gradient/color
  const getLensFill = () => {
    switch (lensTint) {
      case 'sun_dark':
        return 'url(#sunDarkGrad)';
      case 'blue_filter':
        return 'url(#blueFilterGrad)';
      case 'amber':
        return 'url(#amberGrad)';
      case 'emerald':
        return 'url(#emeraldGrad)';
      case 'gradient':
        return 'url(#stylishGrad)';
      case 'clear':
      default:
        return 'url(#clearLensGrad)';
    }
  };

  return (
    <svg
      viewBox="0 0 400 160"
      width={width}
      className={`select-none pointer-events-none drop-shadow-2xl transition-all duration-75 ${className}`}
      style={perspectiveTransformStyle}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients for realistic lenses */}
        <linearGradient id="clearLensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.15" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.22" />
        </linearGradient>

        <linearGradient id="blueFilterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.38" />
          <stop offset="35%" stopColor="#60A5FA" stopOpacity="0.22" />
          <stop offset="70%" stopColor="#93C5FD" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.35" />
        </linearGradient>

        <linearGradient id="sunDarkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" stopOpacity="0.92" />
          <stop offset="60%" stopColor="#1E293B" stopOpacity="0.86" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.8" />
        </linearGradient>

        <linearGradient id="amberGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78350F" stopOpacity="0.88" />
          <stop offset="50%" stopColor="#B45309" stopOpacity="0.78" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0.68" />
        </linearGradient>

        <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#064E3B" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#047857" stopOpacity="0.75" />
        </linearGradient>

        <linearGradient id="stylishGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4C1D95" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#BE185D" stopOpacity="0.7" />
        </linearGradient>

        {/* Frame Material Luster */}
        <linearGradient id="frameLuster" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colorHex} />
          <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="70%" stopColor={colorHex} />
          <stop offset="100%" stopColor={colorHex} />
        </linearGradient>

        {/* Dynamic Lens reflection streak that moves with head yaw/pitch */}
        <linearGradient id="glareStreak" x1={`${Math.max(0, 10 + glareShiftX * 0.5)}%`} y1={`${Math.max(0, 10 + glareShiftY * 0.5)}%`} x2={`${Math.min(100, 90 + glareShiftX * 0.5)}%`} y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* RENDER SHAPE SPECIFIC FRAMES */}
      {normalizedShape.includes('aviator') && (
        <g id="aviator-frame">
          {/* Top Brow Bar */}
          <path
            d="M 50 48 Q 200 42 350 48"
            fill="none"
            stroke={colorHex}
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Bridge */}
          <path
            d="M 175 75 Q 200 68 225 75"
            fill="none"
            stroke={colorHex}
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Left Lens + Rim (Teardrop) */}
          <path
            d="M 55 58 C 70 56, 160 56, 175 66 C 185 85, 175 135, 125 142 C 75 142, 45 110, 45 80 C 45 66, 48 60, 55 58 Z"
            fill={getLensFill()}
            stroke={colorHex}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Right Lens + Rim (Teardrop) */}
          <path
            d="M 345 58 C 330 56, 240 56, 225 66 C 215 85, 225 135, 275 142 C 325 142, 355 110, 355 80 C 355 66, 352 60, 345 58 Z"
            fill={getLensFill()}
            stroke={colorHex}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Glare Reflections */}
          <path d="M 65 65 L 140 65 L 90 125 L 60 100 Z" fill="url(#glareStreak)" opacity="0.6" />
          <path d="M 260 65 L 335 65 L 285 125 L 255 100 Z" fill="url(#glareStreak)" opacity="0.6" />
          {/* Temples */}
          <path d="M 45 65 L 10 50" stroke={colorHex} strokeWidth="5" strokeLinecap="round" />
          <path d="M 355 65 L 390 50" stroke={colorHex} strokeWidth="5" strokeLinecap="round" />
        </g>
      )}

      {normalizedShape.includes('round') && (
        <g id="round-frame">
          {/* Bridge Keyhole */}
          <path
            d="M 170 78 Q 200 65 230 78"
            fill="none"
            stroke={colorHex}
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Left Round Rim & Lens */}
          <ellipse
            cx="110"
            cy="88"
            rx="64"
            ry="54"
            fill={getLensFill()}
            stroke={colorHex}
            strokeWidth="9"
          />
          {/* Right Round Rim & Lens */}
          <ellipse
            cx="290"
            cy="88"
            rx="64"
            ry="54"
            fill={getLensFill()}
            stroke={colorHex}
            strokeWidth="9"
          />
          {/* Glare */}
          <ellipse cx="95" cy="75" rx="35" ry="25" fill="url(#glareStreak)" opacity="0.5" transform="rotate(-20 95 75)" />
          <ellipse cx="275" cy="75" rx="35" ry="25" fill="url(#glareStreak)" opacity="0.5" transform="rotate(-20 275 75)" />
          {/* Temple Hinges */}
          <circle cx="46" cy="85" r="4" fill="#E2E8F0" />
          <circle cx="354" cy="85" r="4" fill="#E2E8F0" />
          <path d="M 46 85 L 10 75" stroke={colorHex} strokeWidth="6" strokeLinecap="round" />
          <path d="M 354 85 L 390 75" stroke={colorHex} strokeWidth="6" strokeLinecap="round" />
        </g>
      )}

      {normalizedShape.includes('hexagonal') && (
        <g id="hexagonal-frame">
          {/* Bridge */}
          <path d="M 172 80 Q 200 70 228 80" fill="none" stroke={colorHex} strokeWidth="5" strokeLinecap="round" />
          {/* Left Hexagon */}
          <polygon
            points="70,55 150,55 174,88 150,126 70,126 46,88"
            fill={getLensFill()}
            stroke={colorHex}
            strokeWidth="7"
            strokeLinejoin="round"
          />
          {/* Right Hexagon */}
          <polygon
            points="250,55 330,55 354,88 330,126 250,126 226,88"
            fill={getLensFill()}
            stroke={colorHex}
            strokeWidth="7"
            strokeLinejoin="round"
          />
          {/* Diagonal reflections */}
          <path d="M 60 70 L 140 70 L 100 120 Z" fill="url(#glareStreak)" opacity="0.5" />
          <path d="M 240 70 L 320 70 L 280 120 Z" fill="url(#glareStreak)" opacity="0.5" />
          {/* Temples */}
          <path d="M 46 88 L 10 75" stroke={colorHex} strokeWidth="5" strokeLinecap="round" />
          <path d="M 354 88 L 390 75" stroke={colorHex} strokeWidth="5" strokeLinecap="round" />
        </g>
      )}

      {normalizedShape.includes('cateye') || normalizedShape.includes('cat-eye') && (
        <g id="cateye-frame">
          {/* Bridge */}
          <path d="M 170 78 Q 200 68 230 78" fill="none" stroke={colorHex} strokeWidth="7" strokeLinecap="round" />
          {/* Left Winged Cat Eye */}
          <path
            d="M 38 48 C 80 50, 160 62, 172 78 C 172 108, 145 135, 105 135 C 65 135, 48 105, 42 75 Z"
            fill={getLensFill()}
            stroke={colorHex}
            strokeWidth="9"
            strokeLinejoin="round"
          />
          {/* Right Winged Cat Eye */}
          <path
            d="M 362 48 C 320 50, 240 62, 228 78 C 228 108, 255 135, 295 135 C 335 135, 352 105, 358 75 Z"
            fill={getLensFill()}
            stroke={colorHex}
            strokeWidth="9"
            strokeLinejoin="round"
          />
          {/* Luxe Metal Accents on upper corners */}
          <circle cx="48" cy="56" r="3" fill="#FBBF24" />
          <circle cx="352" cy="56" r="3" fill="#FBBF24" />
          {/* Temples */}
          <path d="M 38 48 L 10 38" stroke={colorHex} strokeWidth="7" strokeLinecap="round" />
          <path d="M 362 48 L 390 38" stroke={colorHex} strokeWidth="7" strokeLinecap="round" />
        </g>
      )}

      {normalizedShape.includes('browline') && (
        <g id="browline-frame">
          {/* Thick Upper Acetate Brow */}
          <path
            d="M 40 65 Q 110 52 175 68 L 175 75 Q 110 62 45 75 Z"
            fill={colorHex}
          />
          <path
            d="M 360 65 Q 290 52 225 68 L 225 75 Q 290 62 355 75 Z"
            fill={colorHex}
          />
          {/* Golden Bridge */}
          <path d="M 175 72 Q 200 60 225 72" fill="none" stroke="#D4AF37" strokeWidth="5" strokeLinecap="round" />
          {/* Left Lens Rim (Metal Wire bottom) */}
          <rect
            x="48"
            y="65"
            width="122"
            height="68"
            rx="16"
            fill={getLensFill()}
            stroke="#D4AF37"
            strokeWidth="4"
          />
          {/* Right Lens Rim (Metal Wire bottom) */}
          <rect
            x="230"
            y="65"
            width="122"
            height="68"
            rx="16"
            fill={getLensFill()}
            stroke="#D4AF37"
            strokeWidth="4"
          />
          {/* Temples */}
          <path d="M 40 65 L 10 55" stroke={colorHex} strokeWidth="7" strokeLinecap="round" />
          <path d="M 360 65 L 390 55" stroke={colorHex} strokeWidth="7" strokeLinecap="round" />
        </g>
      )}

      {/* Default Wayfarer / Rectangle Frame */}
      {!normalizedShape.includes('aviator') &&
       !normalizedShape.includes('round') &&
       !normalizedShape.includes('hexagonal') &&
       !normalizedShape.includes('cateye') &&
       !normalizedShape.includes('cat-eye') &&
       !normalizedShape.includes('browline') && (
        <g id="wayfarer-rectangle-frame">
          {/* Bridge */}
          <path
            d="M 170 76 Q 200 68 230 76"
            fill="none"
            stroke={colorHex}
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Left Lens & Rim */}
          <rect
            x="45"
            y="58"
            width="125"
            height="72"
            rx="18"
            fill={getLensFill()}
            stroke={colorHex}
            strokeWidth="10"
          />
          {/* Right Lens & Rim */}
          <rect
            x="230"
            y="58"
            width="125"
            height="72"
            rx="18"
            fill={getLensFill()}
            stroke={colorHex}
            strokeWidth="10"
          />
          {/* Glare Reflection */}
          <path d="M 60 70 L 140 70 L 100 120 Z" fill="url(#glareStreak)" opacity="0.5" />
          <path d="M 245 70 L 325 70 L 285 120 Z" fill="url(#glareStreak)" opacity="0.5" />
          {/* Rivets */}
          <circle cx="54" cy="68" r="2.5" fill="#E2E8F0" />
          <circle cx="346" cy="68" r="2.5" fill="#E2E8F0" />
          {/* Temples */}
          <path d="M 45 68 L 10 55" stroke={colorHex} strokeWidth="8" strokeLinecap="round" />
          <path d="M 355 68 L 390 55" stroke={colorHex} strokeWidth="8" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};
