"use client";

import clsx from "clsx";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { CardContainer, Container } from "@/components/containers";
import { GasEstimate, PageHeader, DescriptionDatum } from "@/components/ui";
import {
  Chain,
  useContractWrite,
  useFeeData,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractReads,
} from "wagmi";
import FENIX_ABI from "@/models/abi/FENIX_ABI";
import { fenixContract } from "@/libraries/fenixContract";
import { ethers } from "ethers";

export default function Reward() {
  const [disabled, setDisabled] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { data: feeData } = useFeeData({ formatUnits: "gwei", watch: true });

  const {
    handleSubmit,
    formState: {},
  } = useForm({
    mode: "onChange",
  });

  const { config } = usePrepareContractWrite({
    address: fenixContract(chain).address,
    abi: FENIX_ABI,
    functionName: "flushRewardPool",
    enabled: !disabled,
  });

  const { data: writeData, write } = useContractWrite({
    ...config,
    onSuccess(_data) {
      setProcessing(true);
      setDisabled(true);
    },
  });

  const {} = useWaitForTransaction({
    hash: writeData?.hash,
    onSuccess(_data) {
      console.log("Success");
    },
  });

  const handleEndSubmit = (_data: any) => {
    write?.();
  };

  const { data: readData } = useContractReads({
    contracts: [
      {
        ...fenixContract(chain),
        functionName: "cooldownUnlockTs",
      },
      {
        ...fenixContract(chain),
        functionName: "equityPoolSupply",
      },
      {
        ...fenixContract(chain),
        functionName: "rewardPoolSupply",
      },
    ],
    watch: true,
  });

  return (
    <Container className="max-w-xl">
      <PageHeader title="Reward" subtitle="Any user can claim the the reward once the cooldown has elapses." />

      <CardContainer>
        <form onSubmit={handleSubmit(handleEndSubmit)} className="space-y-6">
          <div className="mt-5">
            <dl className="sm:divide-y sm:secondary-divider">
              <DescriptionDatum title="Matures In" datum={ethers.utils.formatUnits(readData?.[0] ?? 0)} />
              <DescriptionDatum title="Stake Pool Supply" datum={ethers.utils.formatUnits(readData?.[1] ?? 0)} />
              <DescriptionDatum title="Reward Pool Supply" datum={ethers.utils.formatUnits(readData?.[2] ?? 0)} />
            </dl>
          </div>

          <div>
            <button
              type="submit"
              className={clsx("flex w-full justify-center primary-button", {
                loading: processing,
              })}
            >
              Claim Reward
            </button>
          </div>
          <GasEstimate gasPrice={feeData?.gasPrice} gasLimit={config?.request?.gasLimit} />
        </form>
      </CardContainer>
    </Container>
  );
}
