"use client";

import { GasEstimate, PageHeader, Or } from "@/components/ui";
import { CardContainer, Container } from "@/components/containers";
import { MaxValueField } from "@/components/ui/forms";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Chain,
  Address,
  useContractWrite,
  useFeeData,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractRead,
  useAccount,
  useBalance,
} from "wagmi";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BigNumber, ethers } from "ethers";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import XENCryptoABI from "@/models/abi/XENCryptoABI";
import { fenixContract } from "@/libraries/fenixContract";
import { xenContract } from "@/libraries/xenContract";
import { CountUpDatum, TextDatum } from "@/components/ui/datum";

const BurnApprove = () => {
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [allowance, setAllowance] = useState<number>(0);
  const [gasPrice, setGasPrice] = useState<BigNumber | null>();
  const [gasLimitFixed, setGasLimitFixed] = useState<BigNumber | null>();
  const [gasLimitUnlimited, setGasLimitUnlimited] = useState<BigNumber | null>();
  const [approveBurnBn, setApproveBurnBn] = useState<BigNumber>(BigNumber.from(0));

  const router = useRouter();
  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { address } = useAccount() as unknown as { address: Address };
  const { data: feeData } = useFeeData({ formatUnits: "gwei", watch: false, cacheTime: 60_000 });
  const { data: xenBalance } = useBalance({
    address: address,
    token: xenContract(chain).address,
    watch: false,
  });
  const { data: allowanceData } = useContractRead({
    ...xenContract(chain),
    functionName: "allowance",
    args: [address, fenixContract(chain).address],
    watch: false,
    cacheTime: 30_000,
  });

  const schema = yup
    .object()
    .shape({
      approveXENAmount: yup
        .number()
        .required("Amount required")
        .max(
          Number(ethers.utils.formatUnits(xenBalance?.value ?? BigNumber.from(0))),
          `Maximum amount is ${xenBalance?.formatted}`
        )
        .positive("Amount must be greater than 0")
        .typeError("Amount required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const { approveXENAmount } = watch();

  const { config: fixedConfig } = usePrepareContractWrite({
    address: xenContract(chain).address,
    abi: XENCryptoABI,
    functionName: "approve",
    args: [fenixContract(chain).address, approveBurnBn],
    enabled: !disabled,
  });
  const { data: fixedApproveData, write: fixedWrite } = useContractWrite({
    ...fixedConfig,
    onSuccess(_data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: fixedApproveData?.hash,
    onSuccess(_data) {
      toast.success("Limited spend for XEN has been approved.");
      router.push("/burn");
    },
    onError(_data) {
      toast.error("Approval for limited spend of XEN was unsuccessful. Please try again.");
    },
  });
  const onFixedSubmit = () => {
    fixedWrite?.();
  };

  /*** CONTRACT APPROVE UNLIMITED ***/

  const { handleSubmit: handleUnlimitedSubmit } = useForm();

  const { config: unlimitedConfig } = usePrepareContractWrite({
    address: xenContract(chain).address,
    abi: XENCryptoABI,
    functionName: "approve",
    args: [fenixContract(chain).address, ethers.constants.MaxUint256],
  });
  const { data: unlimitedApproveData, write: unlimitedWrite } = useContractWrite({
    ...unlimitedConfig,
    onSuccess(_data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: unlimitedApproveData?.hash,
    onSuccess(_data) {
      toast.success("Unlimited spend for XEN has been approved.");
      router.push("/burn");
    },
    onError(_data) {
      toast.error("Approval for unlimited spend of XEN was unsuccessful. Please try again.");
    },
  });
  const onUnlimitedSubmit = () => {
    unlimitedWrite?.();
  };

  useEffect(() => {
    const floatApproveXENAmount = parseFloat(approveXENAmount);
    if (!isNaN(floatApproveXENAmount) && floatApproveXENAmount > 1e-18) {
      setApproveBurnBn(ethers.utils.parseUnits(floatApproveXENAmount.toFixed(18)));
    }

    if (allowanceData) {
      setAllowance(Number(ethers.utils.formatUnits(allowanceData)));
    }
    if (feeData?.gasPrice) {
      setGasPrice(feeData.gasPrice);
    }
    if (fixedConfig?.request?.gasLimit) {
      setGasLimitFixed(fixedConfig.request.gasLimit);
    }
    if (unlimitedConfig?.request?.gasLimit) {
      setGasLimitUnlimited(unlimitedConfig.request.gasLimit);
    }
    setDisabled(!isValid);
  }, [allowanceData, approveXENAmount, feeData, fixedConfig, isValid, unlimitedConfig]);

  return (
    <Container className="max-w-xl">
      <PageHeader title="Approve Limited Burn" subtitle="Approve the FENIX contract to burn an limited amount of XEN" />

      <CardContainer>
        <form onSubmit={handleSubmit(onFixedSubmit)} className="space-y-6">
          <MaxValueField
            title="XEN"
            description="Number of XEN to burn"
            decimals={0}
            value={ethers.utils.formatUnits(xenBalance?.value ?? BigNumber.from(0))}
            errorMessage={<ErrorMessage errors={errors} name="approveXENAmount" />}
            register={register("approveXENAmount")}
            setValue={setValue}
          />

          <dl className="divide-y secondary-divider">
            <CountUpDatum title="Approve Amount" value={approveXENAmount} suffix=" XEN" decimals={4} />

            {allowanceData && allowanceData.gte(ethers.constants.MaxUint256) ? (
              <TextDatum title="Spend Allowance" value="Unlimited" />
            ) : (
              <CountUpDatum title="Spend Allowance" value={allowance} suffix=" XEN" />
            )}
          </dl>

          <button
            type="submit"
            className={clsx("flex w-full justify-center primary-button", {
              loading: processing,
            })}
            disabled={disabled}
          >
            {`Approve Limited Burn ${approveXENAmount} XEN`}
          </button>

          <GasEstimate gasPrice={gasPrice} gasLimit={gasLimitFixed} />
        </form>
      </CardContainer>

      <Or />

      <PageHeader
        title="Approve Unlimited Burn"
        subtitle="Approve FENIX contract to burn an unlimited amount of XEN."
      />

      <CardContainer>
        <form onSubmit={handleUnlimitedSubmit(onUnlimitedSubmit)} className="space-y-6">
          <button
            type="submit"
            className={clsx("flex w-full justify-center primary-button", {
              loading: processing,
            })}
          >
            Approved Unlimited Burn
          </button>
          <GasEstimate gasPrice={gasPrice} gasLimit={gasLimitUnlimited} />
        </form>
      </CardContainer>
    </Container>
  );
};

export default BurnApprove;
