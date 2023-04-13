"use client";

import { PageHeader, GasEstimate, DescriptionDatum, BonusCalculator } from "@/components/ui";
import { CardContainer, Container } from "@/components/containers";
import Link from "next/link";
import { MaxValueField } from "@/components/forms";

export default function Stake() {
  const setValue = () => {};
  const register = (s: string) => {};

  return (
    <Container className="max-w-xl">
      <PageHeader
        title="Start Stake"
        subtitle="Staking FENIX will enter you into an agreement with the FENIX smart contract that will lock your FENIX for a specified amount of time. You will receive shares in return that can be redeemed for FENIX at the end of the stake period."
      />

      <CardContainer>
        <form className="space-y-6" action="#" method="POST">
          <MaxValueField
            title="FENIX"
            description="Number of FENIX to stake"
            decimals={0}
            value={1000}
            // errorMessage={<ErrorMessage errors={errors} name="burnXENAmount" />}
            register={register("burnXENAmount")}
            setValue={setValue}
          />

          <MaxValueField
            title="Days"
            description="Number of days"
            decimals={0}
            value={1000}
            // errorMessage={<ErrorMessage errors={errors} name="burnXENAmount" />}
            register={register("burnXENAmount")}
            setValue={setValue}
          />

          <CardContainer className="glass">
            <BonusCalculator sizeBonus={100} timeBonus={100} base={100} subtotal={100} shareRate={100} shares={100} />
          </CardContainer>
          <dl className="sm:divide-y sm:secondary-divider">
            <DescriptionDatum title="Your Stake Shares" datum="1 day" />
          </dl>

          <div>
            <Link href="https://xen.fyi" className="flex w-full justify-center primary-button">
              Start
            </Link>
          </div>
          <GasEstimate />
        </form>
      </CardContainer>
    </Container>
  );
}
