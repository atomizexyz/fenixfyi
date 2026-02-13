import { describe, it, expect } from "vitest";
import { FENIX_CHAINS, SUPPORTED_CHAINS, getChainConfig } from "@/config/chains";

describe("Chain Configuration", () => {
  it("has 12 chain configs", () => {
    expect(FENIX_CHAINS).toHaveLength(12);
  });

  it("all chains are enabled", () => {
    for (const config of FENIX_CHAINS) {
      expect(config.enabled).toBe(true);
    }
  });

  it("SUPPORTED_CHAINS matches enabled chains", () => {
    const enabledCount = FENIX_CHAINS.filter((c) => c.enabled).length;
    expect(SUPPORTED_CHAINS).toHaveLength(enabledCount);
  });

  it("all chains have valid contract addresses", () => {
    const addressRegex = /^0x[0-9a-fA-F]{40}$/;
    for (const config of FENIX_CHAINS) {
      expect(config.xenContract).toMatch(addressRegex);
      expect(config.fenixContract).toMatch(addressRegex);
    }
  });

  it("FENIX contracts use correct addresses per chain", () => {
    const defaultAddress = "0xC3e8abfA04B0EC442c2A4D65699a40F7FcEd8055";
    const evmosAddress = "0x7c27d2D2044FE90Cb98f5ECdc235839FdE740124";
    const baseAddress = "0x07FdE3eD7727c1D84171A6e5815964d50827CF69";

    for (const config of FENIX_CHAINS) {
      if (config.chain.id === 9001) {
        expect(config.fenixContract).toBe(evmosAddress);
      } else if (config.chain.id === 8453) {
        expect(config.fenixContract).toBe(baseAddress);
      } else {
        expect(config.fenixContract).toBe(defaultAddress);
      }
    }
  });

  it("all chains have unique IDs", () => {
    const ids = FENIX_CHAINS.map((c) => c.chain.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all chains have icon slugs", () => {
    for (const config of FENIX_CHAINS) {
      expect(config.iconSlug).toBeDefined();
      expect(config.iconSlug.length).toBeGreaterThan(0);
    }
  });

  it("includes Ethereum mainnet", () => {
    const eth = FENIX_CHAINS.find((c) => c.chain.id === 1);
    expect(eth).toBeDefined();
    expect(eth?.chain.name).toBe("Ethereum");
  });

  it("includes PulseChain", () => {
    const pulse = FENIX_CHAINS.find((c) => c.chain.id === 369);
    expect(pulse).toBeDefined();
  });

  it("includes Dogechain", () => {
    const doge = FENIX_CHAINS.find((c) => c.chain.id === 2000);
    expect(doge).toBeDefined();
    expect(doge?.iconSlug).toBe("dogechain");
  });

  it("includes OKC", () => {
    const okc = FENIX_CHAINS.find((c) => c.chain.id === 66);
    expect(okc).toBeDefined();
    expect(okc?.iconSlug).toBe("okc");
  });

  it("includes EthereumPoW", () => {
    const ethw = FENIX_CHAINS.find((c) => c.chain.id === 10001);
    expect(ethw).toBeDefined();
    expect(ethw?.iconSlug).toBe("ethw");
  });

  it("includes all 12 expected chains", () => {
    const expectedIds = [1, 137, 56, 43114, 1284, 9001, 250, 2000, 66, 10001, 8453, 369];
    for (const id of expectedIds) {
      expect(FENIX_CHAINS.find((c) => c.chain.id === id)).toBeDefined();
    }
  });
});

describe("getChainConfig", () => {
  it("returns config for valid chain ID", () => {
    const config = getChainConfig(1); // Ethereum mainnet
    expect(config).toBeDefined();
    expect(config?.chain.name).toBe("Ethereum");
  });

  it("returns undefined for unknown chain ID", () => {
    expect(getChainConfig(999999)).toBeUndefined();
  });

  it("returns correct contracts for each chain", () => {
    for (const expected of FENIX_CHAINS) {
      const config = getChainConfig(expected.chain.id);
      expect(config?.xenContract).toBe(expected.xenContract);
      expect(config?.fenixContract).toBe(expected.fenixContract);
    }
  });
});
