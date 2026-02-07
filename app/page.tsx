import HeroSection from '@/components/home/hero-section'
import QuickTestimonial from '@/components/home/quick-testimonial'
import HowItWorks from '@/components/home/how-it-works'
import FeaturesSection from '@/components/home/features-section'
import StoriesPreview from '@/components/home/stories-preview'
import Testimonials from '@/components/home/testimonials'
import MissionSpotlight from '@/components/home/mission-spotlight'
import PricingSection from '@/components/home/pricing-section'
import FAQSection from '@/components/home/faq-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickTestimonial />
      <HowItWorks />
      <FeaturesSection />
      <StoriesPreview />
      <Testimonials />
      <MissionSpotlight />
      <PricingSection />
      <FAQSection />
    </>
  )
}
