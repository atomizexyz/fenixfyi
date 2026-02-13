import { setRequestLocale, getTranslations } from "next-intl/server";
import { BurnForm } from "@/components/burn/burn-form";

export default async function BurnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("burn");

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text">{t("title")}</h1>
        <p className="mt-2 text-ash-500 dark:text-ash-400">
          {t("description")}
        </p>
      </div>

      <BurnForm />
    </div>
  );
}
