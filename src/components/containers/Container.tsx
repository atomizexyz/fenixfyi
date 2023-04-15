import { clsx } from "clsx";
import { Breadcrumbs } from "@/components/ui";
import { useContext } from "react";
import FenixContext from "@/contexts/FenixContext";
import ConfettiLayout from "@/components/layouts/ConfettiLayout";

export default function Container({ className, ...props }: any) {
  const { showConfetti } = useContext(FenixContext);

  return (
    <main>
      <ConfettiLayout play={showConfetti}>
        <Breadcrumbs />
        <div className={clsx("mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8 text-neutral", className)} {...props}>
          <div className="card-body text-neutral" {...props} />
        </div>
      </ConfettiLayout>
    </main>
  );
}
