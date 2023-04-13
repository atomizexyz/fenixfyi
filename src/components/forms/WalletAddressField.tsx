import type { NextPage } from "next";

export const WalletAddressField: NextPage<any> = (props) => {
  return (
    <div className="form-control w-full">
      <label className="primary-text">
        <span className="primary-text">Wallet Address</span>
        <span className="secondary-text">{props.errorMessage}</span>
      </label>
      <input type="text" placeholder="0x" className="primary-input" disabled={props.disabled} {...props.register} />
      <label className="label">
        <span className="primary-text">Wallet address beginning with 0x...</span>
      </label>
    </div>
  );
};
