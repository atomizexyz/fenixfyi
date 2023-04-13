"use client";

import { Avatar, ConnectKitButton } from "connectkit";

export default function ConnectButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address, truncatedAddress }) => {
        return (
          <>
            {isConnected ? (
              <button onClick={show} className="primary-button">
                <div className="flex space-x-2 items-center">
                  <div className="hidden lg:inline-flex rounded-full shadow">
                    <Avatar address={address} size={16} />
                  </div>
                  <div className="font-mono">{truncatedAddress}</div>
                </div>
              </button>
            ) : (
              <button onClick={show} className="primary-button">
                Connect Wallet
              </button>
            )}
          </>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
