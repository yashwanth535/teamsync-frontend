import React from 'react';
import Header from '../../components/landing/Header';
import Footer from '../../components/landing/Footer';

const sections = [
  {
    title: 'Agreement to Terms',
    content:
      'By accessing and using TeamSync, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.',
  },
  {
    title: 'Use License',
    content:
      'Permission is granted to temporarily use TeamSync for personal or commercial purposes. This license shall automatically terminate if you violate any of these restrictions:',
    list: [
      'You may not modify or copy the materials',
      'You may not use the materials for any commercial purpose without authorization',
      'You may not attempt to decompile or reverse engineer any software',
      'You may not remove any copyright or proprietary notations',
      'You may not transfer the materials to another person',
    ],
  },
  {
    title: 'User Accounts',
    content:
      'When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.',
  },
  {
    title: 'Acceptable Use',
    content: 'You agree not to use TeamSync to:',
    list: [
      'Violate any laws or regulations',
      'Infringe on intellectual property rights',
      'Transmit harmful code or malware',
      'Harass, abuse, or harm other users',
      'Engage in unauthorized advertising or spam',
      'Collect or store personal data of other users',
      'Impersonate any person or entity',
    ],
  },
  {
    title: 'Intellectual Property',
    content:
      'The service and its original content, features, and functionality are owned by TeamSync and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You retain ownership of content you create, but grant us a license to use, modify, and distribute it as necessary to provide the service.',
  },
  {
    title: 'Content Guidelines',
    content:
      'You are solely responsible for the content you post on TeamSync. We reserve the right to remove any content that violates these terms or is deemed inappropriate. You must not post content that is illegal, offensive, discriminatory, or infringes on the rights of others.',
  },
  {
    title: 'Service Availability',
    content:
      'We strive to provide reliable service, but we do not guarantee that the service will be uninterrupted, timely, secure, or error-free. We reserve the right to modify, suspend, or discontinue the service at any time without notice.',
  },
  {
    title: 'Termination',
    content:
      'We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason at our sole discretion. Upon termination, your right to use the service will immediately cease.',
  },
  {
    title: 'Disclaimer of Warranties',
    content:
      'The service is provided on an "as is" and "as available" basis. TeamSync makes no warranties, expressed or implied, regarding the service, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.',
  },
  {
    title: 'Limitation of Liability',
    content:
      'In no event shall TeamSync be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service, even if we have been advised of the possibility of such damages. Our total liability shall not exceed the amount paid by you, if any, for accessing the service.',
  },
  {
    title: 'Indemnification',
    content:
      'You agree to indemnify and hold harmless TeamSync and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising out of your use of the service or violation of these terms.',
  },
  {
    title: 'Governing Law',
    content:
      'These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which TeamSync operates, without regard to its conflict of law provisions.',
  },
  {
    title: 'Changes to Terms',
    content:
      'We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service. Your continued use of the service after such modifications constitutes acceptance of the updated terms.',
  },
  {
    title: 'Contact Information',
    content:
      'For questions about these Terms, please contact us at legal@teamsync.com',
  },
];

const TermsConditionsPage = () => {
  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight mb-10">
          Terms & Conditions
        </h1>

        <div className="rounded-xl bg-surface-elevated border border-border p-8 lg:p-10 flex flex-col gap-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-text-primary mb-3">
                {section.title}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                {section.content}
              </p>
              {section.list && (
                <ul className="mt-3 flex flex-col gap-2 ml-5 list-disc">
                  {section.list.map((item, j) => (
                    <li key={j} className="text-sm text-text-secondary leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <p className="text-xs text-text-muted pt-6 border-t border-border">
            Last updated: November 14, 2025
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsConditionsPage;
