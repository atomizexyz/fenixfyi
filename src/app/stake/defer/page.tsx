"use client";

import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { GasEstimate, PageHeader } from "@/components/ui";
import { CardContainer, Container } from "@/components/containers";
import { useRouter, useSearchParams } from "next/navigation";
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
import { WALLET_ADDRESS_REGEX } from "@/utilities/constants";
import { BigNumber } from "ethers";
import toast from "react-hot-toast";
import { WalletAddressField } from "@/components/forms";

const StakeAddressIndexDefer = () => {
  const [disabled, setDisabled] = useState(false);
  const [processing, setProcessing] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { chain } = useNetwork() as unknown as { chain: Chain };
  const { data: feeData } = useFeeData({ formatUnits: "gwei", watch: true });

  const address = searchParams.get("address") as unknown as Address;
  const stakeIndex = searchParams.get("stakeIndex") as unknown as number;

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
    formState: { errors },
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
      router.push("/stake/deferred");
      toast("Defer stake successful");
    },
  });

  const handleDeferSubmit = (_data: any) => {
    write?.();
  };

  useEffect(() => {
    if (address) {
      setValue("deferAddress", address);
    }
  }, [address, setValue]);

  return (
    <Container className="max-w-xl">
      <PageHeader
        title="Defer Stake"
        subtitle="End your stake but store your FENIX in the contract. Deferred FENIX can be moved to your wallet by ending your stake."
      />

      <CardContainer>
        <form onSubmit={handleSubmit(handleDeferSubmit)} className="space-y-6">
          <WalletAddressField
            disabled={disabled}
            errorMessage={<ErrorMessage errors={errors} name="deferAddress" />}
            register={register("deferAddress")}
          />

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
