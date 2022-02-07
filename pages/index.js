import * as Bip39 from 'bip39';
import * as Hdkey from 'hdkey';
import * as createHash from 'create-hash';
import * as bs58check from 'bs58check';
import React, { useState } from 'react';




export default function Home() {

  const [wallet, setWallet] = useState()
  const [mnemonic, setMnemonic] = useState()

  const bitcoinWallet = async () => 
  { 
    // wrap logic into a async function
    //1. Master Private Key Generation
    const mnemonic = Bip39.generateMnemonic(); // generates a 12 word mnemonic
    const seed = Bip39.mnemonicToSeed(mnemonic) //create seed buffer  
    console.log(mnemonic);
    setMnemonic(mnemonic)
    //2. Address generation
    const root = Hdkey.fromMasterSeed(seed);  // should not be passing a promise into here
    const masterPrivateKey = root.privateKey.toString('hex');
    //3. add path
    const addrnode = root.derive("m/44'/60'/0'/0/0");
    //4. get public key
    const step1 = addrnode._publicKey;
    //5.perform sha-256 hashing on public key
    const step2 = createHash('sha256').update(step1).digest();
    //6. perform RIPEMD hashing on sha-256
    const step3 = createHash('rmd160').update(step2).digest();
    //7. Add version byte in front of RIPEMD-160 hash (0x00 for mainnet, 0x6f for testnet)
    var step4 = Buffer.allocUnsafe(21);
    step4.writeUInt8(0x6f, 0);
    step3.copy(step4, 1) //step3 now holds the extended RIPEMD160 result
    var step9 = bs58check.encode(step4); //Steps 5-9
    console.log(step9)
    setWallet(step9)
  };

  return (
    <section>
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
            </div>
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block text-indigo-600 xl:inline">CPPAY</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Bitcoin Address Generator <br />
                  Treat your public key as securely as you would treat your master private key as you can still generate the addresses nodes with it.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button onClick={bitcoinWallet} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                      Generate Wallet Address
                    </button>
                  </div>
                  
                </div>
              </div>
            </main>
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
            </div>
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <p className="mt-3 font-extrabold text-dark-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Wallet: 0x6f{wallet}
                </p>
                <p className="mt-3 font-extrabold text-indigo-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Mnemonic: {mnemonic}
                </p>
              </div>
            </main>
          </div>
        </div>
        
      </div>
    </section>
  )
}
