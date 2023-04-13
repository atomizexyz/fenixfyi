import { clsx } from "clsx";

export default function CardContainer({ className, ...props }: any) {
  return (
    <div className={clsx("overflow-hidden shadow rounded-lg sm:rounded-xl primary-card", className)}>
      <div className="px-4 py-4" {...props} />
    </div>
  );
}
