"use client";

import { GasEstimate, PageHeader } from "@/components/ui";
import { CardContainer, Container } from "@/components/containers";
import { useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";

import { useState } from "react";
import { Chain, useFeeData, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { useForm } from "react-hook-form";
import { fenixContract } from "@/libraries/fenixContract";
import { BigNumber } from "ethers";
import toast from "react-hot-toast";

export default function StakeAddressIndexEnd() {
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { chain } = useNetwork() as unknown as { chain: Chain };
  const stakeIndex = searchParams.get("stakeIndex") as unknown as number;
  const { data: feeData } = useFeeData({ formatUnits: "gwei", watch: true });

  const {
    handleSubmit,
    formState: {},
  } = useForm({
    mode: "onChange",
  });

  const { config } = usePrepareContractWrite({
    ...fenixContract(chain),
    functionName: "endStake",
    args: [BigNumber.from(stakeIndex)],
    enabled: !disabled,
  });

  const { data, write } = useContractWrite({
    ...config,
    onSuccess(_data) {
      setProcessing(true);
      setDisabled(true);
    },
    onError(_error) {
      setProcessing(false);
      setDisabled(false);
    },
  });

  const {} = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(_data) {
      toast.success("Your stake has been successfully ended and rewards collected.");
      router.push("/stake/ended");
    },
    onError(_error) {
      toast.error("Ending your stake was unsuccessful. Please try again later.");
    },
  });

  const handleEndSubmit = (_data: any) => {
    write?.();
  };

  return (
    <Container className="max-w-xl">
      <PageHeader title="End Stake" subtitle="End your stake and deposit FENIX in your wallet." />

      <CardContainer>
        <form onSubmit={handleSubmit(handleEndSubmit)} className="space-y-6">
          <div className="form-control w-full">
            <button
              type="submit"
              className={clsx("flex w-full justify-center primary-button", {
                loading: processing,
              })}
              disabled={disabled}
            >
              End Stake
            </button>
          </div>
          <GasEstimate gasPrice={feeData?.gasPrice} gasLimit={config?.request?.gasLimit} />
        </form>
      </CardContainer>
    </Container>
  );
}
