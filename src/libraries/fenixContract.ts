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
} from "wagmi/chains";

import FENIX_ABI from "@/models/abi/FENIX_ABI";
import { pulseChain, x1Devnet } from "@/libraries/chains";

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
    case pulseChain.id:
      return {
        address: "0x27D0497a4B4E07AF5f7043b63c7dB53d5F0629E6" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    case dogechain.id:
    case fantom.id:
    case avalanche.id:
    case bsc.id:
    case polygon.id:
    case evmos.id:
    case moonbeam.id:
    case mainnet.id:
    default:
      return {
        address: "" as Address,
        abi: FENIX_ABI,
        chainId: mainnet.id,
      };
  }
};
