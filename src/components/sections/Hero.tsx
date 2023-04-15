import { IconChevronRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export const Hero = () => {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-40 lg:flex lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <Link href="https://twitter.com/FENIX_protocol" className="inline-flex space-x-6">
              <span className="rounded-full px-3 py-1 text-sm font-semibold leading-6 primary-link ring-1 ring-inset glass">
                Latest updates
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 secondary-text">
                <span>Follow us on Twitter</span>
                <IconChevronRight className="h-5 w-5 primary-element" aria-hidden="true" />
              </span>
            </Link>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight sm:text-7xl primary-text">
            Empower your crypto, earn while you hold{" "}
            <Link href="/dashboard" className="fenix-gradient">
              Fenix
            </Link>
          </h1>
          <p className="mt-6 text-lg leading-8 secondary-text">
            FENIX is designed to reward crypto community members who believe in the crypto first principles of
            self-custody, transparency, trust through consensus, and permissionless value exchange without counterparty
            risk.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link href="/dashboard" className="primary-button">
              Launch App
            </Link>
            <Link
              href="https://github.com/atomizexyz/litepaper"
              className="text-sm font-semibold leading-6 primary-link"
            >
              Read Fenix Litepaper <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <picture>
              <source srcSet="/images/product-dark.png" media="(prefers-color-scheme: dark)" />
              <img
                src="/images/product-light.png"
                alt="FENIX App screenshot"
                width={2128}
                height={1262}
                className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-black/10 dark:ring-white/10"
              />
            </picture>
          </div>
        </div>
      </div>
    </div>
  );
};
