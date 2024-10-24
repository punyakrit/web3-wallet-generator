"use client";
import React, { useState } from "react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Copy } from "lucide-react";

function Home() {
  const [memonicWord, setMemonicWord] = useState("");
  const [wordCount, setWordCount] = useState(128);
  const [wordArr, setWordArr] = useState<string[]>([]);

  function generateWords() {
    const mnemonic = generateMnemonic(wordCount); 
    setMemonicWord(mnemonic); 
    const arrayType = mnemonic.split(" "); 
    setWordArr(arrayType); 
    console.log(arrayType);
  }

  function copyFunction(){
    navigator.clipboard.writeText(memonicWord)
    alert("Secret phase copied")
  }

  return (
    <div>
      <div className="text-5xl font-semibold text-center pt-20">
        Create Crypto Solana Wallet
      </div>
      <div className="flex justify-center mt-10">
        <button
          onClick={generateWords}
          className="border-white/80 border px-3 py-2 text-xl rounded-2xl"
        >
          Generate Wallet
        </button>
      </div>
      {wordArr.length>=1 && <div className="flex justify-center mt-4">
        <div className="w-full max-w-xl border rounded-3xl p-4">
        <div className="text-center font-bold text-xl mb-4">
            Secret Key Pair
        </div>
        <div className="flex justify-end cursor-pointer " onClick={copyFunction}>
            <Copy/>
            </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {wordArr.map((word, index) => (
              <div
                key={index}
                className="px-2 py-1 bg-gray-200 rounded-md text-black"
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  );
}

export default Home;
