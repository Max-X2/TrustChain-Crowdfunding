"use client";

import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AddressContext } from '@/app/context/addressContext';
import { CampaignContext } from "@/app/context/campaignContext";
import { getCampaigns, getCampaign } from '@/services/Web3Service.js';
import ConnectedWalletInfo from "@/components/ConnectedWalletInfo";
import  CampaignExpandedCard  from '@/components/CampaignExpandedCard.js';
import Pagination from '@/components/Pagination.js';

export default function Donate() {
  const { address } = useContext(AddressContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { setCampaign, setError } = useContext(CampaignContext);
  const [campaign, setLocalCampaign] = useState({ id: '', title: '', description: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true);
      try {
        const { campaigns: fetchedCampaigns, totalPages: fetchedTotalPages } = await getCampaigns(currentPage);
        setCampaigns(fetchedCampaigns);
        setTotalPages(fetchedTotalPages);
      } catch (error) {
        console.error('Error loading campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const onChangeId = (evt) => {
    const newId = evt.target.value;
    setLocalCampaign({ ...campaign, id: newId });
  };

  const btnSearchClick = async () => {
    console.log('btnSearchClick called');

    if (campaign && campaign.id) {
      try {
        console.log('Searching campaign with ID:', campaign.id);
        setMessage('Fetching... Please wait');
        setLoading(true);

        const result = await getCampaign(campaign.id);
        console.log('Campaign fetched:', result);

        if (!result || result.id === '0') {
          throw new Error("Invalid campaign ID. Please check the link or try again.");
        }

        setLocalCampaign(result);
        setCampaign(result); 
        setError(null); 

        router.push(`/protected/campaign?id=${campaign.id}`); 
      } catch (err) {
          setError(err.message); 
          setLocalCampaign({ id: '', title: '', description: '' }); 
          setMessage(''); 

        router.push(`/protected/campaign?id=${campaign.id}/${err}`); 
      } finally {
         setLoading(false);
      }
    } else {
        setMessage('Campaign ID is not set');
    }
  };

  const handleCampaignButtonClick = async (campaignId) => {
    if (campaignId) {
      try {
        setMessage('Redirecting... Please wait');
        setLoading(true);

        const result = await getCampaign(campaignId);
        if (!result || result.id === '0') {
          throw new Error("Invalid campaign ID. Please check the campaign.");
        }

        setCampaign(result);
        setError(null);
        router.push(`/protected/campaign?id=${campaignId}`);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
        setMessage('');
      } finally {
        setLoading(false);
      }
    } else {
      setMessage('Campaign ID is missing.');
    }
  };  

  const getVisiblePages = () => {
    const visiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage < visiblePages - 1) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  };

  return (
    <main className="container">
      <div className="jumbotron py-3">
        {address ? (
          <>
            <ConnectedWalletInfo address={address} />
  
            <p className="fs-6 fw-bolder mt-5">Search for a campaign using ID.</p>
            <div className="col-4">
              <div className="input-group mb-3 justify-content-around">
                <input
                  type="text"
                  id="campaignId"
                  placeholder="Campaign ID"
                  className="form-control rounded"
                  onChange={onChangeId}
                  value={campaign.id}
                />
                <button
                  className="btn btn-primary p-2 px-2 ms-3 rounded"
                  onClick={btnSearchClick}
                >
                  Search
                </button>
              </div>
            </div>
  
            {loading ? (
              <p className="text-center py-5">Loading campaigns...</p>
            ) : (
              campaigns.length > 0 ? (
                <>
                  <p className="fs-6 fw-bolder mt-5 mb-4">Available Campaigns:</p>
  
                  {campaigns.map(campaign => (
                    <CampaignExpandedCard
                      key={campaign.id}
                      campaign={campaign}
                      onCampaignButtonClick={handleCampaignButtonClick}
                    />
                  ))}
  
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                    getVisiblePages={getVisiblePages}
                    message={message}
                    setError={setError}
                  />
                </>
              ) : (
                <p className="py-5 text-center">No campaigns found</p>
              )
            )}
          </>
        ) : (
          <p className="text-center py-4">
            Please connect your wallet to view and donate to campaigns.
          </p>
        )}
      </div>
    </main>
  );  
}