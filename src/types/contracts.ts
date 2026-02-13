export interface ChainConfig {
  id: number;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorers: {
    name: string;
    url: string;
  }[];
  xenContractAddress: `0x${string}`;
  fenixContractAddress: `0x${string}`;
  iconPath: string;
}

export interface StakeInfo {
  status: StakeStatus;
  startTs: bigint;
  deferralTs: bigint;
  endTs: bigint;
  term: bigint;
  fenix: bigint;
  shares: bigint;
  payout: bigint;
}

export enum StakeStatus {
  Active = 0,
  Deferred = 1,
  EndedOnTime = 2,
  EndedEarly = 3,
  EndedLate = 4,
}

export interface BurnRecord {
  user: `0x${string}`;
  xenBurned: bigint;
  fenixMinted: bigint;
  timestamp: bigint;
  txHash: string;
}

export interface PoolInfo {
  totalShares: bigint;
  totalStaked: bigint;
  rewardPool: bigint;
  shareRate: bigint;
}

export interface ProtocolStats {
  totalXenBurned: bigint;
  totalFenixMinted: bigint;
  totalStaked: bigint;
  totalShares: bigint;
  currentShareRate: bigint;
  rewardPoolBalance: bigint;
  adoptionPoolBalance: bigint;
}
