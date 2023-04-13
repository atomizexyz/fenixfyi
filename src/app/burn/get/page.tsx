"use client";

import { Or, PageHeader } from "@/components/ui";
import { CardContainer, Container } from "@/components/containers";
import Link from "next/link";

const BurnGet = () => {
  return (
    <Container className="max-w-xl">
      <PageHeader
        title="Get XEN"
        subtitle="You need to have some XEN to burn. You can get XEN by minting it for free + GAS fee or by buying XEN on a DEX."
      />
      <CardContainer>
        <Link href="https://xen.fyi" className="flex w-full justify-center  primary-button">
          Get XEN on xen.fyi
        </Link>

        <Or />

        <Link href="https://xen.network/" className="inline-flex w-full justify-center primary-link">
          XEN official website
        </Link>
      </CardContainer>
    </Container>
  );
};

export default BurnGet;
