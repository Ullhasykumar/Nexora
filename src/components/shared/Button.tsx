/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'nx-btn-primary',
      secondary: 'bg-bg-elevated text-text-primary hover:bg-opacity-80',
      outline: 'border border-border text-text-primary hover:bg-bg-elevated',
      ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
      danger: 'bg-accent-danger text-white hover:bg-opacity-90',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-2',
      lg: 'px-8 py-3 text-lg',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-bg-base disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          variant !== 'primary' && sizes[size], // Primary button has internal padding in its class
          size === 'icon' && 'aspect-square',
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
