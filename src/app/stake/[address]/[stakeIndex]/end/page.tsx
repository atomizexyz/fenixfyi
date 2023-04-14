"use client";

import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { GasEstimate, PageHeader } from "@/components/ui";
import { CardContainer, Container } from "@/components/containers";
import { useParams } from "next/navigation";
import { clsx } from "clsx";

import { useContext, useEffect, useState } from "react";
import {
  Address,
  Chain,
  useFeeData,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { fenixContract } from "@/libraries/fenixContract";
import Link from "next/link";
import { BigNumber } from "ethers";
import toast from "react-hot-toast";

export default function StakeAddressIndexEnd() {
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);

  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { stakeIndex } = useParams() as unknown as { address: Address; stakeIndex: number };
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
  });

  const {} = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(_data) {
      toast("Stake ended successfully", { icon: "🎉" });
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
