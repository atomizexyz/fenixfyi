"use client";

import Image from "next/image";
import { Fragment, useState } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { FenixText } from "@/components/Icons";
// import ConnectButton from "./ConnectButton";
import { burn, callsToAction, stake } from "@/models/menu";
import { IconChevronDown, IconMenu2, IconX } from "@tabler/icons-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header>
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5 flex space-x-2 items-center">
            <span className="sr-only">FENIX</span>
            <Image className="h-10 w-auto" src="/images/fenix-logo.svg" alt="" width={32} height={32} />
            <FenixText className="primary-text hidden lg:flex w-24 h-6" />
          </a>
        </div>
        <div className="flex lg:hidden space-x-4">
          {/* <ConnectButton /> */}
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-950 dark:text-neutral-50"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <IconMenu2 className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <a href="/dashboard" className="text-sm font-semibold leading-6 primary-link">
            Dashboard
          </a>

          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 primary-link">
              Burn
              <IconChevronDown className="h-5 w-5 flex-none primary-element" aria-hidden="true" />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl shadow-lg ring-1 ring-gray-900/5 glass">
                <div className="p-4">
                  {burn.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
                    >
                      <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg glass secondary-background-group-hover">
                        <item.icon className="h-6 w-6 secondary-group-hover" aria-hidden="true" />
                      </div>
                      <div className="flex-auto">
                        <a href={item.href} className="block font-semibold primary-link">
                          {item.name}
                          <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 secondary-text">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 divide-x secondary-divider glass">
                  {callsToAction.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 primary-link"
                    >
                      <item.icon className="h-5 w-5 flex-none secondary-text" aria-hidden="true" />
                      {item.name}
                    </a>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 primary-link">
              Stake
              <IconChevronDown className="h-5 w-5 flex-none primary-element" aria-hidden="true" />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-96 rounded-3xl p-4 shadow-lg ring-1 ring-gray-900/5 glass">
                {stake.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
                  >
                    <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg glass secondary-background-group-hover">
                      <item.icon className="h-6 w-6 secondary-group-hover" aria-hidden="true" />
                    </div>
                    <div className="flex-auto">
                      <a href={item.href} className="block font-semibold primary-link">
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                      <p className="mt-1 secondary-text">{item.description}</p>
                    </div>
                  </div>
                ))}
              </Popover.Panel>
            </Transition>
          </Popover>

          <a href="/reward" className="text-sm font-semibold leading-6 primary-link">
            Reward
          </a>
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">{/* <ConnectButton /> */}</div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 flex w-full flex-col justify-between overflow-y-auto glass sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <a href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Your stake</span>
                <Image className="h-8 w-auto" src="/images/fenix-logo.svg" alt="" width={32} height={32} />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-950 dark:text-neutral-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <IconX className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <a
                    href="/dashboard"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 primary-link"
                  >
                    Dashboard
                  </a>
                </div>
                <div className="space-y-2 py-6">
                  {burn.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group -mx-3 flex items-center gap-x-6 rounded-lg p-3 text-base font-semibold leading-7 primary-link"
                    >
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg glass secondary-background-group-hover">
                        <item.icon className="h-6 w-6 secondary-group-hover" aria-hidden="true" />
                      </div>
                      {item.name}
                    </a>
                  ))}
                </div>

                <div className="space-y-2 py-6">
                  {stake.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group -mx-3 flex items-center gap-x-6 rounded-lg p-3 text-base font-semibold leading-7 primary-link"
                    >
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg glass secondary-background-group-hover">
                        <item.icon className="h-6 w-6 secondary-group-hover" aria-hidden="true" />
                      </div>
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="space-y-2 py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 primary-link"
                  >
                    Reward
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 grid grid-cols-2 divide-x secondary-divider glass text-center">
            {callsToAction.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="p-3 text-base font-semibold leading-7 primary-link hover:bg-gray-100"
              >
                {item.name}
              </a>
            ))}
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
