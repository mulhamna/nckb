import { ccc } from "@ckb-ccc/core";
import { buildClient, buildSigner } from "./helper";

// one-off helper: fund an arbitrary CKB address on devnet (used to fund the
// simple-lock example's hash-lock address, since offckb's own `transfer`
// CLI can't parse addresses built from custom/non-standard lock scripts)
describe("fund address", () => {
  let client: ccc.Client;
  let signer: ccc.SignerCkbPrivateKey;

  beforeAll(() => {
    client = buildClient("devnet");
    signer = buildSigner(client);
  });

  test("send capacity to target address", async () => {
    const targetAddress =
      "ckt1qzkymvxscq5t5rtnmmy7uhn28sxf3lxle2y4gq4r9pwksr5kfh95vqgqqrxjvt9nnk0g8a372s26263rnqhmdtnehxf78nehrsf044ca6g63jpqsdyg7f7p70y8pavhnn00ly0qaksldttujr8mk8et38zd0yyjeegwmczc8";
    const amountCKB = 200;

    const toLock = (await ccc.Address.fromString(targetAddress, client))
      .script;

    const tx = ccc.Transaction.from({
      outputs: [{ lock: toLock, capacity: ccc.fixedPointFrom(amountCKB) }],
    });

    await tx.completeInputsByCapacity(signer);
    await tx.completeFeeBy(signer, 1000);
    const txHash = await signer.sendTransaction(tx);
    console.log(`Funded ${targetAddress} with ${amountCKB} CKB: ${txHash}`);
  });
});
