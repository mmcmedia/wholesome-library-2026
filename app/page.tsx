import HeroSection from '@/components/home/hero-section'
import QuickTestimonial from '@/components/home/quick-testimonial'
import HowItWorks from '@/components/home/how-it-works'
import FeaturesSection from '@/components/home/features-section'
import PricingSection from '@/components/home/pricing-section'
import FAQSection from '@/components/home/faq-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickTestimonial />
      <HowItWorks />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
    </>
  )
}
