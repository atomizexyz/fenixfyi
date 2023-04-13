import { truncateAddress } from "@/utilities/helpers";
import { NextPage } from "next";
import Link from "next/link";
import { IconCopy, IconShare2 } from "@tabler/icons-react";
import { DashboardRowDatum, ChainStatus } from "@/models/dashboard";

export const DashboardCard: NextPage<DashboardRowDatum> = ({
  chainId,
  chainName,
  chainStatus,
  equitySupply,
  rewardSupply,
  shareRate,
  address,
}) => {
  const renderStatus = (status: ChainStatus) => {
    switch (chainStatus) {
      case ChainStatus.ACTIVE:
        return (
          <span className="inline-flex rounded-full  px-2 text-xs font-semibold leading-5 badge-success">Active</span>
        );
      case ChainStatus.INACTIVE:
        return (
          <span className="inline-flex rounded-full  px-2 text-xs font-semibold leading-5 badge-error">Inactive</span>
        );
    }
  };

  return (
    <dl className="divide-y secondary-divider">
      <div className="py-2 flex justify-between">
        <dt className="text-sm font-medium primary-text">Chain</dt>
        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text">
          <Link href={`/dashboard/${chainId}`} className="primary-link">
            {chainName}
          </Link>
        </dd>
      </div>
      <div className="py-2 flex justify-between">
        <dt className="text-sm font-medium primary-text">Status</dt>
        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text">{renderStatus(chainStatus)}</dd>
      </div>

      <div className="py-2 flex justify-between">
        <dt className="text-sm font-medium primary-text">Equity Supply</dt>
        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">{equitySupply}</dd>
      </div>
      <div className="py-2 flex justify-between">
        <dt className="text-sm font-medium primary-text">Reward Supply</dt>
        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">{rewardSupply}</dd>
      </div>
      <div className="py-2 flex justify-between">
        <dt className="text-sm font-medium primary-text">Share Rate</dt>
        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">{shareRate}</dd>
      </div>
      <div className="py-2 flex justify-between">
        <dt className="text-sm font-medium primary-text">Address</dt>
        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0 secondary-text font-mono">{truncateAddress(address)}</dd>
      </div>
      <div className="py-2 flex space-x-8">
        <a href="#" className="tertiary-link">
          <IconCopy className="w-5 h-5" />
        </a>
        <a href="#" className="tertiary-link">
          <IconShare2 className="w-5 h-5" />
        </a>
      </div>
    </dl>
  );
};
