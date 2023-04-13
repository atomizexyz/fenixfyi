export enum ChainStatus {
  ACTIVE = 0,
  INACTIVE = 1,
}

export interface DashboardRowDatum {
  chainId: number;
  chainName: string;
  chainStatus: ChainStatus;
  equitySupply: number;
  rewardSupply: number;
  shareRate: number;
  address: string;
}
