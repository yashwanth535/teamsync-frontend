import React from 'react';
import { Users, Zap, Shield, MessageSquare } from 'lucide-react';

// Header Component
const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <a href="/" className="flex items-center space-x-2">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TeamSync</span>
          </a>
          
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition">Home</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition">About</a>
            <a href="/privacy" className="text-gray-700 hover:text-blue-600 transition">Privacy</a>
            <a href="/terms" className="text-gray-700 hover:text-blue-600 transition">Terms</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <a href="/login" className="text-gray-700 hover:text-blue-600 transition">Login</a>
            <a href="/register" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Sign Up</a>
          </div>
        </div>
      </div>
    </header>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold">TeamSync</span>
            </div>
            <p className="text-gray-400">Synchronize your team's workflow and boost productivity.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <a href="/privacy" className="block text-gray-400 hover:text-white transition">Privacy Policy</a>
              <a href="/terms" className="block text-gray-400 hover:text-white transition">Terms & Conditions</a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">support@teamsync.com</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 TeamSync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Sync Your Team, <span className="text-blue-600">Amplify Results</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The all-in-one platform for seamless team collaboration, project management, and real-time communication.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg">
                Get Started Free
              </a>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg border-2 border-blue-600">
                Watch Demo
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why Choose TeamSync?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <Zap className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Experience real-time updates and instant sync across all your devices with zero lag.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <Shield className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-gray-600">Enterprise-grade security with end-to-end encryption to keep your data safe.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <MessageSquare className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Seamless Communication</h3>
              <p className="text-gray-600">Built-in chat, video calls, and file sharing to keep your team connected.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands of teams already using TeamSync</p>
            <a href="/register" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg">
              Start Your Free Trial
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;