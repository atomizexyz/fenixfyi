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
  const router = useRouter();
  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { address } = useAccount() as unknown as { address: Address };
  const { data: feeData } = useFeeData({ formatUnits: "gwei", watch: true });
  const { data: xenBalance } = useBalance({
    address: address,
    token: xenContract(chain).address,
    watch: true,
  });
  const { data: allowanceData } = useContractRead({
    ...xenContract(chain),
    functionName: "allowance",
    args: [address, fenixContract(chain).address],
    watch: true,
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

  const { approveXENAmount } = watch() as { approveXENAmount: number };

  const { config: fixedConfig } = usePrepareContractWrite({
    address: xenContract(chain).address,
    abi: XENCryptoABI,
    functionName: "approve",
    args: [fenixContract(chain).address, ethers.utils.parseUnits(Number(approveXENAmount ?? 0).toString())],
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
    if (allowanceData) {
      setAllowance(Number(ethers.utils.formatUnits(allowanceData)));
    }
    setDisabled(!isValid);
  }, [allowanceData, isValid]);

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

          <GasEstimate gasPrice={feeData?.gasPrice} gasLimit={fixedConfig?.request?.gasLimit} />
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
          <GasEstimate gasPrice={feeData?.gasPrice} gasLimit={unlimitedConfig?.request?.gasLimit} />
        </form>
      </CardContainer>
    </Container>
  );
};

export default BurnApprove;
