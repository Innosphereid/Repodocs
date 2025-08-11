import React from 'react';
import { cn } from '@/lib/utils';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className 
}) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const IconComponent = () => (
    <div className={cn(
      'flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold',
      sizeClasses[size]
    )}>
      <span className="text-white">RD</span>
    </div>
  );

  const TextComponent = () => (
    <span className={cn(
      'font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
      textSizeClasses[size]
    )}>
      RepoDocsAI
    </span>
  );

  if (variant === 'icon') {
    return <IconComponent />;
  }

  if (variant === 'text') {
    return <TextComponent />;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <IconComponent />
      <TextComponent />
    </div>
  );
};

export default Logo;