"use client";
import { createContext, useState } from 'react';

export const CampaignContext = createContext({});

export default function CampaignProvider({ children }) {
  const [campaign, setCampaign] = useState({}); 
  const [error, setError] = useState(null); 

  return (
    <CampaignContext.Provider value={{ campaign, setCampaign, error, setError }}>
      {children}
    </CampaignContext.Provider>
  );
};