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
    watch: true,
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
        <div className="border-t primary-divider">
          <dl className="divide-y secondary-divider">
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium primary-text">Chain Id</dt>
              <dd className="mt-1 text-sm secondary-text sm:col-span-2 sm:mt-0 font-mono">{chainFromId?.id}</dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium primary-text">Launch Date</dt>
              <dd className="mt-1 text-sm secondary-text sm:col-span-2 sm:mt-0">
                {new Date(genesisTs * 1000).toLocaleDateString()}
              </dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium primary-text">Days Since Launch</dt>
              <dd className="mt-1 text-sm secondary-text sm:col-span-2 sm:mt-0 font-mono">
                <CountUp end={daysSince(genesisTs)} preserveValue={true} separator={","} suffix={" days"} />
              </dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium primary-text">Contract Symbol</dt>
              <dd className="mt-1 text-sm secondary-text sm:col-span-2 sm:mt-0">{token?.symbol}</dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium primary-text">Contract Address</dt>
              <dd className="mt-1 text-sm secondary-text sm:col-span-2 sm:mt-0 font-mono">{token?.address}</dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium primary-text">Equity Pool</dt>
              <dd className="mt-1 text-sm secondary-text sm:col-span-2 sm:mt-0 font-mono">
                <CountUp
                  end={Number(ethers.utils.formatUnits(equityPoolSupply))}
                  preserveValue={true}
                  separator=","
                  decimals={2}
                />
              </dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium primary-text">Reward Pool</dt>
              <dd className="mt-1 text-sm secondary-text sm:col-span-2 sm:mt-0 font-mono">
                <CountUp
                  end={Number(ethers.utils.formatUnits(rewardPoolSupply))}
                  preserveValue={true}
                  separator=","
                  decimals={2}
                />
              </dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium primary-text">Share Rate</dt>
              <dd className="mt-1 text-sm secondary-text sm:col-span-2 sm:mt-0 font-mono">
                <CountUp
                  end={Number(ethers.utils.formatUnits(shareRate))}
                  preserveValue={true}
                  separator=","
                  decimals={2}
                />
              </dd>
            </div>
          </dl>
        </div>
      </CardContainer>
    </Container>
  );
};

export default DashboardChainId;
