import Link from "next/link";
import { communityProjects } from "@/models/community";

export const Logos = () => {
  return (
    <div className="mx-auto mt-8 max-w-7xl px-6 sm:mt-16 lg:px-8">
      <h2 className="text-center text-lg font-semibold leading-8 secondary-text">
        FENIX is part of the XEN ecosystem, a collection of projects that are building the future of DeFi.
      </h2>
      <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {communityProjects.map((project) => (
          <Link href={project.href} className="flex flex-col items-center" key={project.name}>
            <project.logo className="primary-text" aria-hidden="true" />
          </Link>
        ))}
      </div>
      <div className="mt-16 flex justify-center">
        <p className="relative rounded-full px-4 py-1.5 text-sm leading-6 glass">
          <span className="hidden md:inline primary-text">
            The XEN ecosystem is the fastest growing DeFi ecosystem in the world.
          </span>
          <Link href="https://faircrypto.org" className="font-semibold primary-link">
            <span className="absolute inset-0" aria-hidden="true" /> Learn more about Fair Crypto{" "}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </p>
      </div>
    </div>
  );
};
