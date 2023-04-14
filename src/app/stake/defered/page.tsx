"use client";

import { StakesLayout } from "@/components/layouts/StakesLayout";
import { StakeStatus } from "@/models/stake";

const StakeDefer = () => {
  return <StakesLayout title="Deferred Stakes" subtitle="Deferred FENIX stakes" stakeStatus={StakeStatus.DEFER} />;
};

export default StakeDefer;
