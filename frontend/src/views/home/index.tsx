// Next, React
import { FC, useEffect, useState } from "react";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Components
import { RequestAirdrop } from "../../components/RequestAirdrop";

// Store
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

const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);
const programID = new PublicKey(idl.address);

const VOTE_MANAGER_ACCOUNT_DATA_SIZE = 8 + 8;
const VOTE_ACCOUNT_DATA_SIZE = 8 + 892;
const USER_VOTE_ACCOUNT_DATA_SIZE = 8 + 65;

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();
  const [votes, setVotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVote, setSelectedVote] = useState(null);

  const getProvider = () => {
    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    setProvider(provider);
    return provider;
  };

  const getVotes = async () => {
    try {
      const anchorProvider = getProvider();
      const program = new Program<VotingSystem>(idl_object, anchorProvider);
      const voteAccountPubKeys = await connection.getParsedProgramAccounts(
        programID,
        { filters: [{ dataSize: VOTE_ACCOUNT_DATA_SIZE }] }
      );
      console.log(voteAccountPubKeys);
      const voteAccounts = await Promise.all(
        voteAccountPubKeys.map((key) => {
          return program.account.vote.fetch(key.pubkey);
        })
      );
      console.log(voteAccounts);
      setVotes(voteAccounts);
    } catch (error) {
      console.error("Error while getting banks: " + error);
    }
  };

  const handleVoteClick = (vote) => {
    setSelectedVote(vote);
    setShowModal(true);
  };

  const handleVote = (option) => {
    console.log(`Voted for option: ${option}`);
    setSelectedVote(null);
    setShowModal(false);
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
        <div className="grid grid-cols-1 gap-4">
          {votes.map((vote) => (
            <button
              key={vote.id}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg shadow-md hover:from-purple-700 hover:to-blue-700 transition duration-300 transform hover:scale-105"
              onClick={() => handleVoteClick(vote)}
            >
              <div className="text-lg font-bold">
                {vote.id.add(new BN(1)).toLocaleString()}. {vote.topic}
              </div>
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
              {selectedVote.options.map((option: string, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-[#2a2a2a] text-white py-3 px-4 rounded-lg shadow-md"
                >
                  <span className="text-lg">{option}</span>
                  <span className="bg-[#1e90ff] py-1 px-3 rounded-full text-sm font-semibold">
                    {selectedVote.votes[index]} people
                  </span>
                  <button
                    className="ml-4 bg-[#00c09a] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[#00a383] transition duration-300"
                    onClick={() => handleVote(option)}
                  >
                    Vote
                  </button>
                </div>
              ))}
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
    </div>
  );
};
