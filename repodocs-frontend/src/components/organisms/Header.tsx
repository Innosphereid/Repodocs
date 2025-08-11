"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/atoms/Logo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks";
import { githubOAuth } from "@/lib/services/api";
import { Github, Menu, User, LogOut, BarChart3 } from "lucide-react";
import Link from "next/link";

export interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogin = () => {
    const authUrl = githubOAuth.getAuthUrl();
    window.location.href = authUrl;
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/#features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/examples"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Examples
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Documentation
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                {/* Dashboard Link */}
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>

                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.username}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {user.username}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogin}
                  className="gap-2"
                >
                  <Github className="h-4 w-4" />
                  Sign in with GitHub
                </Button>
                <Button size="sm">Get Started</Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
