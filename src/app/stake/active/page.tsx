"use client";

import { StakesLayout } from "@/components/layouts/StakesLayout";
import { StakeStatus } from "@/models/stake";

const StakeActive = () => {
  return <StakesLayout title="Active Stakes" subtitle="Active FENIX stakes" stakeStatus={StakeStatus.ACTIVE} />;
};

export default StakeActive;
