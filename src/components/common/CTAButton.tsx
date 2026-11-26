import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { trackCTA } from '../../lib/analytics';

export type CTAVariant = 'primary' | 'secondary' | 'text' | 'destructive' | 'gold';
export type CTASize = 'sm' | 'md' | 'lg';
export type CTAShape = 'pill' | 'rounded';

export interface CTAButtonProps {
  children: React.ReactNode;
  variant?: CTAVariant;
  size?: CTASize;
  shape?: CTAShape;
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
  state?: any;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  withArrow?: boolean;
  ctaName?: string;
  ctaSection?: string;
  fullWidth?: boolean;
  className?: string;
  title?: string;
  'aria-label'?: string;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  to,
  href,
  target,
  rel,
  state,
  type = 'button',
  onClick,
  disabled = false,
  isLoading = false,
  loadingText,
  icon,
  iconPosition = 'left',
  withArrow = false,
  ctaName,
  ctaSection = 'general',
  fullWidth = false,
  className = '',
  title,
  'aria-label': ariaLabel,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled || isLoading) {
      e.preventDefault();
      return;
    }

    if (ctaName) {
      trackCTA(ctaName, ctaSection, to || href);
    }

    if (onClick) {
      onClick(e);
    }
  };

  // Base layout and interaction styles
  const baseStyles =
    'group inline-flex items-center justify-center font-semibold transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-readora-ivory active:scale-[0.98] disabled:opacity-55 disabled:pointer-events-none disabled:active:scale-100';

  // Variant styles adhering strictly to Readora's palette
  const variantStyles: Record<CTAVariant, string> = {
    primary:
      'bg-readora-forest hover:bg-readora-forest-light text-white shadow-sm hover:shadow-md active:bg-readora-forest-dark focus-visible:ring-readora-forest border border-readora-forest',
    secondary:
      'bg-transparent hover:bg-readora-ivory text-readora-ink border border-readora-ink/80 hover:border-readora-ink shadow-sm focus-visible:ring-readora-ink active:bg-readora-border/40',
    text:
      'bg-transparent text-readora-forest hover:text-readora-forest-dark p-0 h-auto underline-offset-4 hover:underline focus-visible:ring-readora-forest focus-visible:rounded-sm active:opacity-80',
    destructive:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md active:bg-red-800 focus-visible:ring-red-500 border border-transparent',
    gold:
      'bg-readora-gold hover:bg-readora-gold-light text-readora-ink shadow-sm hover:shadow-md active:bg-readora-gold-dark focus-visible:ring-readora-gold border border-readora-gold',
  };

  // Size styling
  const sizeStyles: Record<CTASize, string> = {
    sm: variant === 'text' ? 'text-xs' : 'text-xs px-3.5 py-1.5 gap-1.5',
    md: variant === 'text' ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm px-5 py-2.5 gap-2',
    lg: variant === 'text' ? 'text-sm sm:text-base' : 'text-sm sm:text-base px-6 sm:px-7 py-3 sm:py-3.5 gap-2.5',
  };

  // Shape styling
  const shapeStyles = variant === 'text' ? '' : shape === 'pill' ? 'rounded-full' : 'rounded-xl';

  const widthStyles = fullWidth ? 'w-full' : '';

  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${shapeStyles} ${widthStyles} ${className}`.trim();

  // Content rendering with icons and loading states
  const renderedContent = (
    <>
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : icon && iconPosition === 'left' ? (
        <span className="shrink-0 transition-transform duration-200">{icon}</span>
      ) : null}

      <span>{isLoading && loadingText ? loadingText : children}</span>

      {!isLoading && icon && iconPosition === 'right' && (
        <span className="shrink-0 transition-transform duration-200">{icon}</span>
      )}

      {!isLoading && withArrow && (
        <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </>
  );

  const trackingAttrs = {
    'data-cta-name': ctaName || (typeof children === 'string' ? children : 'cta_button'),
    'data-cta-section': ctaSection,
    'data-cta-variant': variant,
  };

  if (to && !disabled) {
    return (
      <Link
        to={to}
        state={state}
        className={combinedClasses}
        onClick={handleClick}
        title={title}
        aria-label={ariaLabel}
        {...trackingAttrs}
      >
        {renderedContent}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a
        href={href}
        target={target}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        className={combinedClasses}
        onClick={handleClick}
        title={title}
        aria-label={ariaLabel}
        {...trackingAttrs}
      >
        {renderedContent}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={combinedClasses}
      onClick={handleClick}
      title={title}
      aria-label={ariaLabel}
      {...trackingAttrs}
    >
      {renderedContent}
    </button>
  );
};
