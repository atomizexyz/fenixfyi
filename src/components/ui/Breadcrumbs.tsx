"use client";

import { IconChevronRight, IconHome } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const path = pathname.split("/").filter((item) => item !== "");

  return (
    <nav className="flex mx-auto max-w-7xl overflow-hidden py-4 px-6 lg:px-8" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link href="/" className="secondary-link">
              <IconHome className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {path.map((name, index) => {
          const href = `/${path.slice(0, index + 1).join("/")}`;

          return (
            <li key={index}>
              <div className="flex items-center">
                <IconChevronRight className="h-4 w-4 flex-shrink-0 primary-element" aria-hidden="true" />
                <Link href={href} className="ml-4 text-sm secondary-link capitalize">
                  {name}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
