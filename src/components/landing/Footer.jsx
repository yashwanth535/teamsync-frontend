import React from 'react';
import { Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-text-primary tracking-tight">
                TeamSync
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              The modern platform for seamless team collaboration.
              Synchronize workflows, manage projects, and communicate
              in real-time.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
              Product
            </h3>
            <div className="flex flex-col gap-2.5">
              <a href="/#features" className="text-sm text-text-secondary hover:text-primary transition-colors duration-200">
                Features
              </a>
              <a href="/#about" className="text-sm text-text-secondary hover:text-primary transition-colors duration-200">
                About
              </a>
              <a href="/register" className="text-sm text-text-secondary hover:text-primary transition-colors duration-200">
                Get Started
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
              Legal
            </h3>
            <div className="flex flex-col gap-2.5">
              <a href="/privacy" className="text-sm text-text-secondary hover:text-primary transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm text-text-secondary hover:text-primary transition-colors duration-200">
                Terms & Conditions
              </a>
              <span className="text-sm text-text-secondary">
                support@teamsync.com
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} TeamSync. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
