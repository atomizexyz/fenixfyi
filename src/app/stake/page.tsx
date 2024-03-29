"use client";

import "react-day-picker/dist/style.css";

import { clsx } from "clsx";
import { ErrorMessage } from "@hookform/error-message";
import { BigNumber, ethers, utils } from "ethers";
import { yupResolver } from "@hookform/resolvers/yup";
import { PageHeader, GasEstimate, BonusCalculator } from "@/components/ui";
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
import { CountUpDatum } from "@/components/ui/datum";
import { AlertInfo, AlertType, AlertWarn } from "@/components/ui/Alert";
import { roundDown } from "@/utilities/helpers";

export default function Stake() {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const maxStakeLengthDay = addDays(today, FENIX_MAX_STAKE_LENGTH);

  const [alertType, setAlertType] = useState<AlertType | null>();
  const [month, setMonth] = useState<Date>(today);
  const [isLockMonth, setIsLockMonth] = useState<boolean>(true);
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [sizeBonus, setSizeBonus] = useState<number>(0);
  const [timeBonus, setTimeBonus] = useState<number>(0);
  const [subtotalBonus, setSubtotalBonus] = useState<number>(0);
  const [shareRate, setShareRate] = useState<BigNumber>(BigNumber.from(0));
  const [shares, setShares] = useState<number>(0);
  const [equityPoolSupply, setEquityPoolSupply] = useState<number>(0);
  const [equityPoolTotalShares, setEquityPoolTotalShares] = useState<number>(0);
  const [projectedFENIX, setProjectedFENIX] = useState<number>(0);
  const [totalBonusBn, setTotalBonusBn] = useState<BigNumber>(BigNumber.from(0));
  const [startStakeBn, setStartStakeBn] = useState<BigNumber>(BigNumber.from(0));

  const router = useRouter();
  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { address } = useAccount() as unknown as { address: Address };
  const { data: feeData } = useFeeData({ formatUnits: "gwei", watch: false, cacheTime: 60_000 });
  const { data: fenixBalance } = useBalance({
    address: address,
    token: fenixContract(chain).address,
    staleTime: 20_000,
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
    reset,
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
    args: [startStakeBn, startStakeDays ?? 0],
    enabled: !disabled,
  });

  const { data: stakeData, write: writeStake } = useContractWrite({
    ...config,
    onSuccess(_data) {
      reset;
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
        args: [startStakeBn],
      },
      {
        ...fenixContract(chain),
        functionName: "calculateTimeBonus",
        args: [startStakeDays ?? 0],
      },
      {
        ...fenixContract(chain),
        functionName: "calculateBonus",
        args: [startStakeBn, startStakeDays ?? 0],
      },
      {
        ...fenixContract(chain),
        functionName: "calculateShares",
        args: [totalBonusBn],
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
    onSuccess(data) {
      setShareRate(BigNumber.from(data?.[0] ?? 0));
      setSizeBonus(Number(ethers.utils.formatUnits(data?.[1] ?? 0)));
      setTimeBonus(Number(ethers.utils.formatUnits(data?.[2] ?? 0)));
      setSubtotalBonus(Number(ethers.utils.formatUnits(data?.[3] ?? 0)));
      setShares(Number(ethers.utils.formatUnits(data?.[4] ?? 0)));
      setEquityPoolSupply(Number(ethers.utils.formatUnits(data?.[5] ?? 0)));
      setEquityPoolTotalShares(Number(ethers.utils.formatUnits(data?.[6] ?? 0)));
    },
    watch: false,
  });

  useEffect(() => {
    const floatStartStakeAmount = parseFloat(startStakeAmount);
    if (!isNaN(floatStartStakeAmount) && floatStartStakeAmount > 1e-12) {
      setStartStakeBn(ethers.utils.parseUnits(floatStartStakeAmount.toFixed(12)));
    }

    const startStakeFENIX = Number(startStakeAmount ?? 0);
    if (equityPoolTotalShares) {
      const projectedPercentOfPool = shares / equityPoolTotalShares;
      setProjectedFENIX(equityPoolSupply * projectedPercentOfPool);

      if (startStakeFENIX < projectedFENIX) {
        setAlertType(AlertType.Info);
      } else {
        setAlertType(AlertType.Error);
      }
    }

    if (subtotalBonus) {
      const startFENIX = parseFloat(ethers.utils.formatUnits(startStakeBn));
      const total = startFENIX * subtotalBonus;
      const totalBn = ethers.utils.parseUnits(total.toFixed(18));
      setTotalBonusBn(totalBn);
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
    isValid,
    equityPoolTotalShares,
    equityPoolSupply,
    shares,
    projectedFENIX,
    startStakeBn,
  ]);

  const toggleAlertView = () => {
    switch (alertType) {
      case AlertType.Info:
        return (
          <AlertInfo
            title={`Projected return: ${projectedFENIX.toFixed(5)} FENIX`}
            description={
              "Your stake is currently projected to return your principal; however, larger stakes in the pool may dilute your share."
            }
          />
        );
      case AlertType.Error:
        return (
          <AlertWarn
            title={`Projected return: ${projectedFENIX.toFixed(5)} FENIX`}
            description={
              "Small and short stakes may not guarantee principal return. To break even, ensure you capture reward pools or account for penalties."
            }
          />
        );
    }
  };

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
            value={roundDown(Number(ethers.utils.formatUnits(fenixBalance?.value ?? BigNumber.from(0))), 12)}
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
              total={Number(ethers.utils.formatUnits(totalBonusBn))}
              shareRate={Number(ethers.utils.formatUnits(shareRate))}
              shares={shares}
            />
          </CardContainer>
          <dl className="divide-y secondary-divider">
            <CountUpDatum title="You Will Receive" value={shares} decimals={6} suffix=" Shares" />
          </dl>

          {toggleAlertView()}

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
