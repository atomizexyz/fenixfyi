"use client";

import { StakesLayout } from "@/components/layouts/StakesLayout";
import { StakeStatus, stakes } from "@/models/stake";

const StakeActive = () => {
  return (
    <StakesLayout title="Active Stakes" subtitle="Active FENIX stakes" status={StakeStatus.ACTIVE} stakes={stakes} />
  );
};

export default StakeActive;
