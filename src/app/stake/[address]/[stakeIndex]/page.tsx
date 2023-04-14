"use client";

import { NextPage } from "next";
import { PageHeader, StakeCard } from "@/components/ui";
import { CardContainer, Container } from "@/components/containers";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Address, Chain, useContractReads, useNetwork } from "wagmi";
import { fenixContract } from "@/libraries/fenixContract";
import FENIX_ABI from "@/models/abi/FENIX_ABI";
import { StakeStatus } from "@/models/stake";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";

const StakeAddressIndex = () => {
  const [equityPoolSupply, setEquityPoolSupply] = useState<BigNumber>(BigNumber.from(0));
  const [equityPoolTotalShares, setEquityPoolTotalShares] = useState<BigNumber>(BigNumber.from(0));
  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { address, stakeIndex } = useParams() as unknown as { address: Address; stakeIndex: number };

  const { data: readData } = useContractReads({
    contracts: [
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
      setEquityPoolSupply(readData[0]);
      setEquityPoolTotalShares(readData[1]);
    }
  }, [readData]);

  return (
    <Container>
      <PageHeader title="Stake" subtitle={`${address} stake ${stakeIndex}`} />

      <div className="lg:col-start-3 lg:row-end-1">
        <h2 className="sr-only">Summary</h2>
        <CardContainer>
          <StakeCard
            key={stakeIndex}
            stakeIndex={stakeIndex}
            stakeStatus={StakeStatus.ALL}
            equityPoolSupply={equityPoolSupply}
            equityPoolTotalShares={equityPoolTotalShares}
          />
        </CardContainer>
      </div>
    </Container>
  );
};

export default StakeAddressIndex;
