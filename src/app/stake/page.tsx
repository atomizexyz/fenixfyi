"use client";

import "react-day-picker/dist/style.css";

import { clsx } from "clsx";
import { ErrorMessage } from "@hookform/error-message";
import { BigNumber, ethers } from "ethers";
import { yupResolver } from "@hookform/resolvers/yup";
import { PageHeader, GasEstimate, DescriptionDatum, BonusCalculator } from "@/components/ui";
import { CardContainer, Container } from "@/components/containers";
import { useRouter } from "next/navigation";
import { MaxValueField } from "@/components/ui/forms";
import { DayPicker } from "react-day-picker";
import { useCallback, useEffect, useState } from "react";
import { addDays, differenceInDays, isSameMonth, getYear } from "date-fns";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Chain,
  Address,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
  useFeeData,
  useBalance,
  useAccount,
  useContractReads,
} from "wagmi";
import * as yup from "yup";
import { FENIX_MAX_STAKE_LENGTH } from "@/utilities/constants";
import FENIX_ABI from "@/models/abi/FENIX_ABI";
import { fenixContract } from "@/libraries/fenixContract";

export default function Stake() {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const maxStakeLengthDay = addDays(today, FENIX_MAX_STAKE_LENGTH);

  const [month, setMonth] = useState<Date>(today);
  const [isLockMonth, setIsLockMonth] = useState<boolean>(true);
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [sizeBonus, setSizeBonus] = useState<number>(0);
  const [timeBonus, setTimeBonus] = useState<number>(0);
  const [subtotalBonus, setSubtotalBonus] = useState<number>(0);
  const [totalBonus, setTotalBonus] = useState<number>(0);
  const [shareRate, setShareRate] = useState<BigNumber>(BigNumber.from(0));
  const [shares, setShares] = useState<number>(0);

  const router = useRouter();
  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { address } = useAccount() as unknown as { address: Address };
  const { data: feeData } = useFeeData({ formatUnits: "gwei", watch: true });
  const { data: fenixBalance } = useBalance({
    address: address,
    token: fenixContract(chain).address,
    watch: true,
  });

  /*** FORM SETUP ***/

  const schema = yup
    .object()
    .shape({
      startStakeAmount: yup
        .number()
        .required("Amount required")
        .max(
          Number(ethers.utils.formatUnits(fenixBalance?.value ?? BigNumber.from(0))),
          `Maximum amount is ${fenixBalance?.formatted}`
        )
        .positive("Amount must be greater than 0")
        .typeError("Amount required"),
      startStakeDays: yup
        .number()
        .required("Days required")
        .max(FENIX_MAX_STAKE_LENGTH, "Maximum days is ${FENIX_MAX_STAKE_LENGTH}")
        .positive("Days must be greater than 0")
        .typeError("Days required"),
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
  const { startStakeAmount, startStakeDays } = watch();

  /*** CONTRACT WRITE SETUP ***/

  const { config } = usePrepareContractWrite({
    address: fenixContract(chain).address,
    abi: FENIX_ABI,
    functionName: "startStake",
    args: [
      ethers.utils.parseUnits(Number(startStakeAmount ?? 0).toString(), fenixBalance?.decimals),
      startStakeDays ?? 0,
    ],
    enabled: !disabled,
  });

  const { data: stakeData, write: writeStake } = useContractWrite({
    ...config,
    onSuccess(_data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: stakeData?.hash,
    onSuccess(_data) {
      toast.success("Your stake has been initiated. Happy earning!");
      router.push("/stake/active");
    },
    onError(err) {
      toast.error("Initiating stake was unsuccessful. Please try again later.");
    },
  });
  const handleStartStakeSubmit = (_data: any) => {
    writeStake?.();
  };

  const footer = (
    <div className="flex justify-between">
      <button
        disabled={isSameMonth(today, month)}
        onClick={() => {
          setIsLockMonth(false);
          setMonth(addDays(today, 1));
        }}
        className="text-sm font-semibold primary-link"
      >
        Go to Today
      </button>

      <div className="relative flex py-4">
        <div className="min-w-0 flex-1 text-sm leading-6">
          <label className="select-none font-medium secondary-text">Lock Month</label>
        </div>
        <div className="flex ml-2 h-6 items-center">
          <input
            onChange={(event) => setIsLockMonth(event.currentTarget.checked)}
            type="checkbox"
            className="h-4 w-4 rounded  primary-checkbox"
            checked={isLockMonth}
          />
        </div>
      </div>
    </div>
  );

  const selectedFromDay = useCallback(() => {
    return addDays(new Date(), startStakeDays ?? 0);
  }, [startStakeDays]);

  const selectedToDay = (date: any) => {
    setValue("startStakeDays", differenceInDays(date, today) + 1);
  };

  useContractReads({
    contracts: [
      {
        ...fenixContract(chain),
        functionName: "shareRate",
      },
      {
        ...fenixContract(chain),
        functionName: "calculateSizeBonus",
        args: [ethers.utils.parseUnits(Number(startStakeAmount ?? 0).toString())],
      },
      {
        ...fenixContract(chain),
        functionName: "calculateTimeBonus",
        args: [startStakeDays ?? 0],
      },
      {
        ...fenixContract(chain),
        functionName: "calculateBonus",
        args: [ethers.utils.parseUnits(Number(startStakeAmount ?? 0).toString()), startStakeDays ?? 0],
      },
      {
        ...fenixContract(chain),
        functionName: "calculateShares",
        args: [ethers.utils.parseUnits(totalBonus.toString())],
      },
    ],
    onSuccess(data) {
      setShareRate(BigNumber.from(data?.[0] ?? 0));
      setSizeBonus(Number(ethers.utils.formatUnits(data?.[1] ?? 0)));
      setTimeBonus(Number(ethers.utils.formatUnits(data?.[2] ?? 0)));
      setSubtotalBonus(Number(ethers.utils.formatUnits(data?.[3] ?? 0)));
      setShares(Number(ethers.utils.formatUnits(data?.[4] ?? 0)));
    },
    watch: true,
  });

  useEffect(() => {
    if (subtotalBonus) {
      const total = Number(startStakeAmount ?? 0) * subtotalBonus;
      setTotalBonus(Number(total));
    }

    if (isLockMonth && !isSameMonth(selectedFromDay(), month)) {
      setMonth(selectedFromDay());
    }

    setDisabled(!isValid);
  }, [
    selectedFromDay,
    month,
    isLockMonth,
    startStakeAmount,
    startStakeDays,
    sizeBonus,
    timeBonus,
    subtotalBonus,
    totalBonus,
    isValid,
  ]);

  return (
    <Container className="max-w-xl">
      <PageHeader
        title="Start Stake"
        subtitle="Staking FENIX will enter you into an agreement with the FENIX smart contract that will lock your FENIX for a specified amount of time. You will receive shares in return that can be redeemed for FENIX at the end of the stake period."
      />

      <CardContainer>
        <form onSubmit={handleSubmit(handleStartStakeSubmit)} className="space-y-6">
          <MaxValueField
            title="FENIX"
            description="Number of FENIX to stake"
            decimals={0}
            value={ethers.utils.formatUnits(fenixBalance?.value ?? BigNumber.from(0))}
            errorMessage={<ErrorMessage errors={errors} name="startStakeAmount" />}
            register={register("startStakeAmount")}
            setValue={setValue}
          />

          <MaxValueField
            title="Days"
            description="Number of days"
            decimals={0}
            value={FENIX_MAX_STAKE_LENGTH}
            errorMessage={<ErrorMessage errors={errors} name="startStakeDays" />}
            register={register("startStakeDays")}
            setValue={setValue}
          />

          <div className="flex justify-center">
            <DayPicker
              mode="single"
              className="primary-text"
              modifiersClassNames={{
                selected: "day-selected",
                outside: "day-outside",
              }}
              disabled={[{ before: tomorrow, after: maxStakeLengthDay }]}
              selected={selectedFromDay()}
              onSelect={selectedToDay}
              month={month}
              onMonthChange={setMonth}
              footer={footer}
              fromYear={getYear(today)}
              toYear={getYear(maxStakeLengthDay)}
              captionLayout="dropdown"
              fixedWeeks
            />
          </div>

          <CardContainer className="glass">
            <BonusCalculator
              sizeBonus={sizeBonus}
              timeBonus={timeBonus}
              subtotal={subtotalBonus}
              total={totalBonus}
              shareRate={Number(ethers.utils.formatUnits(shareRate))}
              shares={shares}
            />
          </CardContainer>
          <dl className="sm:divide-y sm:secondary-divider">
            <DescriptionDatum title="Your Stake Shares" datum={shares.toFixed(6)} />
          </dl>

          <button
            type="submit"
            className={clsx("flex w-full justify-center primary-button", {
              loading: processing,
            })}
            disabled={disabled}
          >
            Start Stake
          </button>

          <GasEstimate gasPrice={feeData?.gasPrice} gasLimit={config?.request?.gasLimit} />
        </form>
      </CardContainer>
    </Container>
  );
}
