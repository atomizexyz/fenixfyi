import {
  AvalancheIcon,
  BinanceSmartChainIcon,
  DogeChainIcon,
  EthereumIcon,
  EthereumPOWIcon,
  EVMOSIcon,
  FantomIcon,
  FoundryIcon,
  MoonbeamIcon,
  OKChainIcon,
  PolygonIcon,
  PulseChainIcon,
  X1Icon,
} from "@/components/ui/ChainIcons";
import { IconHome } from "@tabler/icons-react";

export const FENIX_MAX_STAKE_LENGTH = 7777;
export const UTC_TIME = new Date().getTime() / 1000;
export const ONE_DAY_TS = 86400;
export const ONE_EIGHTY_DAYS_TS = 180 * ONE_DAY_TS;
export const WALLET_ADDRESS_REGEX = new RegExp(`^(0x[0-9a-fA-F]{40})(,0x[0-9a-fA-F]{40})*$`);
export const chainIcons: Record<number, JSX.Element> = {
  1: <EthereumIcon />,
  5: <EthereumIcon />,
  56: <BinanceSmartChainIcon />,
  66: <OKChainIcon />,
  97: <BinanceSmartChainIcon />,
  137: <PolygonIcon />,
  250: <FantomIcon />,
  942: <PulseChainIcon />,
  1284: <MoonbeamIcon />,
  1337: <IconHome className="h-5 w-5" />,
  2000: <DogeChainIcon />,
  9001: <EVMOSIcon />,
  10001: <EthereumPOWIcon />,
  43114: <AvalancheIcon />,
  80001: <PolygonIcon />,
  31337: <FoundryIcon />,
  202212: <X1Icon />,
};
