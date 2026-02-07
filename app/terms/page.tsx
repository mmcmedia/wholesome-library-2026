'use client'

import React from 'react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-teal-50">
      <div className="container mx-auto px-4 md:px-8 py-16 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Please read these terms carefully before using Wholesome Library.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: February 2026
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8 text-gray-700">
          {/* Agreement */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              1. Agreement to Terms
            </h2>
            <p>
              By accessing and using Wholesome Library ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to abide by the above, please do not use this Service.
            </p>
            <p className="mt-4">
              <strong>Last Updated:</strong> February 2026. We may update these terms at any time. Your continued use of the Service constitutes your acceptance of updated Terms.
            </p>
          </section>

          {/* Age & Account Requirements */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              2. Age & Account Requirements
            </h2>

            <h3 className="text-xl font-semibold text-teal mb-3">
              A. Parent Account Requirement
            </h3>
            <p>
              Only adults age 18 or older may create a Wholesome Library account. By creating an account, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>You are at least 18 years old</li>
              <li>You are the parent or legal guardian of any child using the Service under your account</li>
              <li>All information you provide is accurate and truthful</li>
            </ul>

            <h3 className="text-xl font-semibold text-teal mb-3 mt-6">
              B. Children's Accounts
            </h3>
            <p>
              Child profiles may only be created by parent account holders. Children ages 4-12 may use Wholesome Library only under parental supervision and permission. We comply fully with the Children's Online Privacy Protection Act (COPPA).
            </p>
          </section>

          {/* Use License */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              3. Use License
            </h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on Wholesome Library for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the Service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Systematically extract data from our Service for commercial purposes (web scraping)</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>

          {/* Subscription Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              4. Subscription Pricing & Billing
            </h2>

            <h3 className="text-xl font-semibold text-teal mb-3">
              A. Available Plans
            </h3>
            <p>
              Wholesome Library offers the following subscription options:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li><strong>7-Day Free Trial:</strong> Full access to the entire library at no charge. No credit card required for signup.</li>
              <li><strong>Family Monthly Plan:</strong> $7.99 per month, billed monthly</li>
              <li><strong>Family Annual Plan:</strong> $59.99 per year, billed annually (equivalent to $5/month)</li>
            </ul>

            <h3 className="text-xl font-semibold text-teal mb-3 mt-6">
              B. Billing & Auto-Renewal
            </h3>
            <p>
              After your 7-day free trial ends, you will be charged the subscription price you select. Subscriptions automatically renew on a monthly or annual basis (depending on your plan) until you cancel. You will be charged on the renewal date using the payment method you provide.
            </p>

            <h3 className="text-xl font-semibold text-teal mb-3 mt-6">
              C. Cancellation
            </h3>
            <p>
              You may cancel your subscription at any time by logging into your account and visiting Subscription Settings, or by contacting support. Cancellation takes effect at the end of your current billing period. No refunds will be issued for partial months.
            </p>

            <h3 className="text-xl font-semibold text-teal mb-3 mt-6">
              D. Price Changes
            </h3>
            <p>
              We may change subscription prices from time to time. If we increase prices, we will notify you at least 30 days in advance. If you do not accept the new pricing, you may cancel your subscription before the price change takes effect.
            </p>
          </section>

          {/* Free Trial */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              5. Free Trial Terms
            </h2>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Your 7-day free trial begins on the day you create your account</li>
              <li>No payment method is required to start your trial</li>
              <li>You must provide payment information before your trial expires to continue using the Service</li>
              <li>If you do not provide payment information before the trial expires, your account access will be suspended</li>
              <li>Only one free trial per person/email address</li>
            </ul>
          </section>

          {/* Content */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              6. Our Content
            </h2>

            <h3 className="text-xl font-semibold text-teal mb-3">
              A. Quality & Values
            </h3>
            <p>
              All stories on Wholesome Library are:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li><strong>AI-assisted:</strong> Created using artificial intelligence</li>
              <li><strong>Editorially reviewed:</strong> Every story is reviewed by our editorial team before publication</li>
              <li><strong>Values-aligned:</strong> Designed to reflect the wholesome values outlined in our About page</li>
              <li><strong>Age-appropriate:</strong> Tailored to reading levels from ages 4-12</li>
            </ul>

            <h3 className="text-xl font-semibold text-teal mb-3 mt-6">
              B. Content Accuracy
            </h3>
            <p>
              While we take care to create high-quality, accurate content, Wholesome Library is provided "as-is." We do not guarantee that all stories are 100% error-free or perfect. If you find an error in a story, please use the "Report a Problem" feature in the story reader.
            </p>

            <h3 className="text-xl font-semibold text-teal mb-3 mt-6">
              C. Content Updates
            </h3>
            <p>
              We regularly add new stories to Wholesome Library. We may also update, modify, or remove stories from our library at any time without notice. Content availability may vary by subscription plan.
            </p>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              7. Acceptable Use
            </h2>
            <p>
              You agree not to use Wholesome Library in any way that:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Violates any applicable law or regulation</li>
              <li>Infringes on the intellectual property rights of others</li>
              <li>Harasses, abuses, or threatens anyone</li>
              <li>Contains malware, viruses, or other harmful code</li>
              <li>Attempts to gain unauthorized access to the Service or its systems</li>
              <li>Disrupts the normal operation of the Service</li>
              <li>Harvests or collects data from the Service without permission</li>
              <li>Uses the Service for commercial purposes (reselling content, etc.)</li>
              <li>Shares your account with others or allows others to use it</li>
            </ul>
            <p className="mt-4">
              We reserve the right to suspend or terminate your account if you violate these terms.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              8. Limitation of Liability
            </h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WHOLESOME LIBRARY AND ITS OWNERS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES (EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES).
            </p>
            <p className="mt-4">
              IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU EXCEED THE AMOUNT YOU PAID FOR YOUR SUBSCRIPTION IN THE PAST 12 MONTHS (OR $100, WHICHEVER IS LESS).
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              9. Disclaimer of Warranties
            </h2>
            <p>
              WHOLESOME LIBRARY IS PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS. WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, REGARDING THE SERVICE, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p className="mt-4">
              WE DO NOT GUARANTEE THAT:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>The Service will be uninterrupted or error-free</li>
              <li>Defects will be corrected</li>
              <li>The Service will be free of harmful components</li>
              <li>Results from using the Service will meet your expectations</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              10. Termination
            </h2>
            <p>
              We may terminate your account and your access to Wholesome Library at any time and for any reason, including:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>Violation of these Terms of Service</li>
              <li>Fraudulent activity or payment failure</li>
              <li>Harmful or abusive behavior</li>
              <li>Violation of our privacy policy or acceptable use policies</li>
            </ul>
            <p className="mt-4">
              Upon termination, your right to use the Service immediately ceases. You remain responsible for any charges incurred before termination.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              11. Intellectual Property Rights
            </h2>
            <p>
              The Service and all content (including stories, graphics, logos, and software) are the property of Wholesome Library or its content suppliers and are protected by international copyright and trademark laws.
            </p>
            <p className="mt-4">
              Your subscription grants you a limited license to access and read stories for personal, non-commercial use. You may not reproduce, distribute, publish, or transmit any content without permission.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              12. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflicts of law principles. You agree to submit to the personal jurisdiction of the federal and state courts located in [State TBD].
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              13. Contact Us
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact:
            </p>
            <div className="mt-4 bg-teal-50 p-6 rounded-lg border border-teal-200">
              <p className="font-semibold text-charcoal">MMC Media LLC</p>
              <p className="text-gray-600 mt-2">
                Email: support@wholesomelibrary.com
              </p>
              <p className="text-gray-600">
                Mailing Address: MMC Media LLC, [Address TBD], [City], [State] [ZIP]
              </p>
            </div>
          </section>

          {/* Acknowledgment */}
          <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              ✓ <strong>Clear Terms:</strong> These terms are written to be fair and transparent. We want you to understand what you're agreeing to. If anything is unclear, please contact us.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
