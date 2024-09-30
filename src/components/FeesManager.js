import React, { useState, useEffect } from 'react';
import { getTotalFeesCollected, withdrawFees } from '@/services/Web3Service'; 

export default function FeesManager() {
    const [totalFees, setTotalFees] = useState('0'); 
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        async function fetchFees() {
            try {
                const fees = await getTotalFeesCollected();
                setTotalFees(fees);
            } catch (error) {
                console.error('Error fetching fees:', error);
            }
        }

        fetchFees();
    }, []);

    const handleWithdrawAllFees = async () => {
        if (parseFloat(totalFees) <= 0) {
            alert('No fees available to withdraw.');
            return;
        }

        setLoading(true);

        try {
            await withdrawFees(totalFees); 
            alert(`Successfully withdrew ${totalFees} ETH`);

            setTotalFees('0');
        } catch (error) {
            console.error('Error withdrawing fees:', error);
            alert('Withdrawal failed. Make sure you are the owner and have enough fees.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-3">
            <h3>Total Fees Collected: {totalFees} ETH</h3>

            <button onClick={handleWithdrawAllFees} disabled={loading || totalFees === '0'}>
                {loading ? 'Processing...' : 'Withdraw All Fees'}
            </button>
        </div>
    );
};