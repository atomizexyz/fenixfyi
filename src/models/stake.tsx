export const enum StakeStatus {
  ACTIVE = 0,
  DEFER = 1,
  END = 2,
}

export interface StakeRowDatum {
  index: number;
  status: StakeStatus;
  start: Date;
  end: Date;
  principal: number;
  shares: number;
  payout: number;
  penalty: number;
  progress: number;
}

export const stakes: StakeRowDatum[] = [
  {
    index: 0,
    status: StakeStatus.ACTIVE,
    start: new Date(),
    end: new Date(),
    principal: 100,
    shares: 100,
    payout: 100,
    penalty: 100,
    progress: 32.1,
  },
  {
    index: 1,
    status: StakeStatus.ACTIVE,
    start: new Date(),
    end: new Date(),
    principal: 100,
    shares: 100,
    payout: 100,
    penalty: 100,
    progress: 110.5,
  },
  {
    index: 2,
    status: StakeStatus.DEFER,
    start: new Date(),
    end: new Date(),
    principal: 100,
    shares: 100,
    payout: 100,
    penalty: 100,
    progress: 100,
  },
  {
    index: 3,
    status: StakeStatus.END,
    start: new Date(),
    end: new Date(),
    principal: 100,
    shares: 100,
    payout: 100,
    penalty: 100,
    progress: 100,
  },
];
