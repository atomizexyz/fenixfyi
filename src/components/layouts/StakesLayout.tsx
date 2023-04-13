import { NextPage } from "next";
import { PageHeader, StakeRow, StakeCard, StakeRowHeaderFooter } from "@/components/ui";
import { Container, CardContainer } from "@/components/containers";
import { StakeRowDatum, StakeStatus } from "@/models/stake";

export interface StakeLayoutDatum {
  title: string;
  subtitle: string;
  status: StakeStatus;
  stakes: StakeRowDatum[];
}

export const StakesLayout: NextPage<StakeLayoutDatum> = ({ title, subtitle, status, stakes }) => {
  return (
    <Container>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="md:hidden">
        <CardContainer className="max-w-2xl">
          <div className="flex flex-col space-y-4 divide-y primary-divider">
            {stakes
              .filter((stake) => stake.status === status)
              .map((stake) => (
                <StakeCard
                  key={stake.index}
                  index={stake.index}
                  status={stake.status}
                  start={stake.start}
                  end={stake.end}
                  principal={0}
                  shares={0}
                  payout={stake.payout}
                  penalty={stake.penalty}
                  progress={stake.progress}
                />
              ))}
          </div>
        </CardContainer>
      </div>
      <div className="hidden md:inline">
        <CardContainer>
          <table className="min-w-full divide-y primary-divider">
            <thead>
              <StakeRowHeaderFooter />
            </thead>
            <tbody className="divide-y secondary-divider">
              {stakes
                .filter((stake) => stake.status === status)
                .map((stake) => (
                  <StakeRow
                    key={stake.index}
                    index={stake.index}
                    status={stake.status}
                    start={stake.start}
                    end={stake.end}
                    principal={0}
                    shares={0}
                    payout={stake.payout}
                    penalty={stake.penalty}
                    progress={stake.progress}
                  />
                ))}
            </tbody>
          </table>
        </CardContainer>
      </div>
    </Container>
  );
};
