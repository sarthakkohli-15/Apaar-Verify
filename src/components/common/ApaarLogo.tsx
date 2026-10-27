/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ApaarLogoProps {
  variant?: 'light' | 'dark'; // 'light' for dark navy backgrounds, 'dark' for white/light backgrounds
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
    sm: { box: 28, stroke: 1.5 },
    md: { box: 36, stroke: 1.8 },
    lg: { box: 44, stroke: 2.0 },
    xl: { box: 54, stroke: 2.2 },
  };

  const { box, stroke } = iconSizes[size] || iconSizes.md;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision National Trust Insignia (SVG) */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={box}
          height={box}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-xs"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A5F" />
              <stop offset="50%" stopColor="#10243A" />
              <stop offset="100%" stopColor="#0B1728" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="accentBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#2457A7" />
            </linearGradient>
          </defs>

          {/* Outer Octagonal Shield / Security Perimeter */}
          <polygon
            points="32,3 56,11 61,35 48,55 32,61 16,55 3,35 8,11"
            fill="url(#shieldGrad)"
            stroke={isLight ? '#38BDF8' : '#2457A7'}
            strokeWidth={stroke * 1.2}
            strokeLinejoin="round"
          />

          {/* Golden Sovereign Accent Border */}
          <polygon
            points="32,7 52,14 56,34 45,51 32,56 19,51 8,34 12,14"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="1"
            strokeDasharray="2,2"
            opacity="0.8"
          />

          {/* Interlocking Cryptographic Hexagon / Data Block */}
          <polygon
            points="32,15 46,23 46,39 32,47 18,39 18,23"
            fill="#0F1F33"
            stroke="url(#accentBlue)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Biometric & APAAR Identity Arcs */}
          <path
            d="M 24,28 Q 32,23 40,28"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M 22,34 Q 32,28 42,34"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M 24,40 Q 32,34 40,40"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Central Verification Nexus / Checkmark Anchor */}
          <circle cx="32" cy="31" r="5" fill="#10243A" stroke="#F59E0B" strokeWidth="1.4" />
          <path
            d="M 30,31 L 31.5,32.5 L 34,29.5"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Cryptographic Keyhole Base Anchor */}
          <circle cx="32" cy="42" r="1.8" fill="#38BDF8" />
          <path d="M 32,42 L 32,45" stroke="#38BDF8" strokeWidth="1.4" strokeLinecap="round" />
        </svg>

        {/* Live Cryptographic Heartbeat Ping on Emblem */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]" />
        </span>
      </div>

      {/* Brand Typography */}
      {!iconOnly && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-extrabold tracking-tight ${
                size === 'sm'
                  ? 'text-[15px]'
                  : size === 'lg'
                  ? 'text-[22px]'
                  : size === 'xl'
                  ? 'text-[26px]'
                  : 'text-[18px]'
              } ${isLight ? 'text-white' : 'text-[#10243A]'}`}
              style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}
            >
              APAAR<span className="text-[#2457A7]">-VERIFY</span>
            </span>

            {/* Micro Trust Shield Pill */}
            <span
              className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase tracking-widest ${
                isLight
                  ? 'bg-[#1D3B5C] text-[#F59E0B] border-[#F59E0B]/30'
                  : 'bg-[#F4F6F9] text-[#2457A7] border-[#D5DEE8]'
              }`}
            >
              AICTE
            </span>
          </div>

          {withSubtitle && (
            <span
              className={`text-[10px] tracking-wider uppercase font-semibold mt-0.5 ${
                isLight ? 'text-[#8A9BA8]' : 'text-[#59697C]'
              }`}
            >
              National Student Data & Verification Anchor
            </span>
          )}
        </div>
      )}
    </div>
  );
};
