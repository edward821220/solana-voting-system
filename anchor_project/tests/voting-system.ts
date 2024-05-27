import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VotingSystem } from "../target/types/voting_system";
import { assert } from "chai";

describe("voting-system", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.VotingSystem as Program<VotingSystem>;

  const voteManagerSeed = anchor.utils.bytes.utf8.encode("vote_manager");
  const voteSeed = anchor.utils.bytes.utf8.encode("vote");

  let voteManagePubkey: anchor.web3.PublicKey;

  before(async () => {
    [voteManagePubkey] = anchor.web3.PublicKey.findProgramAddressSync(
      [voteManagerSeed],
      program.programId
    );
  });

  it("Init vote manager", async () => {
    await program.methods.initVoteManager().rpc();
    const voteManagerAccount = await program.account.voteManager.fetch(
      voteManagePubkey
    );

    assert.ok(voteManagerAccount.totalVotes.eq(new anchor.BN(0)));
  });

  it("Create a new vote!", async () => {
    const voteManagerAccountBefore = await program.account.voteManager.fetch(
      voteManagePubkey
    );
    await program.methods
      .createVote(
        "The GOAT of NBA",
        ["LBJ", "MJ", "Kobe"],
        new anchor.BN(Date.now() + 1000 * 60 * 60 * 24 * 7)
      )
      .accounts({
        voteManager: voteManagePubkey,
      })
      .rpc();

    const voteManagerAccountAfter = await program.account.voteManager.fetch(
      voteManagePubkey
    );
    assert.ok(voteManagerAccountAfter.totalVotes.eq(new anchor.BN(1)));

    const voteId = voteManagerAccountBefore.totalVotes;
    const voteSeeds = [voteSeed, Buffer.from(voteId.toArray("le", 8))];
    const [votePubkey] = anchor.web3.PublicKey.findProgramAddressSync(
      voteSeeds,
      program.programId
    );

    const voteAccount = await program.account.vote.fetch(votePubkey);

    assert.ok(voteAccount.id.eq(voteId));
    assert.ok(voteAccount.topic === "The GOAT of NBA");
    assert.ok(voteAccount.options[0] === "LBJ");
    assert.ok(voteAccount.options[1] === "MJ");
    assert.ok(voteAccount.options[2] === "Kobe");
  });

  it("Execute a vote!", async () => {
    // await program.methods.executeVote().rpc();
  });
});
