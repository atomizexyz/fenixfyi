import { setRequestLocale, getTranslations } from "next-intl/server";
import { RewardsPanel } from "@/components/rewards/rewards-panel";
import { YieldChart } from "@/components/charts/yield-chart";

export default async function RewardsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rewards");

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text">{t("title")}</h1>
        <p className="mt-2 text-ash-500 dark:text-ash-400">
          {t("description")}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <RewardsPanel />
        <YieldChart amount={1000} term={365} />
      </div>
    </div>
  );
}
