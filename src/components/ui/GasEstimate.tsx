import { BigNumber } from "ethers";
import { NextPage } from "next";
import { formatDecimals, toGwei } from "@/utilities/helpers";

interface GasEstimateProps {
  gasPrice?: BigNumber | null;
  gasLimit?: BigNumber;
}

const GasEstimate: NextPage<GasEstimateProps> = ({ gasPrice, gasLimit }) => {
  return (
    <table className="w-full">
      <tbody>
        <tr className="text-sm ">
          <td className="capitalized primary-text">Gas:</td>
          <td className="text-sm font-mono text-right secondary-text">
            {formatDecimals(Number(toGwei(gasPrice ?? BigNumber.from(0))), 0, "gwei")}
          </td>
        </tr>
        <tr className="text-sm">
          <td className="capitalized primary-text">Transaction:</td>
          <td className="text-sm  font-mono text-right secondary-text">
            {formatDecimals(Number(gasLimit ?? 0), 0, "gwei")}
          </td>
        </tr>
        <tr className="text-sm">
          <td className="capitalized primary-text">Total:</td>
          <td className="text-sm font-mono text-right secondary-text">
            {formatDecimals(Number(toGwei(gasPrice?.mul(gasLimit ?? 0) ?? BigNumber.from(0))), 0, "gwei")}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default GasEstimate;
