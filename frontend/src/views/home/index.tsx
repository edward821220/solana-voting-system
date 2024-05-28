import { FC, useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { RequestAirdrop } from "../../components/RequestAirdrop";
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";
import {
  Program,
  AnchorProvider,
  web3,
  BN,
  setProvider,
} from "@coral-xyz/anchor";
import idl from "../../idl/voting_system.json";
import { VotingSystem } from "../../idl/voting_system";
import { PublicKey } from "@solana/web3.js";
import { notify } from "utils/notifications";

const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);
const programID = new PublicKey(idl.address);

const VOTE_MANAGER_ACCOUNT_DATA_SIZE = 8 + 8;
const VOTE_ACCOUNT_DATA_SIZE = 8 + 892;

const confirmOptions: web3.ConfirmOptions = {
  commitment: "confirmed",
};

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();
  const [votes, setVotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVote, setSelectedVote] = useState(null);
  const [showCreateVoteModal, setShowCreateVoteModal] = useState(false);
  const [newVote, setNewVote] = useState({
    topic: "",
    options: [""],
    period: 0,
  });

  const getProvider = () => {
    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    setProvider(provider);
    return provider;
  };

  const handleVoteClick = (vote) => {
    setSelectedVote(vote);
    setShowModal(true);
  };

  const handleVote = async (
    voteAccountPubkey: web3.PublicKey,
    index: number
  ) => {
    const anchorProvider = getProvider();
    const program = new Program<VotingSystem>(idl_object, anchorProvider);
    try {
      await program.methods
        .executeVote(new BN(index))
        .accounts({ vote: voteAccountPubkey })
        .rpc(confirmOptions);
      await getVotes();
      setSelectedVote(null);
      setShowModal(false);
    } catch (err) {
      console.log(err);
      notify({
        type: "error",
        message: "error",
        description: err?.error?.errorCode?.code || err?.message,
      });
    }
  };

  const handleCreateVote = async () => {
    const anchorProvider = getProvider();
    const program = new Program<VotingSystem>(idl_object, anchorProvider);
    try {
      const voteManagerAccount = await connection.getParsedProgramAccounts(
        programID,
        {
          filters: [{ dataSize: VOTE_MANAGER_ACCOUNT_DATA_SIZE }],
        }
      );
      await program.methods
        .createVote(
          newVote.topic,
          newVote.options,
          new BN(Math.floor(Date.now() / 1000) + newVote.period)
        )
        .accounts({
          voteManager: voteManagerAccount[0].pubkey,
        })
        .rpc(confirmOptions);
      await getVotes();
      setShowCreateVoteModal(false);
      setNewVote({ topic: "", options: [""], period: 0 });
    } catch (err) {
      console.log(err);
      notify({
        type: "error",
        message: "error",
        description: err?.error?.errorCode?.code || err?.message,
      });
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newVote.options];
    newOptions[index] = value;
    setNewVote({ ...newVote, options: newOptions });
  };

  const handleAddOption = () => {
    if (newVote.options.length < 20) {
      setNewVote({ ...newVote, options: [...newVote.options, ""] });
    }
  };

  const handleRemoveOption = (index) => {
    const newOptions = newVote.options.filter((_, i) => i !== index);
    setNewVote({ ...newVote, options: newOptions });
  };

  const getVotes = async () => {
    try {
      const anchorProvider = getProvider();
      const program = new Program<VotingSystem>(idl_object, anchorProvider);
      const voteAccounts = await connection.getParsedProgramAccounts(
        programID,
        {
          filters: [{ dataSize: VOTE_ACCOUNT_DATA_SIZE }],
        }
      );
      const voteAccountsData = await Promise.all(
        voteAccounts.map(async (account) => {
          return {
            ...(await program.account.vote.fetch(account.pubkey)),
            pubkey: account.pubkey,
          };
        })
      );
      setVotes(voteAccountsData);
    } catch (error) {
      console.error("Error while getting votes: " + error);
    }
  };

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
    getVotes();
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className="flex flex-col mt-2">
          <RequestAirdrop />
          <h4 className="md:w-full text-2xl text-slate-300 my-2">
            {wallet && (
              <div className="flex flex-row justify-center">
                <div>{(balance || 0).toLocaleString()}</div>
                <div className="text-slate-600 ml-2">SOL</div>
              </div>
            )}
          </h4>
        </div>
        <div className="flex justify-between">
          <button
            className="bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
            onClick={() => setShowCreateVoteModal(true)}
          >
            Create Vote
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          {votes.map((vote) => (
            <button
              key={vote.id}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg shadow-md hover:from-purple-700 hover:to-blue-700 transition duration-300 transform hover:scale-105"
              onClick={() => handleVoteClick(vote)}
            >
              <div className="text-lg font-bold">{vote.topic}</div>
              {Math.floor(Date.now() / 1000) > vote.endTime && (
                <div className="text-lg font-bold">(Ended)</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {selectedVote && (
        <div
          className={`fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center ${
            showModal ? "" : "hidden"
          }`}
        >
          <div className="bg-[#1e1e1e] rounded-lg p-8 shadow-lg w-11/12 md:w-2/3 lg:w-1/3">
            <h2 className="text-3xl font-bold text-white mb-6">
              {selectedVote.topic}
            </h2>
            <div className="flex flex-col space-y-4">
              {selectedVote.options.map((option, index) => {
                const winnerIndex = Math.max(...selectedVote.votes);
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-[#2a2a2a] text-white py-3 px-4 rounded-lg shadow-md"
                  >
                    {selectedVote.votes[winnerIndex] !== 0 &&
                      Date.now() / 1000 >= selectedVote.endTime &&
                      index === winnerIndex && (
                        <span className="text-lg">🏆</span>
                      )}
                    <span className="text-lg">{option}</span>
                    <span className="bg-[#1e90ff] py-1 px-3 rounded-full text-sm font-semibold">
                      {selectedVote.votes[index]} people
                    </span>
                    <button
                      className="ml-4 bg-[#00c09a] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[#00a383] transition duration-300"
                      onClick={() => handleVote(selectedVote.pubkey, index)}
                    >
                      Vote
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              className="mt-6 bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showCreateVoteModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
          <div className="bg-[#1e1e1e] rounded-lg p-8 shadow-lg w-11/12 md:w-2/3 lg:w-1/3">
            <h2 className="text-3xl font-bold text-white mb-6">Create Vote</h2>
            <div className="flex flex-col space-y-4">
              <input
                className="bg-[#2a2a2a] text-white py-2 px-4 rounded-lg shadow-md"
                placeholder="Topic"
                value={newVote.topic}
                onChange={(e) =>
                  setNewVote({ ...newVote, topic: e.target.value })
                }
              />
              <div className="flex flex-col space-y-2">
                {newVote.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      className="bg-[#2a2a2a] text-white py-2 px-4 rounded-lg shadow-md flex-1"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                    />
                    <button
                      className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                      onClick={() => handleRemoveOption(index)}
                    >
                      -
                    </button>
                  </div>
                ))}
                {newVote.options.length < 20 && (
                  <button
                    className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                    onClick={handleAddOption}
                  >
                    +
                  </button>
                )}
              </div>
              <input
                className="bg-[#2a2a2a] text-white py-2 px-4 rounded-lg shadow-md"
                placeholder="Period (in seconds)"
                value={newVote.period || ""}
                type="number"
                onChange={(e) =>
                  setNewVote({ ...newVote, period: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
                onClick={() => setShowCreateVoteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                onClick={handleCreateVote}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
