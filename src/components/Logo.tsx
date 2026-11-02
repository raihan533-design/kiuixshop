import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark'; // 'light' for light backgrounds, 'dark' for dark footers
  showShopBadge?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'light',
  showShopBadge = false
}) => {
  const sizeMap = {
    sm: { heightClass: 'h-6 sm:h-7', badgeClass: 'text-[9px] px-1.5 py-0.5' },
    md: { heightClass: 'h-8 sm:h-9', badgeClass: 'text-[10px] px-2 py-0.5' },
    lg: { heightClass: 'h-10 sm:h-12', badgeClass: 'text-xs px-2.5 py-1' }
  };

  const { heightClass, badgeClass } = sizeMap[size];
  const logoSrc = variant === 'dark' ? '/kiuix-brand-logo-white.png' : '/kiuix-brand-logo.png';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none group cursor-pointer ${className}`}>
      {/* Authentic Original KIUIX Brand Mark & Typography */}
      <img
        src={logoSrc}
        alt="KIUIX Logo"
        className={`${heightClass} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
        loading="eager"
      />

      {/* Styled SHOP Badge */}
      {showShopBadge && (
        <span
          className={`font-black rounded-lg uppercase tracking-widest font-mono border transition-all shadow-xs ${badgeClass} ${
            variant === 'dark'
              ? 'bg-blue-600 text-white border-blue-400/40 group-hover:bg-blue-500'
              : 'bg-slate-950 text-blue-400 border-slate-800 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'
          }`}
        >
          SHOP
        </span>
      )}
    </div>
  );
};
