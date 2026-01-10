import React from 'react';
import { Users } from 'lucide-react';

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
            <a href="/#about" className="text-gray-700 hover:text-blue-600 transition">About</a>
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

// Terms & Conditions Page Component
const TermsConditionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using TeamSync, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use License</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Permission is granted to temporarily use TeamSync for personal or commercial purposes. This license shall automatically terminate if you violate any of these restrictions:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>You may not modify or copy the materials</li>
              <li>You may not use the materials for any commercial purpose without authorization</li>
              <li>You may not attempt to decompile or reverse engineer any software</li>
              <li>You may not remove any copyright or proprietary notations</li>
              <li>You may not transfer the materials to another person</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
            <p className="text-gray-700 leading-relaxed">
              When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You agree not to use TeamSync to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful code or malware</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Engage in unauthorized advertising or spam</li>
              <li>Collect or store personal data of other users</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The service and its original content, features, and functionality are owned by TeamSync and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You retain ownership of content you create, but grant us a license to use, modify, and distribute it as necessary to provide the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content Guidelines</h2>
            <p className="text-gray-700 leading-relaxed">
              You are solely responsible for the content you post on TeamSync. We reserve the right to remove any content that violates these terms or is deemed inappropriate. You must not post content that is illegal, offensive, discriminatory, or infringes on the rights of others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
            <p className="text-gray-700 leading-relaxed">
              We strive to provide reliable service, but we do not guarantee that the service will be uninterrupted, timely, secure, or error-free. We reserve the right to modify, suspend, or discontinue the service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason at our sole discretion. Upon termination, your right to use the service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimer of Warranties</h2>
            <p className="text-gray-700 leading-relaxed">
              The service is provided on an "as is" and "as available" basis. TeamSync makes no warranties, expressed or implied, regarding the service, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall TeamSync be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service, even if we have been advised of the possibility of such damages. Our total liability shall not exceed the amount paid by you, if any, for accessing the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless TeamSync and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising out of your use of the service or violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which TeamSync operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service. Your continued use of the service after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms, please contact us at legal@teamsync.com
            </p>
          </section>

          <p className="text-sm text-gray-500 pt-6 border-t">
            Last updated: November 14, 2025
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsConditionsPage;