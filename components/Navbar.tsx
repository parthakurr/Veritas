'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, TrendingUp, Flame, LayoutDashboard, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, loginWithGoogle, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Workouts & Graphs', href: '/workouts', icon: Dumbbell },
    { name: 'Nutrition Logs', href: '/nutrition', icon: Flame },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  ];

  return (
    <nav className="sticky top-4 z-40 w-full max-w-6xl mx-auto px-3 sm:px-6">
      <div className="glass-panel rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 transition-colors">
        {/* Brand Logo & Theme Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-0.5 shadow-md shadow-slate-900/10">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <span className="font-mono font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
              VERITAS<span className="text-[#E03E2D]">.LIFT</span>
            </span>
          </Link>

          <ThemeToggle />
        </div>

        {/* Desktop Center Pill Links */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-full px-3 py-1 border border-slate-200/60 dark:border-slate-700/60">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E03E2D]' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right CTA / User State */}
        <div className="flex items-center space-x-2">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 border border-slate-200 dark:border-slate-700 rounded-full pl-2 pr-3 py-1 text-xs text-slate-800 dark:text-slate-200 transition"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                )}
                <span className="font-semibold max-w-[80px] sm:max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 text-xs space-y-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition font-medium"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#E03E2D]" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/workouts"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition font-medium"
                  >
                    <Dumbbell className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Workouts &amp; Graphs</span>
                  </Link>
                  <Link
                    href="/nutrition"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition font-medium"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Manual Nutrition</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="px-3.5 py-1.5 rounded-full bg-[#E03E2D] hover:bg-[#C93323] text-white font-extrabold text-xs transition shadow-md shadow-rose-500/20 flex items-center space-x-1.5"
            >
              <span>Google Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 shadow-2xl space-y-1 text-xs font-bold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition ${
                  isActive
                    ? 'bg-[#E03E2D] text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};
