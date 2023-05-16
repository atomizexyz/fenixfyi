"use client";

import { CardContainer, Container } from "@/components/containers";
import { useEffect, useState } from "react";
import { useContractReads, useToken } from "wagmi";
import { fenixContract } from "@/libraries/fenixContract";
import CountUp from "react-countup";
import { BigNumber, ethers } from "ethers";
import { Token } from "@/contexts/FenixContext";
import { useParams } from "next/navigation";
import { allChains } from "@/libraries/client";
import { daysSince } from "@/utilities/helpers";
import { DateDatum, TextDatum, CountUpDatum, NumberDatum } from "@/components/ui/datum";

const DashboardChainId = () => {
  const [token, setToken] = useState<Token | null>(null);
  const [genesisTs, setGenesisTs] = useState<number>(0);
  const [shareRate, setShareRate] = useState<BigNumber>(BigNumber.from(0));
  const [equityPoolSupply, setEquityPoolSupply] = useState<BigNumber>(BigNumber.from(0));
  const [rewardPoolSupply, setRewardPoolSupply] = useState<BigNumber>(BigNumber.from(0));

  const { chainId } = useParams() as unknown as { chainId: number };

  const chainFromId = allChains.find((c) => c && c.id == chainId);

  const { data: tokenData } = useToken({
    address: fenixContract(chainFromId).address,
    chainId: chainFromId?.id,
  });

  useContractReads({
    contracts: [
      {
        ...fenixContract(chainFromId),
        functionName: "genesisTs",
      },
      {
        ...fenixContract(chainFromId),
        functionName: "shareRate",
      },
      {
        ...fenixContract(chainFromId),
        functionName: "equityPoolSupply",
      },
      {
        ...fenixContract(chainFromId),
        functionName: "rewardPoolSupply",
      },
    ],
    onSuccess(data) {
      setGenesisTs(Number(data[0]));
      setShareRate(BigNumber.from(data?.[1] ?? 0));
      setEquityPoolSupply(BigNumber.from(data?.[2] ?? 0));
      setRewardPoolSupply(BigNumber.from(data?.[3] ?? 0));
    },
    watch: false,
    cacheTime: 30_000,
  });

  useEffect(() => {
    if (tokenData) {
      setToken(tokenData);
    }
  }, [tokenData]);

  return (
    <Container>
      <CardContainer>
        <div className="py-5 flex justify-between">
          <div>
            <h3 className="text-base font-semibold primary-text">{chainFromId?.name}</h3>
            <p className="mt-1 text-sm secondary-text">FENIX on stats on {chainFromId?.name} </p>
          </div>
        </div>
        <div className="primary-divider">
          <dl className="divide-y secondary-divider">
            <NumberDatum title="Chain Id" value={chainFromId?.id.toString() ?? "-"} />
            <DateDatum title="Launch Date" value={new Date(genesisTs * 1000)} />
            <CountUpDatum title="Days Since Launch" value={daysSince(genesisTs)} suffix=" days" />
            <TextDatum title="Contract Symbol" value={token?.symbol ?? "-"} />
            <NumberDatum title="Contract Address" value={token?.address ?? "-"} />
            <CountUpDatum
              title="Equity Pool"
              value={Number(ethers.utils.formatUnits(equityPoolSupply))}
              decimals={5}
              suffix=" FENIX"
            />
            <CountUpDatum
              title="Reward Pool"
              value={Number(ethers.utils.formatUnits(rewardPoolSupply))}
              decimals={5}
              suffix=" FENIX"
            />
            <CountUpDatum title="Share Rate" value={Number(ethers.utils.formatUnits(shareRate))} decimals={5} />
          </dl>
        </div>
      </CardContainer>
    </Container>
  );
};

export default DashboardChainId;
