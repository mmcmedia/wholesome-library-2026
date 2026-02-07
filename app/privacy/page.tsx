'use client'

import React from 'react'
import { Mail } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-teal-50">
      <div className="container mx-auto px-4 md:px-8 py-16 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Your family's privacy is our highest priority.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: February 2026
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8 text-gray-700">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              1. Introduction
            </h2>
            <p>
              Wholesome Library ("we," "us," "our," or "Company") operates the Wholesome Library website and mobile application (collectively, the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Service.
            </p>
            <p className="mt-4">
              <strong>Special Note for Parents:</strong> Wholesome Library is designed for families with children ages 4-12. We comply with the Children's Online Privacy Protection Act (COPPA) and have additional safeguards specifically to protect children's privacy.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              2. Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold text-teal mb-3 mt-6">
              A. Information From Parents
            </h3>
            <p>
              When you create a Wholesome Library account, we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li><strong>Email address</strong> — for account login and notifications</li>
              <li><strong>Password</strong> — securely encrypted</li>
              <li><strong>Payment information</strong> — processed securely through Stripe (we never see your full card details)</li>
            </ul>

            <h3 className="text-xl font-semibold text-teal mb-3 mt-6">
              B. Information About Your Child
            </h3>
            <p>
              When you set up a child profile in Wholesome Library, we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li><strong>Child's first name only</strong> — no last name, no date of birth</li>
              <li><strong>Reading level</strong> — Early Reader, Independent, Confident, or Advanced</li>
              <li><strong>Reading activity</strong> — which stories they've read and when</li>
              <li><strong>Content preferences</strong> — what types of stories your family prefers (set by you, the parent)</li>
            </ul>

            <h3 className="text-xl font-semibold text-teal mb-3 mt-6">
              C. Automatic Information
            </h3>
            <p>
              Like most websites, we automatically collect:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li><strong>Device information</strong> — device type, operating system, browser type</li>
              <li><strong>Usage data</strong> — which pages you visit, time spent reading, interactions with the Service</li>
              <li><strong>IP address</strong> — for security and analytics purposes</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              3. How We Use Your Information
            </h2>
            <p>
              We use the information we collect for these purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li><strong>Account Management</strong> — to create and manage your account</li>
              <li><strong>Service Delivery</strong> — to provide reading content and personalized story recommendations</li>
              <li><strong>Reading Recommendations</strong> — to suggest stories matched to your child's reading level and preferences</li>
              <li><strong>Email Notifications</strong> — to send you account updates, reading progress reports, and subscription information</li>
              <li><strong>Payment Processing</strong> — to process subscriptions and billing through Stripe</li>
              <li><strong>Service Improvement</strong> — to understand how families use Wholesome Library and make it better</li>
              <li><strong>Safety & Security</strong> — to protect against fraud and ensure the security of our Service</li>
            </ul>
            <p className="mt-4 text-sm bg-amber-50 border-l-4 border-amber-400 p-4">
              <strong>We do NOT use children's data to:</strong> Display advertising, build behavioral profiles, sell or rent data, or contact children directly without parental permission.
            </p>
          </section>

          {/* Who We Share Information With */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              4. Who Can See Your Information
            </h2>

            <h3 className="text-xl font-semibold text-teal mb-3">
              A. Your Child's Data
            </h3>
            <p>
              <strong>Your child's data is visible only to:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>You, the parent (via your Parent Dashboard)</li>
              <li>Our trusted service providers (see below)</li>
            </ul>
            <p className="mt-4">
              <strong>Your child's data is NOT shared with:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Third-party advertisers or marketing companies</li>
              <li>Social media platforms</li>
              <li>Other users or families</li>
              <li>Anyone outside our organization, except where legally required</li>
            </ul>

            <h3 className="text-xl font-semibold text-teal mb-3 mt-6">
              B. Our Service Providers
            </h3>
            <p>
              We share information with trusted service providers who help us operate Wholesome Library. These companies are contractually required to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li><strong>Supabase</strong> — our database and authentication provider</li>
              <li><strong>Stripe</strong> — payment processing (receives parent payment info only, never child data)</li>
              <li><strong>Resend</strong> — email service (receives parent email address only)</li>
              <li><strong>Vercel</strong> — web hosting and deployment</li>
            </ul>
            <p className="mt-4 text-sm">
              All service providers have signed data processing agreements and are required to protect your information at the same level we do.
            </p>
          </section>

          {/* Parental Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              5. Your Parental Rights
            </h2>
            <p>
              COPPA gives you these rights regarding your child's information:
            </p>

            <h3 className="text-xl font-semibold text-teal mb-3 mt-6">
              A. Right to Access
            </h3>
            <p>
              You can view all information we've collected about your child anytime by logging into your account and visiting the Parent Dashboard.
            </p>

            <h3 className="text-xl font-semibold text-teal mb-3 mt-6">
              B. Right to Delete
            </h3>
            <p>
              You can request deletion of your child's account and all associated data at any time. To delete, visit your account settings and select "Delete Child Profile." Your child's reading history will be permanently deleted within 30 days.
            </p>

            <h3 className="text-xl font-semibold text-teal mb-3 mt-6">
              C. Right to Revoke Consent
            </h3>
            <p>
              You can revoke your consent for us to collect information about your child by deleting their profile or closing your account. Once consent is revoked, your child will no longer be able to access Wholesome Library.
            </p>

            <h3 className="text-xl font-semibold text-teal mb-3 mt-6">
              D. Right to Opt Out of Communications
            </h3>
            <p>
              You can unsubscribe from marketing emails at any time by clicking the unsubscribe link in any email from us. We will continue to send you transactional emails (subscription confirmations, billing, etc.).
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              6. Data Security & Retention
            </h2>

            <h3 className="text-xl font-semibold text-teal mb-3">
              A. Security Measures
            </h3>
            <p>
              We implement reasonable security measures to protect your information, including:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Secure password hashing</li>
              <li>Limited employee access to children's data</li>
              <li>Regular security reviews</li>
            </ul>

            <h3 className="text-xl font-semibold text-teal mb-3 mt-6">
              B. Data Retention
            </h3>
            <p>
              <strong>While Your Account is Active:</strong> We keep your information as long as you maintain an active account.
            </p>
            <p className="mt-3">
              <strong>After Account Closure:</strong> When you close your Wholesome Library account, we permanently delete all data associated with your child's profile within 30 days. Parent account information (email address) may be retained for legal compliance and abuse prevention for up to 12 months, after which it is deleted.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              7. COPPA & Children's Privacy
            </h2>
            <p>
              Wholesome Library complies with the Children's Online Privacy Protection Act (COPPA). Key provisions:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li><strong>No Direct Contact:</strong> We never contact children directly without parental permission</li>
              <li><strong>Minimal Data Collection:</strong> We collect only information necessary to provide the Service</li>
              <li><strong>Parental Consent:</strong> You (the parent) must verify your identity via Stripe payment or email confirmation to create a child profile</li>
              <li><strong>No Behavioral Tracking:</strong> We don't use persistent cookies to track children's behavior across other websites</li>
              <li><strong>No Advertising:</strong> Children never see advertisements on Wholesome Library</li>
            </ul>
          </section>

          {/* Contact & Requests */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              8. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, or if you'd like to exercise any of your parental rights, please contact us:
            </p>
            <div className="mt-4 bg-teal-50 p-6 rounded-lg border border-teal-200">
              <div className="flex items-start gap-3">
                <Mail className="h-6 w-6 text-teal flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-charcoal">MMC Media LLC</p>
                  <p className="text-gray-600 mt-1">
                    Email: privacy@wholesomelibrary.com
                  </p>
                  <p className="text-gray-600">
                    Mailing Address: MMC Media LLC, [Address TBD], [City], [State] [ZIP]
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              We will respond to all privacy requests within 30 days.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              9. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy to reflect changes in our practices or for other reasons. We will notify you of any material changes by updating the "Last Updated" date at the top of this page. Your continued use of Wholesome Library after any changes constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Acknowledgment */}
          <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-gray-700">
              ✓ <strong>Privacy by Design:</strong> We built Wholesome Library with privacy at the center. We collect only what we need, share only what's necessary, and give you complete control over your child's information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
