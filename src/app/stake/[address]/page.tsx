"use client";

import { PageHeader } from "@/components/ui";
import { Container } from "@/components/containers";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Address, Chain, useContractRead, useNetwork } from "wagmi";
import { fenixContract } from "@/libraries/fenixContract";

fenixContract;
const StakeAddress = () => {
  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { address } = useParams() as unknown as { address: Address };

  const { data: stakeCount } = useContractRead({
    ...fenixContract(chain),
    functionName: "stakeCount",
    args: [address],
  });

  return (
    <Container>
      <PageHeader
        title="Stakes"
        subtitle={`${address} has ${stakeCount?.toNumber() ?? 0} stakes that are active, deferred or ended`}
      />
      <ul role="list" className="mt-3 grid grid-cols-3 gap-5 sm:grid-cols-6 sm:gap-6 lg:grid-cols-12">
        {Array.from(Array(stakeCount?.toNumber() ?? 0).keys()).map((stakeIndex) => (
          <Link href={`/stake/${address}/${stakeIndex}`} key={stakeIndex}>
            <li className="col-span-1 flex rounded-lg shadow-sm h-10 w-20 items-center justify-center background-gradient text-sm font-mono text-white">
              {stakeIndex}
            </li>
          </Link>
        ))}
      </ul>
    </Container>
  );
};

export default StakeAddress;
