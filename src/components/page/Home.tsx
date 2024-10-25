"use client";
import React, { useState } from "react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Copy, Plus } from "lucide-react";
import nacl from "tweetnacl";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

function Home() {
  const [memonicWord, setMemonicWord] = useState("");
  const [wordCount, setWordCount] = useState(128);
  const [wordArr, setWordArr] = useState<string[]>([]);
  const [keyPair, setKeyPair] = useState<{ public: string; private: string }[]>(
    []
  );
  const [currentWallet , setCurrentWllet] = useState(1)

  function generateWords() {
    setKeyPair([]);
    const mnemonic = generateMnemonic(wordCount);
    setMemonicWord(mnemonic);
    const arrayType = mnemonic.split(" ");
    setWordArr(arrayType);
    const seed = mnemonicToSeedSync(mnemonic);

    const path = `m/44'/501'/${0}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const secretKeyHex = Buffer.from(secret).toString("hex");
    const publicKey = Keypair.fromSecretKey(secret).publicKey.toString();
    setKeyPair([{ public: publicKey, private: secretKeyHex }]);
  }

  function generateMore(){
    const seed = mnemonicToSeedSync(memonicWord);
    const path = `m/44'/501'/${currentWallet}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const secretKeyHex = Buffer.from(secret).toString("hex");
    const publicKey = Keypair.fromSecretKey(secret).publicKey.toString();
    setKeyPair([...keyPair , { public: publicKey, private: secretKeyHex }]);
    setCurrentWllet(currentWallet+1)

  }

  function copyFunction() {
    navigator.clipboard.writeText(memonicWord);
    alert("Secret phrase copied");
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-8">
      <h1 className="text-5xl font-semibold mt-10">
        Create Crypto Solana Wallet
      </h1>
      <div className="mt-8">
        <button
          onClick={generateWords}
          className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-3 text-xl font-medium rounded-lg shadow-md"
        >
          Generate Wallet
        </button>
      </div>

      {wordArr.length > 0 && (
        <div className="mt-10 w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recovery Phrase</h2>
            <button
              onClick={copyFunction}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <Copy size={20} /> <span>Copy</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 p-4 bg-gray-700 rounded-lg text-center">
            {wordArr.map((word, index) => (
              <div key={index} className="bg-gray-600 text-lg p-2 rounded">
                {word}
              </div>
            ))}
          </div>
        </div>
      )}

      {keyPair.length > 0 && (
        <div className="mt-8 w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Wallet Details</h2>
          {keyPair.map((pair, index) => (
            <div key={index} className="p-4 mb-4 bg-gray-700 rounded-lg">
              <div>
                <span className="font-bold text-lg">Public Key:</span>
                <p className="break-all text-sm text-gray-300">{pair.public}</p>
              </div>
              <div className="mt-4">
                <span className="font-bold text-lg">Private Key:</span>
                <p className="break-all text-sm text-gray-300">
                  {pair.private}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {wordArr.length>= 1 && <div onClick={generateMore} className="bg-black p-4 rounded-full fixed bottom-4 right-4 shadow-lg hover:bg-gray-800 transition-colors cursor-pointer">
        <Plus className="text-white" />
      </div>}
    </div>
  );
}

export default Home;
