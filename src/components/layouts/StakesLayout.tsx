"use client";

import { NextPage } from "next";
import { PageHeader, StakeRow, StakeCard, StakeRowHeaderFooter } from "@/components/ui";
import { Container, CardContainer } from "@/components/containers";
import { Address, Chain, useAccount, useContractReads, useNetwork } from "wagmi";
import { fenixContract } from "@/libraries/fenixContract";
import FENIX_ABI from "@/models/abi/FENIX_ABI";
import { StakeStatus } from "@/models/stake";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";

export interface StakeLayoutDatum {
  title: string;
  subtitle: string;
  stakeStatus: StakeStatus;
}

export const StakesLayout: NextPage<StakeLayoutDatum> = ({ title, subtitle, stakeStatus }) => {
  const [stakeCount, setStakeCount] = useState<number>(0);
  const [allStakes, setAllStakes] = useState<any[]>([]);
  const [equityPoolSupply, setEquityPoolSupply] = useState<number>(0);
  const [equityPoolTotalShares, setEquityPoolTotalShares] = useState<number>(0);

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
    watch: false,
  });

  const { data: allStakesData } = useContractReads({
    contracts: Array.from(Array(stakeCount).keys()).map((stakeIndex) => ({
      ...fenixContract(chain),
      functionName: "stakeFor",
      args: [address, BigNumber.from(stakeIndex)],
    })),
    cacheTime: 30_000,
    watch: false,
  });

  useEffect(() => {
    console.log(allStakesData);
    if (allStakesData) {
      setAllStakes(allStakesData);
    }
    if (readData?.[0] && readData?.[1] && readData?.[2]) {
      setStakeCount(readData[0].toNumber());
      setEquityPoolSupply(Number(ethers.utils.formatUnits(readData[1] ?? 0)));
      setEquityPoolTotalShares(Number(ethers.utils.formatUnits(readData[2] ?? 0)));
    }
  }, [allStakes, allStakesData, readData]);

  return (
    <Container>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="md:hidden">
        <CardContainer className="max-w-2xl">
          <div className="flex flex-col space-y-4 primary-divider">
            {allStakes.map((stake, index) => (
              <>
                {stake.status === stakeStatus && (
                  <StakeCard
                    key={index}
                    stake={stake}
                    stakeIndex={index}
                    equityPoolSupply={equityPoolSupply}
                    equityPoolTotalShares={equityPoolTotalShares}
                  />
                )}
              </>
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
              {allStakes.map((stake, index) => (
                <>
                  {stake.status === stakeStatus && (
                    <StakeRow
                      key={index}
                      stake={stake}
                      stakeIndex={index}
                      equityPoolSupply={equityPoolSupply}
                      equityPoolTotalShares={equityPoolTotalShares}
                    />
                  )}
                </>
              ))}
            </tbody>
          </table>
        </CardContainer>
      </div>
    </Container>
  );
};
