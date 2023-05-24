"use client";

import { clsx } from "clsx";
import { Breadcrumbs } from "@/components/ui";
import { useContext } from "react";
import FenixContext from "@/contexts/FenixContext";
import ConfettiLayout from "@/components/layouts/ConfettiLayout";
import { toast, resolveValue, Toaster } from "react-hot-toast";
import { IconCircleCheck, IconExclamationCircle, IconX } from "@tabler/icons-react";

export default function Container({ className, ...props }: any) {
  const { showConfetti } = useContext(FenixContext);

  return (
    <main>
      <ConfettiLayout play={showConfetti}>
        <Breadcrumbs />
        <div className={clsx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-neutral", className)} {...props}>
          <div className="card-body text-neutral" {...props} />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
          }}
        >
          {(t) => (
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg glass shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {t.type == "success" ? (
                      <IconCircleCheck className="h-6 w-6 text-green-400" aria-hidden="true" />
                    ) : (
                      <IconExclamationCircle className="h-6 w-6 text-red-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    {t.type == "success" ? (
                      <p className="text-sm font-medium primary-text">Success</p>
                    ) : (
                      <p className="text-sm font-medium primary-text">Error</p>
                    )}
                    <p className="mt-1 text-sm secondary-text">{resolveValue(t.message, t)}</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md background-gradient text-white focus:outline-none focus:ring-2 focus:ring-[#FF5320] focus:ring-offset-2"
                      onClick={() => {
                        toast.remove(t.id);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <IconX className="h-5 w-5 p-0.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Toaster>
      </ConfettiLayout>
    </main>
  );
}
