import type { NextPage } from "next";

export const WalletAddressField: NextPage<any> = (props) => {
  return (
    <div className="form-control w-full">
      <label className="label text-neutral">
        <span className="label-text text-neutral">Wallet Address</span>
        <span className="label-text-alt text-error">{props.errorMessage}</span>
      </label>
      <input type="text" placeholder="0x" className="primary-input" disabled={props.disabled} {...props.register} />
      <label className="label">
        <span className="label-text-alt text-neutral">Wallet address beginning with 0x...</span>
      </label>
    </div>
  );
};
