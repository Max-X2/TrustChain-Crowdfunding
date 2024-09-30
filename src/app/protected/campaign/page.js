"use client"; 

import { useContext, useEffect, useState } from 'react';
import { CampaignContext } from "@/app/context/campaignContext";
import ConnectedWalletInfo from "@/components/ConnectedWalletInfo";
import { donate, withdraw } from "@/services/Web3Service.js";
import { AddressContext } from '@/app/context/addressContext';
import { generateAvatarURL } from '@cfx-kit/wallet-avatar';
import { DonateInput } from '@/components/Inputs.js';
import  RenderMessage from '@/components/RenderMessage';
import { ModalAlert, ModalConfirm } from '@/components/Modals';
import FeesManager from "@/components/FeesManager";

export default function Campaign() {
    const { campaign, error } = useContext(CampaignContext);
    const { address } = useContext(AddressContext);
    const [copySuccess, setCopySuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showInput, setShowInput] = useState(false);
    const [messageType, setMessageType] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (!campaign) {
            setLoading(false);
            return;
        }

        setLoading(false); 
    }, [campaign]);

    if (loading) {
        return (
            address ? (
                <main className="container col-5 p-5 my-5 justify-content-center align-items-center text-center">
                    <div className="jumbotron alert alert-info text-center fw-bold">
                        Loading...
                    </div>
                </main>
            ) : (
                <p className="text-center py-4">
                    You need to connect your wallet to participate in this campaign.
                </p>
            )
        );
    }
    

    if (error) {
        return (
            address ? (
                <main className="container d-flex p-5 my-5 justify-content-center align-items-center text-center">
                    <div className="jumbotron alert alert-danger text-center">
                        {error}
                    </div>
                </main>
            ) : (
                <p>You need to connect your wallet to participate in this campaign.</p>
            )
        );
    }

    function formatBigInt(value) {
        if (typeof value === 'bigint') {
            return Number(value).toFixed(18);
        }
        return value;
    }

    const handleWithdraw = () => {
        const campaignWithdraw = campaign.id;
        const campaignBalance = campaignWithdraw.balance;
        setAmount(campaignBalance);
        withdraw(campaignWithdraw)
            .then(() => {
                setAlertTitle("Successful!");
                setAlertMessage("Order successfully closed! It will be available in your registered wallet in a few minutes.");
                setShowAlertModal(true);
            })
            .catch((err) => {
                setAlertTitle("Error");
                setAlertMessage(err.message);
                setShowAlertModal(true);
            });
    };

    const btnCloseClick = () => {
        setShowConfirmModal(true);
        setAlertTitle("Close campaign");
        setAlertMessage("Are you sure you want to close this order?");
    };

    const handleConfirm = () => {
        setShowConfirmModal(false);
        handleWithdraw();
    };

    const btnHelpClick = () => {
        setShowInput(true);
    };

    const handleDonationChange = (event) => {
        if (event && event.target) {
            const { value } = event.target;
            if (/^\d*\.?\d{0,18}$/.test(value)) {
                setAmount(value);
            }
        }
    };

    const handleDonationSubmit = () => {
        setAlertMessage("Sending... Please wait.");
        setMessageType("loading");

        donate(campaign.id, amount)
            .then(() => {
                setAlertTitle("Successful!");
                setAlertMessage("Donation successful!");
                setMessageType("success");
                setShowAlertModal(true);
            })
            .catch(err => {
                if (err.message.includes("MetaMask Tx Signature: User denied transaction signature")) {
                    setAlertMessage("Donation was canceled. Please try again.");
                    setMessageType("error");
                } else {
                    setAlertMessage("An unexpected error occurred. Please try again.");
                    setMessageType("error");
                }
                console.error(err);
            });
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
                        />
                        <div className="row flex-lg-row-reverse g-5 mt-2 align-items-center justify-content-center">
                            <div className="mb-5 py-4 card-container d-flex flex-column align-items-center justify-content-center">
                                <div className="p-3 text-center">
                                    <div className="responsive-media">
                                        {campaign.mediaType === 'video' && campaign.mediaUrl ? (
                                            <iframe
                                                src={campaign.mediaUrl.includes('embed/') ? campaign.mediaUrl : campaign.mediaUrl.replace('watch?v=', 'embed/')}
                                                title="Video"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <img
                                                src={campaign.mediaUrl}
                                                className="d-block mx-auto img-fluid"
                                                alt="Campaign Media"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="list-group-item list-group-item-action d-flex flex-column gap-3 py-3">
                                    <div className="custom-container">
                                        <div className="content-wrap">
                                            <h2 className="fs-4 fw-bold mb-0">
                                                {campaign.title || "Campaign Title Unavailable"}
                                            </h2>

                                            <p className="mb-0">
                                                <span className="fs-6 fw-bold">Author &rsaquo;&rsaquo;</span>
                                                <img
                                                    src={generateAvatarURL(campaign.author)}
                                                    width="28"
                                                    height="27"
                                                    className="rounded-circle ms-2"
                                                    alt="Author Avatar"
                                                />
                                                <span className="ms-0">
                                                    {campaign.author}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <p className="opacity-75 justify-text">{campaign.description || "No description available."}</p>

                                    <div className="d-flex justify-content-between mt-auto w-100 py-2">
                                        <div>
                                            <span className="me-1 opacity-75">Balance:</span>
                                            <span className="opacity-50">
                                                {campaign.balance
                                                    ? `${formatBigInt(campaign.balance)} ETH raised from ${formatBigInt(campaign.goal)} ETH`
                                                    : `${formatBigInt(campaign.goal)} ETH`}
                                            </span>
                                        </div>

                                        <div className="text-end">
                                            {typeof window !== "undefined" && localStorage.getItem("wallet") === campaign.author ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-md px-4 py-2 fs-6 fw-bold"
                                                        onClick={btnCloseClick}
                                                    >
                                                        Close
                                                    </button>

                                                    <FeesManager />
                                                </>
                                            ) : (
                                                <>
                                                    {!showInput && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-success btn-sm px-3 py-2 fs-6 fw-bold"
                                                            onClick={btnHelpClick}
                                                        >
                                                            &#36; Donate
                                                        </button>
                                                    )}

                                                    {showInput && (
                                                        <DonateInput
                                                            value={amount}
                                                            onChange={handleDonationChange}
                                                            onSubmit={handleDonationSubmit}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <RenderMessage 
                                    message={alertMessage}
                                    messageType={messageType}
                                    className="col-6 mb-5 fs-6"
                                />

                                {showConfirmModal && (
                                    <ModalConfirm
                                        title={alertTitle}
                                        message={alertMessage}
                                        onConfirm={handleConfirm}
                                        onCancel={() => setShowConfirmModal(false)}
                                    />
                                )}

                                {showAlertModal && (
                                    <ModalAlert
                                        title={alertTitle}
                                        message={alertMessage}
                                        onClose={() => setShowAlertModal(false)}
                                    />
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <p>You need to connect your wallet to participate in this campaign.</p>
                )}
            </div>
        </main>
    );
}