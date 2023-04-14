"use client";

import { PageHeader, StakeCard } from "@/components/ui";
import { CardContainer, Container } from "@/components/containers";
import { useParams } from "next/navigation";
import { Address } from "wagmi";
import { StakeStatus } from "@/models/stake";

const StakeAddressIndex = () => {
  const { address, stakeIndex } = useParams() as unknown as { address: Address; stakeIndex: number };

  return (
    <Container>
      <PageHeader title="Stake" subtitle={`${address} stake ${stakeIndex}`} />

      <div className="lg:col-start-3 lg:row-end-1">
        <h2 className="sr-only">Summary</h2>
        <CardContainer>
          <StakeCard key={stakeIndex} stakeIndex={stakeIndex} stakeStatus={StakeStatus.ALL} />
        </CardContainer>
      </div>
    </Container>
  );
};

export default StakeAddressIndex;
