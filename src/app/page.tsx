import Hero from "@/components/Hero";
import Process from "@/components/Process";
import TopCarriers from "@/components/TopCarriers";
import Audience from "@/components/Audience";
import CTABlock from "@/components/CTABlock";
import SocialProof from "@/components/SocialProof";
import QuoteForm from "@/components/QuoteForm";
import FAQ from "@/components/FAQ";
import About from "@/components/About";
import Disability101 from "@/components/Disability101";
import BlogPreview from "@/components/BlogPreview";

export default function Home() {
  return (
    <main>
      <Hero />
      <Process />
      <TopCarriers />
      <Audience />
      <CTABlock />
      <SocialProof />
      <QuoteForm />
      <FAQ />
      <About />
      <Disability101 />
      <BlogPreview />
    </main>
  );
}
