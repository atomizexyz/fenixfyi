import { NextPage } from "next";
import CountUp from "react-countup";

interface CountUpDatumProps {
  title: string;
  value: number;
  description?: string;
  decimals?: number;
  suffix?: string;
}

export const CountUpDatum: NextPage<CountUpDatumProps> = ({ title, value, description, decimals, suffix }) => {
  return (
    <div className="py-4 sm:py-5 flex justify-between">
      <dt className="text-sm font-medium primary-text">
        {title}
        {description && <div className="text-xs tertiary-text">{description}</div>}
      </dt>
      <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">
        <CountUp end={value} preserveValue={true} separator="," decimals={decimals} suffix={suffix ?? ""} />
      </dd>
    </div>
  );
};
