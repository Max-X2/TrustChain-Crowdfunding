import React, { useState } from 'react';
import { generateAvatarURL } from '@cfx-kit/wallet-avatar';

export default function CampaignExpandedCard({ campaign, onCampaignButtonClick }) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`campaign-card ${expanded ? 'expanded' : ''} mb-5 px-5`}>
      <button onClick={() => onCampaignButtonClick(campaign.id)} className="w-100">
        <div className="col-12">
          <h3 className="text-center">{campaign.title}</h3>
        </div>

      
        <p className="mb-3 mt-3 d-flex align-items-center">
          <span className="me-2 fw-bold fs-6">Author &rsaquo;&rsaquo;</span>
          <img
            src={generateAvatarURL(campaign.author)}
            width="25"
            height="24"
            className="rounded-circle me-2"
            alt="Author Avatar"
          />
          <span>{campaign.author}</span>
        </p>

        <p className="text-justify">
          {expanded ? campaign.description : campaign.description.slice(0, 100) + '...'}
        </p>

        {expanded && (
          <>
            <p className="lead fs-6 mt-3 mb-1">Goal: {campaign.goal} ETH</p>
            <p className="lead fs-6">Balance: {campaign.balance} ETH</p>
          </>
        )}
      </button>

      <div className="button-card text-center mt-3"> 
        <button
          className="lead text-primary"
          onClick={handleToggle}
          style={{ fontSize: "15px" }}
        >
          {expanded ? 'read less' : 'read more'}
        </button>
      </div>
    </div>
  );
};