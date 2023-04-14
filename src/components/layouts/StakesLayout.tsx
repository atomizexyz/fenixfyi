"use client";

import { NextPage } from "next";
import { PageHeader, StakeRow, StakeCard, StakeRowHeaderFooter } from "@/components/ui";
import { Container, CardContainer } from "@/components/containers";
import { Address, Chain, useAccount, useContractReads, useNetwork } from "wagmi";
import { fenixContract } from "@/libraries/fenixContract";
import FENIX_ABI from "@/models/abi/FENIX_ABI";
import { StakeStatus } from "@/models/stake";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";

export interface StakeLayoutDatum {
  title: string;
  subtitle: string;
  stakeStatus: StakeStatus;
}

export const StakesLayout: NextPage<StakeLayoutDatum> = ({ title, subtitle, stakeStatus }) => {
  const [stakeCount, setStakeCount] = useState<number>(0);
  const [equityPoolSupply, setEquityPoolSupply] = useState<BigNumber>(BigNumber.from(0));
  const [equityPoolTotalShares, setEquityPoolTotalShares] = useState<BigNumber>(BigNumber.from(0));

  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { address } = useAccount() as unknown as { address: Address };

  const { data: readData } = useContractReads({
    contracts: [
      {
        ...fenixContract(chain),
        functionName: "stakeCount",
        args: [address],
      },
      {
        ...fenixContract(chain),
        functionName: "equityPoolSupply",
      },
      {
        ...fenixContract(chain),
        functionName: "equityPoolTotalShares",
      },
    ],
    watch: true,
  });

  useEffect(() => {
    if (readData) {
      setStakeCount(readData[0].toNumber());
      setEquityPoolSupply(readData[1]);
      setEquityPoolTotalShares(readData[2]);
    }
  }, [readData]);

  return (
    <Container>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="md:hidden">
        <CardContainer className="max-w-2xl">
          <div className="flex flex-col space-y-4 divide-y primary-divider">
            {Array.from(Array(stakeCount).keys()).map((stakeIndex) => (
              <StakeCard
                key={stakeIndex}
                stakeIndex={stakeIndex}
                stakeStatus={stakeStatus}
                equityPoolSupply={equityPoolSupply}
                equityPoolTotalShares={equityPoolTotalShares}
              />
            ))}
          </div>
        </CardContainer>
      </div>
      <div className="hidden md:inline">
        <CardContainer>
          <table className="min-w-full divide-y primary-divider">
            <thead>
              <StakeRowHeaderFooter />
            </thead>
            <tbody className="divide-y secondary-divider">
              {Array.from(Array(stakeCount).keys()).map((stakeIndex) => (
                <StakeRow
                  key={stakeIndex}
                  stakeIndex={stakeIndex}
                  stakeStatus={stakeStatus}
                  equityPoolSupply={equityPoolSupply}
                  equityPoolTotalShares={equityPoolTotalShares}
                />
              ))}
            </tbody>
          </table>
        </CardContainer>
      </div>
    </Container>
  );
};
