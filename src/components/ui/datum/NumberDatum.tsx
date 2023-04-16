import { NextPage } from "next";

interface NumberDatumProps {
  title: string;
  value: string;
  suffix?: string;
}

export const NumberDatum: NextPage<NumberDatumProps> = ({ title, value, suffix }) => {
  return (
    <div className="py-4 sm:py-5 flex justify-between">
      <dt className="text-sm font-medium primary-text">{title}</dt>
      <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">
        {value} {suffix}
      </dd>
    </div>
  );
};
