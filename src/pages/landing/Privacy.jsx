import React from 'react';
import Header from '../../components/landing/Header';
import Footer from '../../components/landing/Footer';

const sections = [
  {
    title: 'Introduction',
    content:
      'At TeamSync, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully to understand our practices regarding your personal data.',
  },
  {
    title: 'Information We Collect',
    content: 'We collect information that you provide directly to us, including:',
    list: [
      'Account information such as name, email address, and password',
      'Profile information including profile pictures and bio',
      'Content you create, upload, or share on our platform',
      'Communication data when you contact our support team',
      'Usage data and analytics to improve our services',
    ],
  },
  {
    title: 'How We Use Your Information',
    content: 'We use the information we collect to:',
    list: [
      'Provide, maintain, and improve our services',
      'Process transactions and send related information',
      'Send technical notices and support messages',
      'Respond to your comments and questions',
      'Protect against fraudulent or illegal activity',
    ],
  },
  {
    title: 'Data Security',
    content:
      'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We use encryption, secure servers, and regular security audits to maintain data security.',
  },
  {
    title: 'Your Rights',
    content: 'You have the right to:',
    list: [
      'Access your personal information',
      'Correct inaccurate data',
      'Request deletion of your data',
      'Object to processing of your data',
      'Export your data in a portable format',
    ],
  },
  {
    title: 'Cookies and Tracking',
    content:
      'We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.',
  },
  {
    title: 'Third-Party Services',
    content:
      'We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, perform service-related services, or assist us in analyzing how our service is used. These third parties have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.',
  },
  {
    title: 'Data Retention',
    content:
      'We will retain your personal information only for as long as necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.',
  },
  {
    title: "Children's Privacy",
    content:
      'Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.',
  },
  {
    title: 'Changes to This Privacy Policy',
    content:
      'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.',
  },
  {
    title: 'Contact Us',
    content:
      'If you have any questions about this Privacy Policy, please contact us at privacy@teamsync.com',
  },
];

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight mb-10">
          Privacy Policy
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

export default PrivacyPolicyPage;
