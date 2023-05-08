"use client";

import React, { createContext, useEffect, useState } from "react";
import { Address } from "@wagmi/core";
import { BigNumber } from "ethers";
import { Chain, useContractRead, useNetwork } from "wagmi";
import { fenixContract } from "@/libraries/fenixContract";
import { watchContractEvent } from "@wagmi/core";
import { differenceInSeconds } from "date-fns";

export interface UserMint {
  user: string;
  amplifier: BigNumber;
  eaaRate: BigNumber;
  maturityTs: BigNumber;
  rank: BigNumber;
  term: BigNumber;
}

export interface UserStake {
  amount: BigNumber;
  apy: BigNumber;
  maturityTs: BigNumber;
  term: BigNumber;
}

export interface Formatted {
  gasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
}

export interface FeeData {
  formatted: Formatted;
  gasPrice: BigNumber;
  lastBaseFeePerGas: BigNumber;
  maxFeePerGas: BigNumber;
  maxPriorityFeePerGas: BigNumber;
}

export interface TotalSupply {
  formatted: string;
  value: BigNumber;
}

export interface Token {
  address: Address;
  decimals: number;
  name: string;
  symbol: string;
  totalSupply: TotalSupply;
}

export interface Balance {
  decimals: number;
  formatted: string;
  symbol: string;
  value: BigNumber;
}

interface IFenixContext {
  showConfetti: boolean;
  feeData?: FeeData;
}

const FenixContext = createContext<IFenixContext>({
  showConfetti: false,
  feeData: undefined,
});

export const FenixProvider = ({ children }: any) => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const { chain } = useNetwork() as unknown as { chain: Chain };
  const unwatch = watchContractEvent(
    {
      ...fenixContract(chain),
      eventName: "FlushRewardPool",
    },
    (_reward) => {
      setShowConfetti(true);
    }
  );
  const { data: cooldownUnlockTs } = useContractRead({
    ...fenixContract(chain),
    functionName: "cooldownUnlockTs",
    watch: false,
  });

  useEffect(() => {
    const cooldownUnlockMs = Number(cooldownUnlockTs);
    const differenceTs = differenceInSeconds(new Date(cooldownUnlockMs * 1000), new Date());
    if (differenceTs > 0 && differenceTs < 120) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [cooldownUnlockTs]);

  return <FenixContext.Provider value={{ showConfetti }}>{children}</FenixContext.Provider>;
};

export default FenixContext;
