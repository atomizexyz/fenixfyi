"use client";

import { CardContainer, Container } from "@/components/containers";
import { PageHeader } from "@/components/ui";
import { DashboardCard, DashboardRow } from "@/components/ui";
import { allChains } from "@/libraries/client";

const Dashboard = () => {
  return (
    <Container>
      <PageHeader
        title="Dashboard"
        subtitle={`Fenix runs on ${allChains.length ?? 0} chains. You can view the status of each chain below.`}
      />
      <div className="md:hidden">
        <CardContainer className="max-w-2xl">
          <div className="flex flex-col space-y-4 divide-y primary-divider">
            {allChains.map((chain) => (
              <DashboardCard key={chain.id} chain={chain} />
            ))}
          </div>
        </CardContainer>
      </div>
      <div className="hidden md:inline">
        <CardContainer>
          <table className="min-w-full divide-y primary-divider">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left align-text-top text-sm font-semibold primary-text sm:pl-6"
                >
                  Chain
                </th>
                <th scope="col" className="px-3 py-3.5 text-left align-text-top text-sm font-semibold primary-text">
                  Status
                </th>
                <th scope="col" className="px-3 py-3.5 text-right align-text-top text-sm font-semibold primary-text">
                  Equity Supply
                  <div className="text-xs tertiary-text"> FENIX </div>
                </th>
                <th scope="col" className="px-3 py-3.5 text-right align-text-top text-sm font-semibold primary-text">
                  Reward Supply
                  <div className="text-xs tertiary-text"> FENIX </div>
                </th>
                <th scope="col" className="px-3 py-3.5 text-right align-text-top text-sm font-semibold primary-text">
                  Share Rate
                </th>
                <th scope="col" className="px-3 py-3.5 text-left align-text-top text-sm font-semibold primary-text">
                  Address
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y secondary-divider">
              {allChains.map((chain) => (
                <DashboardRow key={chain.id} chain={chain} />
              ))}
            </tbody>
          </table>
        </CardContainer>
      </div>
    </Container>
  );
};

export default Dashboard;
