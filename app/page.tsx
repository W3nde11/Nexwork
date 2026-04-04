import { LandingHeader } from "@/components/LandingHeader";
import { LandingFooter } from "@/components/LandingFooter";
import { HeroSection } from "@/components/landing/HeroSection";
import { CategoriesSection } from "@/components/landing/CategoriesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CTASection } from "@/components/landing/CTASection";
import { QuemSomosSection } from "@/components/landing/QuemSomosSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <QuemSomosSection />
        <CategoriesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
