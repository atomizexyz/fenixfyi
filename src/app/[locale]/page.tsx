import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/dashboard/hero-section";
import { ChainTable } from "@/components/dashboard/chain-table";
import { ChainSupplyGrid } from "@/components/charts/equity-pool-chart";
import { FeaturesSection } from "@/components/dashboard/features-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-16 pb-16">
      <HeroSection />
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        <ChainTable />
        <ChainSupplyGrid />
      </div>
      <FeaturesSection />
    </div>
  );
}
