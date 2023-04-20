"use client";

import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { GasEstimate, PageHeader } from "@/components/ui";
import { CardContainer, Container } from "@/components/containers";
import { useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";

import { useEffect, useState } from "react";
import {
  Address,
  Chain,
  useFeeData,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractReads,
} from "wagmi";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { fenixContract } from "@/libraries/fenixContract";
import { WALLET_ADDRESS_REGEX } from "@/utilities/constants";
import { BigNumber, ethers } from "ethers";
import toast from "react-hot-toast";
import { WalletAddressField } from "@/components/ui/forms";
import { TextDatum, CountUpDatum, DateDatum } from "@/components/ui/datum";
import { StakeStatus } from "@/models/stake";
import { calculateProgress } from "@/utilities/helpers";
import CountUp from "react-countup";

const StakeAddressIndexDefer = () => {
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [startMs, setStartMs] = useState<Date>(new Date());
  const [endMs, setEndMs] = useState<Date>(new Date());
  const [principal, setPrincipal] = useState<number>(0);
  const [shares, setShares] = useState<number>(0);
  const [payout, setPayout] = useState<number>(0);
  const [projectedPayout, setProjectedPayout] = useState<number>(0);
  const [penalty, setPenalty] = useState<number>(0);
  const [progress, setProgress] = useState<string>("0%");
  const [clampedProgress, setClampedProgress] = useState<number>(0);
  const [status, setStatus] = useState(0);
  const [stake, setStake] = useState<any>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const address = searchParams.get("address") as unknown as Address;
  const stakeIndex = searchParams.get("stakeIndex") as unknown as number;

  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { data: feeData } = useFeeData({ formatUnits: "gwei", watch: true });
  const { data: readsData } = useContractReads({
    contracts: [
      {
        ...fenixContract(chain),
        functionName: "stakeFor",
        args: [address, BigNumber.from(stakeIndex)],
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
    watch: true,
  });

  const { data: rewardPayout } = useContractReads({
    contracts: [
      {
        ...fenixContract(chain),
        functionName: "calculateEarlyPayout",
        args: [stake],
      },
      {
        ...fenixContract(chain),
        functionName: "calculateLatePayout",
        args: [stake],
      },
    ],
  });

  const schema = yup
    .object()
    .shape({
      deferAddress: yup.string().required("Wallet address required").matches(WALLET_ADDRESS_REGEX, {
        message: "Wallet address Invalid",
        excludeEmptyString: true,
      }),
    })
    .required();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { deferAddress } = watch();

  const { config } = usePrepareContractWrite({
    ...fenixContract(chain),
    functionName: "deferStake",
    args: [BigNumber.from(stakeIndex), deferAddress],
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
      toast.success("Stake deferment confirmed. Your stake can be ended at a later date.");
      router.push("/stake/deferred");
    },
    onError(_error) {
      toast.error("Unable to defer your stake. Please try again later.");
    },
  });

  const handleDeferSubmit = (_data: any) => {
    write?.();
  };

  useEffect(() => {
    if (readsData?.[0]) {
      setStake(readsData[0]);
    }

    const equityPoolSupply = Number(ethers.utils.formatUnits(readsData?.[1] ?? 0));
    const equityPoolTotalShares = Number(ethers.utils.formatUnits(readsData?.[2] ?? 0));
    if (stake && equityPoolTotalShares && equityPoolSupply) {
      setStartMs(new Date(stake.startTs * 1000));
      setEndMs(new Date(stake.endTs * 1000));
      setPrincipal(Number(ethers.utils.formatUnits(stake.fenix)));
      setShares(Number(ethers.utils.formatUnits(stake.shares)));

      if (rewardPayout?.[0]) {
        const earlyReward = Number(ethers.utils.formatUnits(rewardPayout?.[0] ?? 0));
        const penalty = 1 - earlyReward;
        setPenalty(penalty);
      }

      if (rewardPayout?.[1]) {
        const lateReward = Number(ethers.utils.formatUnits(rewardPayout?.[1] ?? 0));
        const penalty = 1 - lateReward;
        setPenalty(penalty);
      }

      if (equityPoolTotalShares > 0) {
        const shares = Number(ethers.utils.formatUnits(stake.shares));
        const equityPayout = (shares / equityPoolTotalShares) * equityPoolSupply;
        const payout = equityPayout * (1 - penalty);
        setProjectedPayout(payout);
      }

      const progressPct = calculateProgress(stake.startTs, stake.endTs);
      setClampedProgress(progressPct * 100);
      setProgress(clampedProgress.toFixed(2) + "%");
      setStatus(stake.status);
      setPayout(Number(ethers.utils.formatUnits(stake.payout)));
    }
    if (address) {
      setValue("deferAddress", address);
    }
    setDisabled(!isValid);
  }, [address, clampedProgress, isValid, penalty, readsData, rewardPayout, setValue, stake]);

  const renderPenalty = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.END:
      case StakeStatus.DEFER:
        return <TextDatum title="Penalty" value="-" />;
      default:
        return <CountUpDatum title="Penalty" value={penalty * 100} decimals={2} suffix=" %" />;
    }
  };

  const renderPayout = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.END:
      case StakeStatus.DEFER:
        return <CountUpDatum title="Payout" value={payout} decimals={2} suffix=" FENIX" />;
      default:
        return <CountUpDatum title="Payout" value={projectedPayout} decimals={2} suffix=" FENIX" />;
    }
  };

  const renderProgress = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.END:
        return <div className="text-center uppercase">Ended</div>;
      case StakeStatus.DEFER:
        return <div className="text-center uppercase">Deferred</div>;
      default:
        return (
          <div className="relative w-32">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full rounded primary-background">
                <div className="h-6 rounded progress-gradient" style={{ width: progress }} />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center">
              <div className="h-6 rounded glass" style={{ width: progress }} />
            </div>
            <div className="relative flex justify-center">
              <span className="text-sm primary-text font-mono my-2">
                <CountUp end={clampedProgress} decimals={2} suffix=" %" />
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <Container className="max-w-xl">
      <PageHeader
        title="Defer Stake"
        subtitle="End your stake but store your FENIX in the contract. Deferred FENIX can be moved to your wallet by ending your stake."
      />

      <CardContainer>
        <form onSubmit={handleSubmit(handleDeferSubmit)} className="space-y-6">
          <WalletAddressField
            errorMessage={<ErrorMessage errors={errors} name="deferAddress" />}
            register={register("deferAddress")}
          />

          <dl className="divide-y secondary-divider">
            <DateDatum title="Start" value={startMs} />
            <DateDatum title="End" value={endMs} />
            <CountUpDatum title="Principal" value={principal} decimals={2} suffix=" FENIX" />
            <CountUpDatum title="Shares" value={shares} decimals={2} />
            {renderPenalty(status)}
            {renderPayout(status)}
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium primary-text">Progress</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">{renderProgress(status)}</dd>
            </div>
          </dl>

          <div className="form-control w-full">
            <button
              type="submit"
              className={clsx("flex w-full justify-center primary-button", {
                loading: processing,
              })}
              disabled={disabled}
            >
              Defer Stake
            </button>
          </div>
          <GasEstimate gasPrice={feeData?.gasPrice} gasLimit={config?.request?.gasLimit} />
        </form>
      </CardContainer>
    </Container>
  );
};

export default StakeAddressIndexDefer;
