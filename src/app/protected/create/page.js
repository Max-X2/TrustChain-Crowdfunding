"use client";

import { useContext, useState } from "react";
import { AddressContext } from "@/app/context/addressContext.js";
import { EthInput, MediaTypeSelectorInput } from "@/components/Inputs.js";
import { connectWallet, addCampaign, getLastCampaignId } from "@/services/Web3Service.js";
import Link from 'next/link';
import ConnectedWalletInfo from "@/components/ConnectedWalletInfo";
import RenderMessage from '@/components/RenderMessage';
import { ModalCreateAlert } from '@/components/Modals';

export default function Create() {
  const { address } = useContext(AddressContext);
  const [copySuccess, setCopySuccess] = useState(false);
  const [campaign, setCampaign] = useState({ mediaType: 'image', mediaUrl: '' });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [id, setId] = useState("");

  function onChangeInput(event) {
    const { id, value } = event.target;

    setCampaign(prevState => ({ ...prevState, [id]: value }));
  }



  function handleMediaTypeChange(event) {
    const value = event.target.value;
    setCampaign(prevState => ({
      ...prevState,
      mediaType: value,
      mediaUrl: ''
    }));
  }

  function handleEthChange(value) {
    if (/^\d*\.?\d{0,18}$/.test(value)) {
      setCampaign(prevState => ({ ...prevState, goal: value }));
    } else {
      console.error("Invalid ETH value");
    }
  }

  async function createBtnClick() {
    setMessage("Saving... Please wait.");
    setMessageType("loading");

    const updatedCampaign = { ...campaign };

    console.log("Campaign antes de enviar:", updatedCampaign);

    try {
        await connectWallet();
        await addCampaign(updatedCampaign);
        const campaignId = await getLastCampaignId();
        
        setId(campaignId);
        setMessage(`Campaign created successfully! Use ID <b>${campaignId}</b> to receive donations for your campaign.`);
        setAlertMessage("Donors can use the ID below to contribute to your campaign:");
        setMessageType("success");
        setAlertTitle("Successful!");
        setShowAlertModal(true);
    } catch (err) {
        console.error(err);
        setMessage(err.message);
        setMessageType("error");
    }
  }

  return (
    <main className="container">
      <div className="jumbotron px-4 py-5">
        {address ? (
          <>
            <ConnectedWalletInfo 
              address={address}
              copySuccess={copySuccess}
              setCopySuccess={setCopySuccess}
            />

            <div className="mb-3">
              <div className="col-lg-10">
                <h1 className="fs-5 lead lh-1 mb-2">CrowdCrypto&reg;</h1>
                <p className="lead fs-6 fst-italic mb-4">
                  Crowdfunding Reinvented for the Crypto Era.
                </p>
              </div>

              <p className="fs-6 fw-bolder mt-5">
                Please fill in the fields below to create a new campaign.
              </p>
              <hr className="mt-3" />

              <div className="col-6 mt-4">
                <h1 className="lead fs-6 mt-5">Title</h1>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    value={campaign.title || ''}
                    onChange={onChangeInput}
                  />
                  <label htmlFor="title">Title</label>
                </div>

                <h1 className="lead fs-6 mt-4">Description</h1>
                <div className="form-floating mb-3">
                  <textarea
                    id="description"
                    className="form-control"
                    value={campaign.description || ''}
                    onChange={onChangeInput}
                  />
                  <label htmlFor="description">Description</label>
                </div>

                <MediaTypeSelectorInput
                  mediaType={campaign.mediaType}
                  onChange={handleMediaTypeChange}
                  mediaUrl={campaign.mediaUrl}
                  onInputChange={onChangeInput}
                />

                <h1 className="lead fs-6">Goal</h1>
                <EthInput
                  value={campaign.goal || ''}
                  onChange={handleEthChange}
                />
                <p className="lead fs-6 fst-italic mt-2">Ex. 1.000000000000000000 ETH</p>
              </div>

              <div className="mt-4">
                <div className="col-6 mb-3">
                  <button className="btn btn-primary col-12 p-1 fs-6" onClick={createBtnClick}>
                    Create Campaign
                  </button>
                </div>

                <div className="col-6 mb-4">
                  <Link href="/" className="lead btn btn-secondary col-12 p-1 fs-6">
                    Back
                  </Link>
                </div>
              </div>
            </div>

            <RenderMessage 
              message={message}
              messageType={messageType}
              className="col-6 mb-5 fs-6"
            />

            {showAlertModal && id && (
              <ModalCreateAlert
                title={alertTitle}
                message={alertMessage}
                id={id}
                onClose={() => setShowAlertModal(false)}
              />
            )}
          </>
        ) : (
          <p className="text-center py-4">
            You need to connect your wallet to create a new campaign.
          </p>
        )}
      </div>
    </main>
  );
}