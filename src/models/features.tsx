import {
  IconCurrencyDollarOff,
  IconCurrencyEthereum,
  IconDiamondOff,
  IconFlame,
  IconGhostOff,
  IconInfinity,
  IconKeyOff,
  IconScale,
  IconShieldLock,
  IconTrendingUp,
  IconDoorOff,
  IconPigOff,
} from "@tabler/icons-react";

export const features = [
  {
    name: "Audited.",
    description: "Contract audited by Certik and an independent Auditor. ",
    icon: IconShieldLock,
  },

  {
    name: "Proof Of Burn.",
    description: "FENIX rises from the ashes of burned XEN.",
    icon: IconFlame,
  },
  {
    name: "Inflationary.",
    description: "FENIX pays inflation to the stakers at a fixed rate of 1.61% a year forever.",
    icon: IconTrendingUp,
  },
  {
    name: "Fair Launch.",
    description:
      "Equitable initial investment distribution ensures all stakeholders have an equal opportunity to participate and benefit.",
    icon: IconScale,
  },
  {
    name: "Hyperstructure.",
    description:
      "Crypto protocols that can run for free and forever, without maintenance, interruption or intermediaries.",
    icon: IconInfinity,
  },

  {
    name: "Cross-Chain.",
    description: "FENIX seamlessly operates across every chain XEN supports.",
    icon: IconCurrencyEthereum,
  },

  {
    name: "No Pre-mine.",
    description: "FENIX supply starts at zero, all tokens are minted from the community.",
    icon: IconDiamondOff,
  },
  {
    name: "No Admin Keys.",
    description: "FENIX can not be turned off, upgraded, downgraded by any admin.",
    icon: IconKeyOff,
  },

  {
    name: "No Sacrifice/ICO.",
    description: "No money was raised from the community to build and deploy FENIX.",
    icon: IconCurrencyDollarOff,
  },
  {
    name: "No Origin Address.",
    description: "There is no centralized economic entity that controls an outsized token supply.",
    icon: IconGhostOff,
  },
  {
    name: "No Investor Allocation.",
    description: "There is no token allocation set aside for insiders, investors, or founders.",
    icon: IconPigOff,
  },
  {
    name: "No Back Doors.",
    description: "No way for any contract or address to change the rules of the FENIX protocol.",
    icon: IconDoorOff,
  },
];
