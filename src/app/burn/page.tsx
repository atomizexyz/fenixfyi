"use client";

import { GasEstimate, PageHeader, Or, DescriptionDatum } from "@/components/ui";
import { CardContainer, Container } from "@/components/containers";
import Link from "next/link";
import { MaxValueField } from "@/components/forms";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Address,
  Chain,
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
import FENIX_ABI from "@/models/abi/FENIX_ABI";
import { fenixContract } from "@/libraries/fenixContract";
import { xenContract } from "@/libraries/xenContract";

const BurnXEN = () => {
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [burnMaximum, setBurnMaximum] = useState<BigNumber>(BigNumber.from(0));

  const router = useRouter();
  const { address } = useAccount() as unknown as { address: Address };
  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { data: feeData } = useFeeData({ formatUnits: "gwei", watch: true });
  const { data: fenixBalance } = useBalance({
    address: address,
    token: fenixContract(chain).address,
    watch: true,
  });
  const { data: xenBalance } = useBalance({
    address: address,
    token: xenContract(chain).address,
    watch: true,
  });
  const { data: allowance } = useContractRead({
    ...xenContract(chain),
    functionName: "allowance",
    args: [address, fenixContract(chain).address],
    watch: true,
  });

  const schema = yup
    .object()
    .shape({
      burnXENAmount: yup
        .number()
        .required("Amount Required")
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
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { burnXENAmount } = watch() as { burnXENAmount: number };

  const { config } = usePrepareContractWrite({
    address: fenixContract(chain).address,
    abi: FENIX_ABI,
    functionName: "burnXEN",
    args: [ethers.utils.parseUnits((burnXENAmount || 0).toString(), fenixBalance?.decimals ?? 0)],
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
      toast("XEN burned for FENIX successfully");
      router.push("/stake");
    },
  });
  const onBurnSubmit = () => {
    write?.();
  };

  useEffect(() => {
    if (xenBalance && allowance && xenBalance.value.gt(allowance)) {
      setBurnMaximum(allowance);
    } else {
      setBurnMaximum(xenBalance?.value ?? BigNumber.from(0));
    }
    setDisabled(!isValid);
  }, [allowance, burnMaximum, isValid, xenBalance]);

  return (
    <Container className="max-w-xl">
      <PageHeader title="Burn XEN" subtitle="Burn you XEN and mint brand new FENIX" />

      <CardContainer>
        <form onSubmit={handleSubmit(onBurnSubmit)} className="space-y-6">
          <MaxValueField
            title="XEN"
            description="Number of XEN to burn"
            decimals={0}
            value={ethers.utils.formatUnits(burnMaximum)}
            errorMessage={<ErrorMessage errors={errors} name="burnXENAmount" />}
            register={register("burnXENAmount")}
            setValue={setValue}
          />
          <dl className="sm:divide-y sm:secondary-divider">
            <DescriptionDatum title="New FENIX" datum={`${burnXENAmount / 10_000}`} />
            <DescriptionDatum title="Liquid FENIX" datum={fenixBalance?.formatted ?? "-"} />
          </dl>

          <div>
            <button
              type="submit"
              className={clsx("flex w-full justify-center primary-button", {
                loading: processing,
              })}
              disabled={disabled}
            >
              Burn XEN
            </button>
          </div>
          <GasEstimate gasPrice={feeData?.gasPrice} gasLimit={config?.request?.gasLimit} />
        </form>
      </CardContainer>
    </Container>
  );
};

export default BurnXEN;