"use client";

import { Hero, Logos, Values, Features, How, CTA } from "@/components/sections";
import { useContext } from "react";
import FenixContext from "@/contexts/FenixContext";
import ConfettiLayout from "@/components/layouts/ConfettiLayout";

export default function Home() {
  const { showConfetti } = useContext(FenixContext);

  return (
    <ConfettiLayout play={showConfetti}>
      <main>
        <Hero />
        <Logos />
        <How />
        <Features />
        <Values />
        <CTA />
      </main>
    </ConfettiLayout>
  );
}
