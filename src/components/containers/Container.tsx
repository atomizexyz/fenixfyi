import { clsx } from "clsx";
import { Breadcrumbs } from "@/components/ui";

export default function Container({ className, ...props }: any) {
  return (
    <main>
      <Breadcrumbs />
      <div className={clsx("mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8 text-neutral", className)} {...props}>
        <div className="card-body text-neutral" {...props} />
      </div>
    </main>
  );
}
