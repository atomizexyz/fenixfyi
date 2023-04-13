"use client";

import React, { createContext, useEffect, useState } from "react";

interface IFenixContext {
  showConfetti: boolean;
}

const FenixContext = createContext<IFenixContext>({
  showConfetti: false,
});

export const FenixProvider = ({ children }: any) => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  return <FenixContext.Provider value={{ showConfetti }}>{children}</FenixContext.Provider>;
};

export default FenixContext;
