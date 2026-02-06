import React, { useState, useEffect } from 'react';
import { Users, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'About', href: '/#about' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary tracking-tight">
              TeamSync
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-elevated border border-border transition-all duration-200"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <a
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Log in
            </a>
            <a
              href="/register"
              className="hidden sm:inline-flex px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Get Started
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:bg-surface-elevated border border-border transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-t border-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:text-primary hover:bg-primary/5 transition-all"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
                <a
                  href="/login"
                  className="px-4 py-2.5 text-sm font-medium text-text-secondary text-center rounded-lg border border-border hover:bg-surface-elevated transition-all"
                >
                  Log in
                </a>
                <a
                  href="/register"
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-primary text-center rounded-lg hover:bg-primary-dark transition-all"
                >
                  Get Started
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
