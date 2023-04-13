import Image from "next/image";
import { features } from "@/models/features";

export const Features = () => {
  return (
    <div className="mt-32 sm:mt-56">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-base font-semibold leading-7 tertiary-text">We are XEN</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight primary-text sm:text-4xl">First Principles of Crypto.</p>
          <p className="mt-6 text-lg leading-8 secondary-text">
            FENIX is designed to reward crypto community members who believe in the Crypto&apos;s First Principles of
            self-custody, transparency, trust through consensus, and permissionless value exchange without counterparty
            risk.
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Image
            src="/images/product-dark.png"
            alt="App screenshot"
            className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-white/10"
            width={2432}
            height={1442}
          />
          <div className="relative" aria-hidden="true">
            <div className="absolute -inset-x-20 bottom-0 primary-gradient" />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-neutral-700 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold primary-text">
                <feature.icon className="absolute left-1 top-1 h-5 w-5 secondary-text" aria-hidden="true" />
                {feature.name}
              </dt>{" "}
              <dd className="inline secondary-text">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};
