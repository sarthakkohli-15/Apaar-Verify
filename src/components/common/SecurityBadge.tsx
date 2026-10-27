/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export type SecurityBadgeLevel = 'critical' | 'warning' | 'secure' | 'info' | 'neutral';

interface SecurityBadgeProps {
  level: SecurityBadgeLevel;
  children: React.ReactNode;
  pulse?: boolean;
  size?: 'xs' | 'sm' | 'md';
  code?: string;
  className?: string;
}

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({
  level,
  children,
  pulse = false,
  size = 'sm',
  code,
  className = '',
}) => {
  const styles = {
    critical: {
      container: 'bg-[#FEF2F2] text-[#991B1B] border-[#DC2626]/40 hover:border-[#DC2626]',
      dot: 'bg-[#DC2626]',
      glow: 'bg-[#EF4444]',
    },
    warning: {
      container: 'bg-[#FFFBEB] text-[#92400E] border-[#D97706]/40 hover:border-[#D97706]',
      dot: 'bg-[#D97706]',
      glow: 'bg-[#F59E0B]',
    },
    secure: {
      container: 'bg-[#F0FDF4] text-[#065F46] border-[#059669]/40 hover:border-[#059669]',
      dot: 'bg-[#059669]',
      glow: 'bg-[#10B981]',
    },
    info: {
      container: 'bg-[#EFF6FF] text-[#1E40AF] border-[#2563EB]/40 hover:border-[#2563EB]',
      dot: 'bg-[#2563EB]',
      glow: 'bg-[#3B82F6]',
    },
    neutral: {
      container: 'bg-[#F8FAFC] text-[#334155] border-[#CBD5E1]',
      dot: 'bg-[#64748B]',
      glow: 'bg-[#94A3B8]',
    },
  }[level];

  const sizeClasses = {
    xs: 'text-[10px] py-0.5 px-2 gap-1.5',
    sm: 'text-[11px] py-0.5 px-2.5 gap-2',
    md: 'text-[12px] py-1 px-3 gap-2.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded border font-mono font-semibold tracking-tight transition-all select-none shadow-2xs ${styles.container} ${sizeClasses} ${className}`}
    >
      {/* Precision Telemetry Status Light */}
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {(pulse || level === 'critical') && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styles.glow}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${styles.dot}`} />
      </span>

      {/* Code Identifier Prefix (if provided) */}
      {code && <span className="opacity-70">{code}:</span>}

      <span className="font-sans font-medium text-[11px] leading-none">{children}</span>
    </span>
  );
};
