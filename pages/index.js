import * as bip39 from 'bip39';
import * as hdkey from 'hdkey';
import * as createHash from 'create-hash';
import * as bs58check from 'bs58check';
import React, { useState } from 'react';




export default function Home() {

  const [wallet, setWallet] = useState()
  const [mnemonic, setMnemonic] = useState()

  const bitcoinWallet = async () => 
  { 
    const mnemonic = bip39.generateMnemonic()
    //const mnemonic = "gentle mutual speak consider mandate kingdom cash explain soul exile cabin squeeze";
    setMnemonic(mnemonic);
    const seed = await bip39.mnemonicToSeed(mnemonic); //creates seed buffer
    console.log('Seed: ' + seed);
    console.log('mnemonic: ' + mnemonic);

    const root = hdkey.fromMasterSeed(seed);
    const masterPrivateKey = root.privateKey.toString('hex');
    console.log('masterPrivateKey: ' + masterPrivateKey);

    const addrnode = root.derive("m/44'/0'/0'/0/0");
    console.log('addrnodePublicKey: '+ addrnode._publicKey)

    const step1 = addrnode._publicKey;
    const step2 = createHash('sha256').update(step1).digest();
    const step3 = createHash('rmd160').update(step2).digest();

    var step4 = Buffer.allocUnsafe(21);
    step4.writeUInt8(0x00, 0);
    step3.copy(step4, 1); //step4 now holds the extended RIPMD-160 result
    const step9 = bs58check.encode(step4);
    setWallet(step9);
    console.log('Base58Check: ' + step9);
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
                  Wallet: {wallet}
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