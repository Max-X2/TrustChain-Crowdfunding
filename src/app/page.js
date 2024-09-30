"use client";

import { useState, useContext } from "react";
import { connectWallet } from "@/services/Web3Service";
import { ModalWallet } from "@/components/Modals";
import { AddressContext } from "@/app/context/addressContext.js";
import ConnectedWalletInfo from "@/components/ConnectedWalletInfo";
import IconsWallet from "@/components/IconsWallet";

export default function Home() {
  const [showModalWallet, setShowModalWallet] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { address, setAddress } = useContext(AddressContext); 
  const [copySuccess, setCopySuccess] = useState(false);

  const btnConnectWallet = () => {
    connectWallet()
      .then(({ account }) => {
        if (account) {
          setAddress(account); 
          setMessage(`Connected Wallet Address: ${address}`);
        } else {
          setError("Connection Failed: Failed to connect the wallet. Please try again.");
        }
        setShowModalWallet(true);
      })
      .catch(err => {
        setError(String(err.message)); 
        setShowModalWallet(true);
      });
  };

  const closeModal = () => {
    setShowModalWallet(false);
    setMessage("");
    setError("");
  };

  return (
    <main className="container">
      <div className="jumbotron px-4 py-5">
        {address ? (
          <>
            <ConnectedWalletInfo
            address={address}
            copySuccess={copySuccess}
            setCopySuccess={setCopySuccess}
            message={message}
            />
            <div className="row flex-lg-row-reverse align-items-center py-5 g-5">
              <div className="col-10 col-sm-8 col-lg-6">
                <img
                  src="/images/image-1.jpg"
                  alt="Group of people on top of a mountain, helping each other during a climb, emphasizing teamwork and collaboration."
                  className="d-block mx-lg-auto img-fluid"
                  style={{ width: '100%', maxWidth: '400px', height: 'auto', objectFit: 'cover' }}
                />
              </div>
              <div className="col-lg-6">
                <h1 className="fs-5 lead lh-1 mb-2">CrowdCrypto&reg;</h1>
                <p className="lead fs-6 fst-italic mb-4">
                  Crowdfunding Reinvented for the Crypto Era.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="row flex-lg-row-reverse align-items-center py-5 g-5">
              <div className="col-10 col-sm-8 col-lg-6">
                <img
                  src="/images/image-1.jpg"
                  alt="Group of people on top of a mountain, helping each other during a climb, emphasizing teamwork and collaboration."
                  className="d-block mx-lg-auto img-fluid"
                  style={{ width: '100%', maxWidth: '400px', height: 'auto', objectFit: 'cover' }}
                />
              </div>
              <div className="col-lg-6">
                <h1 className="fs-5 lead lh-1 mb-2">CrowdCrypto&reg;</h1>
                <p className="lead fs-6 fst-italic mb-5">
                  Crowdfunding Reinvented for the Crypto Era.
                </p>
                <p className="mt-5 mb-4 fw-bolder fs-6">
                  Connect your wallet to start.
                </p>

                <IconsWallet />

                <div className="d-grid gap-2 d-md-flex justify-content-md-start mt-3">
                  <button
                    type="button"
                    className="col-12 btn btn-primary btn-lg py-2 fs-6"
                    onClick={btnConnectWallet}
                  >
                    Connect your wallet
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showModalWallet && (
        <ModalWallet
        message={message}
        error={error}
        closeModal={closeModal}
        address={address}  
        />
      )}
    </main>
  );
}