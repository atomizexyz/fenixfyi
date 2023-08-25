import { Address, Chain } from "wagmi";
import {
  avalanche,
  bsc,
  evmos,
  fantom,
  foundry,
  goerli,
  localhost,
  mainnet,
  moonbeam,
  polygon,
  polygonMumbai,
  dogechain,
  okc,
  base,
  pulsechainV4,
  pulsechain,
} from "@wagmi/chains";

import FENIX_ABI from "@/models/abi/FENIX_ABI";
import { ethereumPoW, x1Devnet } from "@/libraries/chains";

export const fenixContract = (contractChain?: Chain) => {
  switch (contractChain?.id) {
    case foundry.id:
    case localhost.id:
      return {
        address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    case goerli.id:
      return {
        address: "0x5bD859C89d626e9E2aA96e5c1f0E80360Aa64212" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    case polygonMumbai.id:
      return {
        address: "0x029cE5736854Ca1e064A7822a17657E274E805a7" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    case x1Devnet.id:
      return {
        address: "0xD70e4671C0306609CB546483405edD723B4a09A9" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    case pulsechainV4.id:
      return {
        address: "0xd2ac6954b3f08f7024E90CFAe252fb8c06c0a868" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    case mainnet.id:
    case polygon.id:
    case bsc.id:
    case avalanche.id:
    case moonbeam.id:
    case fantom.id:
    case dogechain.id:
    case okc.id:
    case ethereumPoW.id:
    case pulsechain.id:
      return {
        address: "0xC3e8abfA04B0EC442c2A4D65699a40F7FcEd8055" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    case evmos.id:
      return {
        address: "0x7c27d2D2044FE90Cb98f5ECdc235839FdE740124" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    case base.id:
      return {
        address: "0x07FdE3eD7727c1D84171A6e5815964d50827CF69" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    default:
      return {
        address: "" as Address,
        abi: FENIX_ABI,
      };
  }
};
