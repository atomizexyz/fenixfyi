import { values } from "@/models/values";

export const Values = () => {
  return (
    <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-base font-semibold leading-7 tertiary-text">Our Values</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight primary-text sm:text-4xl">
          Stop trading your time for money.
        </p>
        <p className="mt-6 text-lg leading-8 secondary-text">
          Unlock your wealth potential with our innovative protocol, maximizing equity growth, harnessing market
          longevity, and redistributing penalties for a smarter, more prosperous future
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          {values.map((feature) => (
            <div key={feature.name} className="flex flex-col">
              <dt className="text-base font-semibold leading-7 primary-text">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg glass">
                  <feature.icon className="h-6 w-6 secondary-text" aria-hidden="true" />
                </div>
                {feature.name}
              </dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 secondary-text">
                <p className="flex-auto">{feature.description}</p>
                <p className="mt-6">
                  <a href={feature.href} className="text-sm font-semibold leading-6 primary-link">
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};
