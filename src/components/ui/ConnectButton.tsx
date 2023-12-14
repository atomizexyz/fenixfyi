"use client";

import { chainIcons } from "@/utilities/constants";
import { ConnectKitButton } from "connectkit";

export default function ConnectButton() {
  return (
    <div className="primary-text">Maintenance</div>
    // <ConnectKitButton.Custom>
    //   {({ isConnected, show, address, truncatedAddress, chain }) => {
    //     return (
    //       <>
    //         {isConnected ? (
    //           <button onClick={show} className="primary-button">
    //             <div className="flex space-x-4 items-center">
    //               {chain && chainIcons[chain.id]}
    //               <div className="font-mono">{truncatedAddress}</div>
    //             </div>
    //           </button>
    //         ) : (
    //           <button onClick={show} className="primary-button">
    //             Connect Wallet
    //           </button>
    //         )}
    //       </>
    //     );
    //   }}
    // </ConnectKitButton.Custom>
  );
}
