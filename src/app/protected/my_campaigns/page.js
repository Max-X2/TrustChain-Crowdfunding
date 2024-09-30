"use client";

import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AddressContext } from '@/app/context/addressContext';
import { CampaignContext } from "@/app/context/campaignContext";
import { getCampaign, getCampaignIdsByAuthor,  } from '@/services/Web3Service.js';
import ConnectedWalletInfo from "@/components/ConnectedWalletInfo";
import CampaignExpandedCard from '@/components/CampaignExpandedCard.js';
import Pagination from '@/components/Pagination.js';

export default function MyCampaigns() {
  const { address } = useContext(AddressContext); // Endereço do usuário autenticado
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [campaign, setLocalCampaign] = useState({ id: '', title: '', description: '' });
  const { setCampaign, setError } = useContext(CampaignContext);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadCampaignsByAuthor = async () => {
      if (!address) {
        console.error('Address not found');
        return;
      }
  
      setLoading(true);
      try {
        const fetchedCampaignIds = await getCampaignIdsByAuthor(address);
        if (!fetchedCampaignIds || fetchedCampaignIds.length === 0) {
          throw new Error('No campaigns found for this author.');
        }
  
        const fetchedCampaigns = await Promise.all(
          fetchedCampaignIds.map(id => getCampaign(id))
        );
  
        setCampaigns(fetchedCampaigns); 
        setTotalPages(Math.ceil(fetchedCampaigns.length / 5)); 
      } catch (error) {
        console.error('Error loading campaigns by author:', error);
      } finally {
        setLoading(false);
      }
    };
  
    loadCampaignsByAuthor();
  }, [address, currentPage]); 
  

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

    if (!address) {
      setMessage('Author address is not set');
      return;
    }

    try {
      console.log('Searching campaigns for author:', address);
      setMessage('Fetching... Please wait');
      setLoading(true);

      const authorCampaignIds = await getCampaignIdsByAuthor(address);
      if (!authorCampaignIds || authorCampaignIds.length === 0) {
        throw new Error('No campaigns found for this author.');
      }

      const enteredCampaignId = parseInt(campaign.id, 10);
      if (!authorCampaignIds.includes(enteredCampaignId)) {
        throw new Error(`Campaign ID ${campaign.id} does not belong to this author.`);
      }

      const result = await getCampaign(enteredCampaignId);
      console.log('Campaign fetched:', result);

      if (!result || result.id === '0') {
        throw new Error('Campaign not found.');
      }

      setCampaign(result);
      setError(null);
      router.push(`/protected/campaign?id=${enteredCampaignId}`);
    } catch (err) {
      console.error(err.message);
      setError(err.message);
      setMessage('');
      router.push(`/protected/campaign?id=${campaign.id}/${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignButtonClick = async (campaignId) => {
    if (campaignId) {
      try {
        setMessage('Redirecting... Please wait');
        setLoading(true);
  
        const authorCampaignIds = await getCampaignIdsByAuthor(address);
        if (!authorCampaignIds || authorCampaignIds.length === 0) {
          throw new Error('No campaigns found for this author.');
        }
  
        const enteredCampaignId = parseInt(campaignId, 10); 

        if (!authorCampaignIds.includes(enteredCampaignId)) {
          throw new Error("Invalid campaign ID. Please check the campaign.");
        }
  
        const result = await getCampaign(enteredCampaignId);
        if (!result || result.id === '0') {
          throw new Error("Campaign not found.");
        }
  
        setCampaign(result); 
        setError(null);
        router.push(`/protected/campaign?id=${enteredCampaignId}`);
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
  
            <p className="fs-6 fw-bolder mt-5">Search for your campaigns by address.</p>
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
                  <p className="fs-6 fw-bolder mt-5 mb-4">Your Campaigns:</p>
  
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
            Please connect your wallet to view and manage your campaigns.
          </p>
        )}
      </div>
    </main>
  );  
}