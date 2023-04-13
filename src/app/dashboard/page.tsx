import { CardContainer, Container } from "@/components/containers";
import { PageHeader } from "@/components/ui";
import { DashboardCard, DashboardRow } from "@/components/ui";
import { ChainStatus } from "@/models/dashboard";

const chains = [
  {
    chainId: 1,
    name: "Goreli",
    status: ChainStatus.ACTIVE,
    equitySupply: 1000,
    rewardSupply: 30002,
    shareRate: 12.4,
    address: "0xE3bf463862ECA89c7f39D3108c4f9f01D1dDE6C6",
  },
  {
    chainId: 2,
    name: "Polygon Mumbai",
    status: ChainStatus.ACTIVE,
    equitySupply: 1000,
    rewardSupply: 30002,
    shareRate: 12.4,
    address: "0xCdD5536bCCf4c34a3b5E6B111f9da41B28ae50F1",
  },
  {
    chainId: 3,
    name: "X1 Devnet",
    status: ChainStatus.ACTIVE,
    equitySupply: 1000,
    rewardSupply: 30002,
    shareRate: 12.4,
    address: "0x79E968E74618C24BA48D8DC2D3673fD23B68A07f",
  },
  {
    chainId: 4,
    name: "PulseChain Testnet",
    status: ChainStatus.ACTIVE,
    equitySupply: 1000,
    rewardSupply: 30002,
    shareRate: 12.4,
    address: "0xd2ac6954b3f08f7024E90CFAe252fb8c06c0a868",
  },
];

const Dashboard = () => {
  return (
    <Container>
      <PageHeader
        title="Dashboard"
        subtitle={`Fenix runs on ${chains.length} chains. You can view the status of each chain below.`}
      />
      <div className="md:hidden">
        <CardContainer className="max-w-2xl">
          <div className="flex flex-col space-y-4 divide-y primary-divider">
            {chains.map((chain) => (
              <DashboardCard
                key={chain.chainId}
                chainId={chain.chainId}
                chainName={chain.name}
                chainStatus={chain.status}
                equitySupply={chain.equitySupply}
                rewardSupply={chain.rewardSupply}
                shareRate={chain.shareRate}
                address={chain.address}
              />
            ))}
          </div>
        </CardContainer>
      </div>
      <div className="hidden md:inline">
        <CardContainer>
          <table className="min-w-full divide-y primary-divider">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold primary-text sm:pl-6">
                  Chain
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold primary-text">
                  Status
                </th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold primary-text">
                  Equity Pool
                </th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold primary-text">
                  Reward Pool
                </th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold primary-text">
                  Share Rate
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold primary-text">
                  Address
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y secondary-divider">
              {chains.map((chain) => (
                <DashboardRow
                  key={chain.chainId}
                  chainId={chain.chainId}
                  chainName={chain.name}
                  chainStatus={chain.status}
                  equitySupply={chain.equitySupply}
                  rewardSupply={chain.rewardSupply}
                  shareRate={chain.shareRate}
                  address={chain.address}
                />
              ))}
            </tbody>
          </table>
        </CardContainer>
      </div>
    </Container>
  );
};

export default Dashboard;
