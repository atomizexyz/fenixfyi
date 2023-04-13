import Link from "next/link";

export const CTA = () => {
  return (
    <div className="relative isolate mt-32 px-6 pb-32 sm:mt-56 sm:pb-40 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight primary-text sm:text-4xl">
          Ready to dive in?
          <br />
          Mint FENIX today!
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 secondary-text">
          FENIX is designed to reward crypto community members who believe in the crypto first principles of
          self-custody, transparency, trust through consensus, and permissionless value exchange without counterparty
          risk.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/dashboard" className="primary-button">
            Launch App
          </Link>
          <Link href="https://github.com/atomizexyz/litepaper" className="text-sm font-semibold leading-6 primary-link">
            Read Fenix Litepaper <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
