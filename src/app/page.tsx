import Image from "next/image";
import { Hero, Logos, Values, Features, How, CTA } from "@/components/sections";

export default function Home() {
  return (
    <main>
      <Hero />
      <Logos />
      <How />
      <Features />
      <Values />
      <CTA />
    </main>
  );
}
