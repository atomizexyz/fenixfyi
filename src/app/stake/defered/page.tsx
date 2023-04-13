"use client";

import { StakesLayout } from "@/components/layouts/StakesLayout";
import { StakeStatus, stakes } from "@/models/stake";

const StakeDefer = () => {
  return (
    <StakesLayout title="Deferred Stakes" subtitle="Deferred FENIX stakes" status={StakeStatus.DEFER} stakes={stakes} />
  );
};

export default StakeDefer;
