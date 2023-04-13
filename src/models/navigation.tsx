import { IconBrandGithub, IconBrandTelegram, IconBrandTwitter } from "@tabler/icons-react";
import { SVGProps } from "react";

export const navigation = {
  header: [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Burn", href: "/burn" },
    { name: "Stake", href: "/stake" },
    { name: "Reward", href: "/reward" },
  ],
  footer: [
    { name: "Litepaper", href: "http://github.com/atomizexyz/litepaper" },
    { name: "Brand", href: "https://brand.fenix.fyi/" },
    { name: "Source Code", href: "https://github.com/atomizexyz/fenixfyi" },
  ],
  social: [
    {
      name: "Twitter",
      href: "https://twitter.com/fenix_protocol",
      icon: IconBrandTwitter,
    },
    {
      name: "Telegram",
      href: "https://t.me/fenix_protocol",
      icon: IconBrandTelegram,
    },

    {
      name: "GitHub",
      href: "https://github.com/atomizexyz",
      icon: IconBrandGithub,
    },
  ],
};
