import {
  IconFlame,
  IconArrowBigDownLines,
  IconClock,
  IconFileText,
  IconLockOpen,
  IconProgress,
  IconRotateClockwise,
  IconRotateClockwise2,
} from "@tabler/icons-react";

export const burn = [
  { name: "Get XEN", description: "Mint XEN to burn for FENIX", href: "/burn/get", icon: IconArrowBigDownLines },
  {
    name: "Approve FENIX",
    description: "Approve FENIX contract to burn your XEN",
    href: "/burn/approve",
    icon: IconLockOpen,
  },
  { name: "Burn XEN", description: "Burn your XEN and mint FENIX", href: "/burn", icon: IconFlame },
];
export const callsToAction = [
  { name: "XEN Litepaper", href: "https://faircrypto.org/xencryptolp.pdf", icon: IconFileText },
  { name: "FENIX Litepaper", href: "https://github.com/atomizexyz/litepaper", icon: IconFileText },
];
export const stake = [
  {
    name: "Start Stake",
    href: "/stake",
    description: "Start a new FENIX stake",
    icon: IconClock,
  },
  {
    name: "Active Stakes",
    href: "/stake/active",
    description: "View your active FENIX stakes",
    icon: IconProgress,
  },
  {
    name: "Deferred Stakes",
    href: "/stake/deferred",
    description: "View your deferred FENIX stakes",
    icon: IconRotateClockwise2,
  },
  {
    name: "Ended Stakes",
    href: "/stake/ended",
    description: "View your ended FENIX stakes",
    icon: IconRotateClockwise,
  },
];
