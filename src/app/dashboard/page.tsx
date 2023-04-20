"use client";

import { CardContainer, Container } from "@/components/containers";
import { PageHeader } from "@/components/ui";
import { DashboardCard, DashboardRow } from "@/components/ui";
import DashboardRowHeaderFooter from "@/components/ui/DashboardRowHeaderFooter";
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
              <DashboardRowHeaderFooter />
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
