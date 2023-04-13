const stats = [
  { id: 1, name: "Active Chains", value: "1" },
  { id: 2, name: "Active Wallets", value: "1" },
  { id: 3, name: "Telegram Community", value: "1400" },
  { id: 4, name: "Twitter Community", value: "2000" },
];

export const Stats = () => {
  return (
    <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
        <h2 className="text-base font-semibold leading-8 tertiary-text">Our community</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight primary-text sm:text-4xl">
          A huge multi-chain community is waiting for you.
        </p>
        <p className="mt-6 text-lg leading-8 secondary-text">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste
          dolor cupiditate blanditiis ratione.
        </p>
      </div>
      <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-black sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.id} className="flex flex-col gap-y-3 border-l border-white/10 pl-6">
            <dt className="text-sm leading-6 secondary-text">{stat.name}</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight primary-text">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
