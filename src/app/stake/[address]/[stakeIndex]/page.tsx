"use client";

import { PageHeader } from "@/components/ui";
import { Container } from "@/components/containers";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Address, Chain, useContractRead, useNetwork } from "wagmi";
import { fenixContract } from "@/libraries/fenixContract";

const StakeAddressIndex = () => {
  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { address, stakeIndex } = useParams() as unknown as { address: Address; stakeIndex: number };

  return (
    <main>
      <h1>StakeAddressIndex</h1>
    </main>
  );
};

export default StakeAddressIndex;
