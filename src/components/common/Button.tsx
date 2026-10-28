/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'dark'
  | 'destructive'
  | 'success'
  | 'ghost';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      fullWidth = false,
      disabled = false,
      className = '',
      children,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    // 4px border-radius standard for True-Trace Design System
    const baseClasses =
      'inline-flex items-center justify-center font-sans tracking-tight rounded-[4px] border transition-all duration-150 ease-in-out select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1673D1]/40 focus-visible:ring-offset-1 active:scale-[0.99]';

    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        'bg-[#1673D1] hover:bg-[#105CB0] active:bg-[#0D4E96] text-white border-transparent shadow-xs',
      secondary:
        'bg-white hover:bg-[#F4F8FC] text-[#17324F] hover:text-[#1673D1] border-[#DCE7F2] hover:border-[#C5DCFA] shadow-2xs',
      outline:
        'bg-white hover:bg-[#EAF4FF] text-[#1673D1] border-[#1673D1] hover:border-[#105CB0] shadow-2xs',
      dark:
        'bg-[#10243A] hover:bg-[#0B1728] active:bg-[#060E18] text-white border-transparent shadow-xs',
      destructive:
        'bg-[#C43D43] hover:bg-[#B0353A] active:bg-[#9B2E33] text-white border-transparent shadow-xs',
      success:
        'bg-[#16805D] hover:bg-[#136C4F] active:bg-[#0F5840] text-white border-transparent shadow-xs',
      ghost:
        'bg-transparent hover:bg-[#EAF4FF]/80 text-[#40566E] hover:text-[#1673D1] border-transparent',
    };

    const sizeClasses: Record<ButtonSize, string> = {
      xs: 'text-[11.5px] px-2.5 py-1 gap-1.5 font-medium leading-none',
      sm: 'text-[12.5px] px-3.5 py-1.5 gap-1.5 font-medium leading-tight',
      md: 'text-[13.5px] px-4.5 py-2 gap-2 font-semibold leading-normal',
      lg: 'text-[14.5px] px-6 py-2.5 gap-2.5 font-semibold leading-normal',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        {...rest}
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
            {children && <span>{children}</span>}
            {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
