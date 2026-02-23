import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import BenefitsSection from '@/components/BenefitsSection';
import SafetySection from '@/components/SafetySection';
import FeaturedBuses from '@/components/FeaturedBuses';
import ForOwners from '@/components/ForOwners';
import MapPreview from '@/components/MapPreview';
import Testimonials from '@/components/Testimonials';
import FAQSection from '@/components/FAQSection';
import AppComingSoon from '@/components/AppComingSoon';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import LeadFormModal from '@/components/LeadFormModal';

const Index = () => {
  return (
    <main>
      <Header />
      <HeroSection />
      <HowItWorks />
      <BenefitsSection />
      <SafetySection />
      <FeaturedBuses />
      <ForOwners />
      <MapPreview />
      <Testimonials />
      <FAQSection />
      <AppComingSoon />
      <FinalCTA />
      <Footer />
      <LeadFormModal />
    </main>
  );
};

export default Index;
