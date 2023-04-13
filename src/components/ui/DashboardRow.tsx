import { truncateAddress } from "@/utilities/helpers";
import { NextPage } from "next";
import Link from "next/link";
import { IconCopy, IconShare2 } from "@tabler/icons-react";
import { DashboardRowDatum, ChainStatus } from "@/models/dashboard";

export const DashboardRow: NextPage<DashboardRowDatum> = ({
  chainId,
  chainName,
  chainStatus,
  equitySupply,
  rewardSupply,
  shareRate,
  address,
}) => {
  const renderStatus = (status: ChainStatus) => {
    switch (status) {
      case ChainStatus.ACTIVE:
        return (
          <span className="inline-flex rounded-full  px-2 text-xs font-semibold leading-5 badge-success">
            {chainStatus}
          </span>
        );
      case ChainStatus.INACTIVE:
        return (
          <span className="inline-flex rounded-full  px-2 text-xs font-semibold leading-5 badge-error">
            {chainStatus}
          </span>
        );
    }
  };

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
        <Link href={`/dashboard/${chainId}`} className="primary-link">
          {chainName}
        </Link>
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium primary-text sm:pl-6">
        {renderStatus(chainStatus)}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text text-right font-mono">{equitySupply}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text text-right font-mono">{rewardSupply}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text text-right font-mono">{shareRate}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm secondary-text font-mono">{truncateAddress(address)}</td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex space-x-4">
          <a href="#" className="tertiary-link">
            <IconCopy className="w-5 h-5" />
          </a>

          <a href="#" className="tertiary-link">
            <IconShare2 className="w-5 h-5" />
          </a>
        </div>
      </td>
    </tr>
  );
};
