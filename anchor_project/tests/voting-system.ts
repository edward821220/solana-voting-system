import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VotingSystem } from "../target/types/voting_system";
import { assert } from "chai";

describe("voting-system", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.VotingSystem as Program<VotingSystem>;

  const voteManagerSeed = Buffer.from("vote_manager");
  const voteSeed = Buffer.from("vote");

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
    const voteSeeds = [
      voteSeed,
      Buffer.from(new anchor.BN(0).toArray("le", 8)),
    ];
    const [votePubkey] = anchor.web3.PublicKey.findProgramAddressSync(
      voteSeeds,
      program.programId
    );

    const voteAccountBefore = await program.account.vote.fetch(votePubkey);
    assert.ok(voteAccountBefore.votes[1] === 0);

    await program.methods
      .executeVote(new anchor.BN(1))
      .accounts({ vote: votePubkey })
      .rpc();

    const voteAccountAfter = await program.account.vote.fetch(votePubkey);

    assert.ok(voteAccountAfter.votes[1] === 1);

    try {
      await program.methods
        .executeVote(new anchor.BN(1))
        .accounts({ vote: votePubkey })
        .rpc();
    } catch (err) {
      assert.equal(err.error.errorCode.code, "AlreadyVoted");
    }
  });
});
