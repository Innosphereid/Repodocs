import React from 'react';
import Header from '@/components/organisms/Header';
import { cn } from '@/lib/utils';

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  showHeader = true,
  maxWidth = '2xl'
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {showHeader && <Header />}
      
      <main className={cn(
        'container mx-auto px-4 py-8',
        maxWidthClasses[maxWidth],
        className
      )}>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h3 className="font-semibold">Product</h3>
              <div className="space-y-2 text-sm">
                <a href="#features" className="block text-gray-600 hover:text-gray-900">Features</a>
                <a href="#pricing" className="block text-gray-600 hover:text-gray-900">Pricing</a>
                <a href="/examples" className="block text-gray-600 hover:text-gray-900">Examples</a>
                <a href="/changelog" className="block text-gray-600 hover:text-gray-900">Changelog</a>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Resources</h3>
              <div className="space-y-2 text-sm">
                <a href="/docs" className="block text-gray-600 hover:text-gray-900">Documentation</a>
                <a href="/api" className="block text-gray-600 hover:text-gray-900">API Reference</a>
                <a href="/guides" className="block text-gray-600 hover:text-gray-900">Guides</a>
                <a href="/blog" className="block text-gray-600 hover:text-gray-900">Blog</a>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Company</h3>
              <div className="space-y-2 text-sm">
                <a href="/about" className="block text-gray-600 hover:text-gray-900">About</a>
                <a href="/privacy" className="block text-gray-600 hover:text-gray-900">Privacy</a>
                <a href="/terms" className="block text-gray-600 hover:text-gray-900">Terms</a>
                <a href="/contact" className="block text-gray-600 hover:text-gray-900">Contact</a>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Connect</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-gray-600 hover:text-gray-900">Twitter</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900">GitHub</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900">Discord</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900">LinkedIn</a>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600">
              © 2025 RepoDocsAI. All rights reserved.
            </div>
            <div className="text-sm text-gray-600 mt-4 md:mt-0">
              Made with ❤️ for developers worldwide
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;