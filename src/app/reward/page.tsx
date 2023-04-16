"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CardContainer, Container } from "@/components/containers";
import { GasEstimate, PageHeader } from "@/components/ui";
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
import { toast } from "react-hot-toast";
import { DateDatum, CountUpDatum, CountDownDatum } from "@/components/ui/datum";

export default function Reward() {
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [matureDate, setMatureDate] = useState<Date>(new Date());
  const [stakePoolSupply, setStakePoolSupply] = useState<number>(0);
  const [rewardPoolSupply, setRewardPoolSupply] = useState<number>(0);

  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { data: feeData } = useFeeData({ formatUnits: "gwei", watch: true });

  const {
    handleSubmit,
    formState: { errors, isValid },
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
      toast.success("Reward pool party initiated. Let the celebration begin!");
    },
    onError(_error) {
      toast.error("Unable to initiate the reward pool party. Please try again later.");
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

  useEffect(() => {
    if (readData?.[0] !== undefined) {
      const coolDownUnlockTs = Number(readData?.[0] ?? 0);
      const date = new Date(coolDownUnlockTs * 1000);
      setMatureDate(date);
    }
    if (readData?.[1] !== undefined) {
      const equityPoolSupply = ethers.utils.formatUnits(readData?.[1] ?? 0);
      setStakePoolSupply(Number(equityPoolSupply));
    }
    if (readData?.[2] !== undefined) {
      const rewardPoolSupply = ethers.utils.formatUnits(readData?.[2] ?? 0);
      setRewardPoolSupply(Number(rewardPoolSupply));
    }
    setDisabled(!isValid);
  }, [isValid, readData]);

  return (
    <Container className="max-w-xl">
      <PageHeader title="Reward" subtitle="Any user can claim the the reward once the cooldown has elapses." />

      <CardContainer>
        <form onSubmit={handleSubmit(handleEndSubmit)} className="space-y-6">
          <div className="mt-5">
            <dl className="divide-y secondary-divider">
              <DateDatum title="Maturity Date" value={matureDate} />
              <CountDownDatum title="Count Down" value={matureDate} />
              <CountUpDatum title="Reward Pool Supply" value={rewardPoolSupply} suffix=" FENIX" />
              <CountUpDatum title="Stake Pool Supply" value={stakePoolSupply} suffix=" FENIX" />
            </dl>
          </div>

          <div>
            <button
              type="submit"
              className={clsx("flex w-full justify-center primary-button", {
                loading: processing,
              })}
              disabled={disabled}
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
