import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import HowItWorks from "./components/sections/HowItWorks";

export default function Page() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <Hero />
        <HowItWorks />
      </main>
    </div>
  );
}
