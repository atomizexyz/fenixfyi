import { NextPage } from "next";
import Countdown from "react-countdown";

interface CountDownDatumProps {
  title: string;
  value: Date;
}

export const CountDownDatum: NextPage<CountDownDatumProps> = ({ title, value }) => {
  return (
    <div className="py-4 sm:py-5 flex justify-between">
      <dt className="text-sm font-medium primary-text">{title}</dt>
      <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text">
        <Countdown
          date={value}
          precision={3}
          renderer={({ days, hours, minutes, seconds }) => (
            <div>
              <span className="font-mono">{days}</span>
              <span className="tertiary-text">d : </span>
              <span className="font-mono">{hours}</span>
              <span className="tertiary-text">h : </span>
              <span className="font-mono">{minutes}</span>
              <span className="tertiary-text">m : </span>
              <span className="font-mono">{seconds}</span>
              <span className="tertiary-text">s</span>
            </div>
          )}
        />
      </dd>
    </div>
  );
};
