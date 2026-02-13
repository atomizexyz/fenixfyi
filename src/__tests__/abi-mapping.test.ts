import { describe, it, expect } from "vitest";
import { FENIX_ABI } from "@/config/abi";

function findFunction(name: string) {
  return FENIX_ABI.find(
    (entry) => entry.type === "function" && entry.name === name
  );
}

describe("FENIX ABI mapping", () => {
  it("contains stakeFor function", () => {
    const stakeFor = findFunction("stakeFor");
    expect(stakeFor).toBeDefined();
  });

  it("stakeFor output tuple has correct Stake struct fields", () => {
    const stakeFor = findFunction("stakeFor");
    expect(stakeFor).toBeDefined();

    const outputs = stakeFor!.outputs;
    expect(outputs).toHaveLength(1);

    const tupleOutput = outputs![0];
    expect(tupleOutput.type).toBe("tuple");

    const components = (tupleOutput as { components: { name: string; type: string }[] }).components;
    const fieldNames = components.map((c) => c.name);
    expect(fieldNames).toEqual([
      "status",
      "startTs",
      "deferralTs",
      "endTs",
      "term",
      "fenix",
      "shares",
      "payout",
    ]);
  });

  it("stakeFor output fields have correct types", () => {
    const stakeFor = findFunction("stakeFor");
    const components = (stakeFor!.outputs![0] as { components: { name: string; type: string }[] }).components;

    const fieldTypes = Object.fromEntries(components.map((c) => [c.name, c.type]));
    expect(fieldTypes.status).toBe("uint8");
    expect(fieldTypes.startTs).toBe("uint40");
    expect(fieldTypes.deferralTs).toBe("uint40");
    expect(fieldTypes.endTs).toBe("uint40");
    expect(fieldTypes.term).toBe("uint16");
    expect(fieldTypes.fenix).toBe("uint256");
    expect(fieldTypes.shares).toBe("uint256");
    expect(fieldTypes.payout).toBe("uint256");
  });

  it("burnXEN takes exactly 1 uint256 arg", () => {
    const burnXEN = findFunction("burnXEN");
    expect(burnXEN).toBeDefined();
    expect(burnXEN!.inputs).toHaveLength(1);
    expect(burnXEN!.inputs![0].type).toBe("uint256");
  });

  it("startStake takes 2 uint256 args", () => {
    const startStake = findFunction("startStake");
    expect(startStake).toBeDefined();
    expect(startStake!.inputs).toHaveLength(2);
    expect(startStake!.inputs![0].type).toBe("uint256");
    expect(startStake!.inputs![1].type).toBe("uint256");
  });

  it("endStake takes 1 uint256 arg", () => {
    const endStake = findFunction("endStake");
    expect(endStake).toBeDefined();
    expect(endStake!.inputs).toHaveLength(1);
    expect(endStake!.inputs![0].type).toBe("uint256");
  });

  it("deferStake takes uint256 + address args", () => {
    const deferStake = findFunction("deferStake");
    expect(deferStake).toBeDefined();
    expect(deferStake!.inputs).toHaveLength(2);
    expect(deferStake!.inputs![0].type).toBe("uint256");
    expect(deferStake!.inputs![1].type).toBe("address");
  });

  it("stakeCount takes 1 address arg", () => {
    const stakeCount = findFunction("stakeCount");
    expect(stakeCount).toBeDefined();
    expect(stakeCount!.inputs).toHaveLength(1);
    expect(stakeCount!.inputs![0].type).toBe("address");
  });
});
