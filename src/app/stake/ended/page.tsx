import { StakesLayout } from "@/components/layouts/StakesLayout";
import { StakeStatus } from "@/models/stakeStatus";

const StakeEnd = () => {
  return <StakesLayout title="Ended Stake" subtitle="Ended FENIX stakes" stakeStatus={StakeStatus.END} />;
};

export default StakeEnd;
