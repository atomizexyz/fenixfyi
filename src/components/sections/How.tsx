import { how } from "@/models/how";

export const How = () => {
  return (
    <div className="pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="mt-2 text-3xl font-bold tracking-tight primary-text sm:text-4xl">How it works</p>
          <p className="mt-6 text-lg leading-8 secondary-text">
            FENIX leverages open source code on public blockchains to provide a hyperstructure that rewards crypto
            stakers for delayed gratification.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {how.map((how) => (
              <div key={how.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 primary-text">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg background-gradient">
                    <how.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {how.name}
                </dt>
                <dd className="mt-2 text-base leading-7 secondary-text">{how.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default how;
