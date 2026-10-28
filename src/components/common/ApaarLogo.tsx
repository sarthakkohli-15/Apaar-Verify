/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ApaarLogoProps {
  variant?: 'light' | 'dark'; // 'light' for dark backgrounds, 'dark' for white/light backgrounds
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withSubtitle?: boolean;
  iconOnly?: boolean;
  className?: string;
}

export const ApaarLogo: React.FC<ApaarLogoProps> = ({
  variant = 'dark',
  size = 'md',
  withSubtitle = true,
  iconOnly = false,
  className = '',
}) => {
  const isLight = variant === 'light';

  // Dimension mapping
  const iconSizes = {
    sm: { box: 30, text: 'text-[16px]', subText: 'text-[9.5px]' },
    md: { box: 38, text: 'text-[19px]', subText: 'text-[11px]' },
    lg: { box: 46, text: 'text-[23px]', subText: 'text-[12px]' },
    xl: { box: 56, text: 'text-[28px]', subText: 'text-[13px]' },
  };

  const { box, text, subText } = iconSizes[size] || iconSizes.md;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Shield + Academic Mortarboard Trust Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={box}
          height={box}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-xs"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1B78D8" />
              <stop offset="50%" stopColor="#1673D1" />
              <stop offset="100%" stopColor="#0F5AAB" />
            </linearGradient>
            <linearGradient id="shieldGradInner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2583E8" />
              <stop offset="100%" stopColor="#1264BA" />
            </linearGradient>
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#0F5AAB" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Outer Curved Shield Shape */}
          <path
            d="M 24 3 L 41 8 C 41 24 35 37 24 44 C 13 37 7 24 7 8 Z"
            fill="url(#shieldGrad)"
            stroke={isLight ? '#60A5FA' : '#105CB0'}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Inner Highlight Shield Accent */}
          <path
            d="M 24 6.5 L 38 10.8 C 38 23.5 33 34.5 24 40.5 C 15 34.5 10 23.5 10 10.8 Z"
            fill="url(#shieldGradInner)"
            opacity="0.9"
          />

          {/* Academic Graduation Cap (Mortarboard) */}
          {/* Cap Diamond Top */}
          <polygon
            points="24,14 34,19 24,24 14,19"
            fill="#FFFFFF"
          />

          {/* Cap Skull Under-Rim */}
          <path
            d="M 18,21.5 L 18,26.5 C 18,28.8 20.7,30.5 24,30.5 C 27.3,30.5 30,28.8 30,26.5 L 30,21.5 C 28.2,22.8 26.2,23.5 24,23.5 C 21.8,23.5 19.8,22.8 18,21.5 Z"
            fill="#EAF4FF"
          />

          {/* Tassel Draping Down Left */}
          <path
            d="M 24,19 L 14.5,22.5 L 14.5,27"
            stroke="#FFFFFF"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="14.5" cy="27" r="1.2" fill="#FFFFFF" />

          {/* Open Trust / Foundation Arc Under the Cap */}
          <path
            d="M 18,34 Q 24,37 30,34"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>

        {/* Live Cryptographic Heartbeat Ping */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16845B] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16845B]" />
        </span>
      </div>

      {/* Brand Typography */}
      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center tracking-tight">
            <span
              className={`font-bold ${text} tracking-tight ${
                isLight ? 'text-white' : 'text-[#17324F]'
              }`}
              style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}
            >
              True<span className="text-[#1673D1]">-Trace</span>
            </span>
          </div>

          {withSubtitle && (
            <span
              className={`${subText} font-normal tracking-normal mt-1 ${
                isLight ? 'text-slate-300' : 'text-[#71849A]'
              }`}
              style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}
            >
              Student Record Integrity
            </span>
          )}
        </div>
      )}
    </div>
  );
};
