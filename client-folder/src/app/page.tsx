import Layout from "@components/layout";
import HeroSection from "@containers/home/hero-section";

export default function Home() {
  return (
    <Layout>
      <HeroSection className="h-[calc(100vh-60px)]" />
    </Layout>
  );
}
