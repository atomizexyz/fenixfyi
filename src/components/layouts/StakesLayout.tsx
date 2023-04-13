"use client";

import { NextPage } from "next";
import { PageHeader, StakeRow, StakeCard, StakeRowHeaderFooter } from "@/components/ui";
import { Container, CardContainer } from "@/components/containers";
import { Address, Chain, useAccount, useContractRead, useNetwork } from "wagmi";

import { fenixContract } from "@/libraries/fenixContract";
import FENIX_ABI from "@/models/abi/FENIX_ABI";
import { StakeStatus } from "@/models/stake";

export interface StakeLayoutDatum {
  title: string;
  subtitle: string;
  stakeStatus: StakeStatus;
}

export const StakesLayout: NextPage<StakeLayoutDatum> = ({ title, subtitle, stakeStatus }) => {
  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { address } = useAccount() as unknown as { address: Address };
  const { stakeCount } = useContractRead({
    address: fenixContract(chain).address,
    abi: FENIX_ABI,
    functionName: "stakeCount",
    args: [address],
  }) as unknown as { stakeCount: number };

  return (
    <Container>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="md:hidden">
        <CardContainer className="max-w-2xl">
          <div className="flex flex-col space-y-4 divide-y primary-divider">
            {Array.from(Array(stakeCount ?? 0).keys()).map((stakeIndex) => (
              <StakeCard key={stakeIndex} stakeIndex={stakeIndex} stakeStatus={stakeStatus} />
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
              {Array.from(Array(stakeCount ?? 0).keys()).map((stakeIndex) => (
                <StakeRow key={stakeIndex} stakeIndex={stakeIndex} stakeStatus={stakeStatus} />
              ))}
            </tbody>
          </table>
        </CardContainer>
      </div>
    </Container>
  );
};
