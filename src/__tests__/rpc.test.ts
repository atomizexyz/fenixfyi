import { describe, it, expect } from "vitest";
import {
  CHAIN_RPC_ENDPOINTS,
  createChainTransport,
  chainTransports,
} from "@/config/rpc";

const EXPECTED_CHAIN_IDS = [
  1, 137, 56, 43114, 1284, 9001, 250, 2000, 66, 10001, 8453, 369,
];

const WSS_ONLY_CHAINS = [2000, 66, 10001]; // Dogechain, OKC, EthereumPoW

describe("CHAIN_RPC_ENDPOINTS", () => {
  it("has config for all 12 chains", () => {
    for (const id of EXPECTED_CHAIN_IDS) {
      expect(CHAIN_RPC_ENDPOINTS[id]).toBeDefined();
    }
    expect(Object.keys(CHAIN_RPC_ENDPOINTS)).toHaveLength(12);
  });

  it("all HTTP URLs use https://", () => {
    for (const [, config] of Object.entries(CHAIN_RPC_ENDPOINTS)) {
      for (const url of config.http) {
        expect(url).toMatch(/^https:\/\//);
      }
    }
  });

  it("all WSS URLs use wss://", () => {
    for (const [, config] of Object.entries(CHAIN_RPC_ENDPOINTS)) {
      for (const url of config.wss) {
        expect(url).toMatch(/^wss:\/\//);
      }
    }
  });

  it("chains without WSS have empty wss arrays", () => {
    for (const id of WSS_ONLY_CHAINS) {
      expect(CHAIN_RPC_ENDPOINTS[id].wss).toHaveLength(0);
    }
  });

  it("chains with WSS have at least one wss URL", () => {
    const wssChains = EXPECTED_CHAIN_IDS.filter(
      (id) => !WSS_ONLY_CHAINS.includes(id)
    );
    for (const id of wssChains) {
      expect(CHAIN_RPC_ENDPOINTS[id].wss.length).toBeGreaterThan(0);
    }
  });

  it("every chain has at least one HTTP endpoint", () => {
    for (const [, config] of Object.entries(CHAIN_RPC_ENDPOINTS)) {
      expect(config.http.length).toBeGreaterThan(0);
    }
  });
});

describe("createChainTransport", () => {
  it("returns a transport for all 12 chains", () => {
    for (const id of EXPECTED_CHAIN_IDS) {
      const transport = createChainTransport(id);
      expect(transport).toBeDefined();
      expect(typeof transport).toBe("function");
    }
  });

  it("throws for unknown chain ID", () => {
    expect(() => createChainTransport(999999)).toThrow(
      "No RPC config for chain 999999"
    );
  });
});

describe("chainTransports", () => {
  it("has a transport for all 12 chains", () => {
    for (const id of EXPECTED_CHAIN_IDS) {
      expect(chainTransports[id]).toBeDefined();
      expect(typeof chainTransports[id]).toBe("function");
    }
  });

  it("has exactly 12 entries", () => {
    expect(Object.keys(chainTransports)).toHaveLength(12);
  });
});
