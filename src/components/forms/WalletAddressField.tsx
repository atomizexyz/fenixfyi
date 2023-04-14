import type { NextPage } from "next";

export const WalletAddressField: NextPage<any> = (props) => {
  return (
    <div className="form-control w-full">
      <label className="flex justify-between">
        <span className="text-sm secondary-text">Wallet Address</span>
        <span className="text-sm secondary-text">{props.errorMessage}</span>
      </label>
      <input type="text" placeholder="0x" className="primary-input" disabled={props.disabled} {...props.register} />
      <label className="label">
        <span className="text-sm secondary-text">Wallet address beginning with 0x...</span>
      </label>
    </div>
  );
};
