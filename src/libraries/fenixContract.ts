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
        address: "0x0165878A594ca255338adfa4d48449f69242Eb8F" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    case goerli.id:
      return {
        address: "0xE3bf463862ECA89c7f39D3108c4f9f01D1dDE6C6" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    case polygonMumbai.id:
      return {
        address: "0xCdD5536bCCf4c34a3b5E6B111f9da41B28ae50F1" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    case x1Devnet.id:
      return {
        address: "0x79E968E74618C24BA48D8DC2D3673fD23B68A07f" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    case pulseChain.id:
      return {
        address: "0xd2ac6954b3f08f7024E90CFAe252fb8c06c0a868" as Address,
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
