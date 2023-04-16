import { NextPage } from "next";

interface DateDatumProps {
  title: string;
  value: Date;
}

export const DateDatum: NextPage<DateDatumProps> = ({ title, value }) => {
  return (
    <div className="py-4 sm:py-5 flex justify-between">
      <dt className="text-sm font-medium primary-text">{title}</dt>
      <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text">{value.toLocaleString()}</dd>
    </div>
  );
};
