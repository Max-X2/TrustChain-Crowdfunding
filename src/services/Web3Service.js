import Web3 from 'web3';
import ABI from './ABI.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
let web3;

export async function connectWallet() {
    if (window.ethereum) {
        const provider = window.ethereum;

        try {
            await provider.request({ method: 'eth_requestAccounts' });

            web3 = new Web3(provider);
            const accounts = await web3.eth.getAccounts();

            if (accounts && accounts.length) {
                localStorage.setItem('wallet', accounts[0]);
                return { account: String(accounts[0]) };
            } else {
                throw new Error('No accounts found');
            }
        } catch (error) {
            throw new Error('Connection rejected by the user or no accounts found');
        }
    } else {
        throw new Error('No Ethereum wallet found. Please install a Web3 wallet like Metamask.');
    }
}


export function getContract() {
    if (!web3) {
        throw new Error("Web3 is not initialized. Please connect to a wallet first.");
    }

    const from = localStorage.getItem("wallet");
    return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from });
}


export async function addCampaign(campaign) {
    const contract = getContract();

    if (!campaign.goal || isNaN(campaign.goal)) {
        throw new Error("Invalid value for the campaign goal.");
    }

    const goalInWei = web3.utils.toWei(campaign.goal.toString(), 'ether');

    return contract.methods.addCampaign(
        campaign.title,
        campaign.description,
        campaign.mediaUrl || "",  
        campaign.mediaType || "",  
        goalInWei
    ).send();
}


export async function getLastCampaignId() {
    const contract = getContract();
    const nextId = await contract.methods.nextId().call();
    return parseInt(nextId, 10); 
}


export async function getCampaigns(page) {
    const pageSize = 5;
    const totalCampaigns = await getLastCampaignId(); 
    const totalPages = Math.ceil(totalCampaigns / pageSize);
    const start = (page - 1) * pageSize;

    const campaigns = [];
    
    for (let i = start + 1; i < start + pageSize + 1 && i <= totalCampaigns; i++) {
        try {
            const campaign = await getCampaign(i); 
            
            campaigns.push(campaign); 
        } catch (error) {
            console.error(`Error fetching campaign ID ${i}:`, error);
        }
    }

    return { campaigns, totalPages };
}


export async function getCampaign(id) {
    const contract = getContract();

    try {
        const campaign = await contract.methods.campaigns(id).call();

        if (!campaign || !campaign.author || campaign.author === '0x0000000000000000000000000000000000000000') {
            throw new Error("Campaign not found.");
        }

        const goal = web3.utils.fromWei(campaign.goal.toString(), 'ether');
        const balance = web3.utils.fromWei(campaign.balance.toString(), 'ether');

        return {
            id, 
            ...campaign,
            goal,
            balance
        };
    } catch (error) {
        console.error('Error fetching campaign:', error);
        throw new Error("Invalid campaign ID. Please check the ID or try again.");
    }
}


export async function donate(id, eth) {
    const contract = getContract();

    const ethInWei = web3.utils.toWei(eth.toString(), 'ether');

    return contract.methods.donate(id).send({
        value: ethInWei
    });
}


export async function withdraw(id) {
    const contract = getContract();
    return contract.methods.withdraw(id).send();
}


export async function getTotalFeesCollected() {
    const contract = getContract();
    const totalFeesCollectedInWei = await contract.methods.totalFeesCollected().call();
    const totalFeesCollectedInEth = web3.utils.fromWei(totalFeesCollectedInWei, 'ether');

    return totalFeesCollectedInEth;
}


export async function withdrawFees(amount) {
    const contract = getContract();
    const amountInWei = web3.utils.toWei(amount.toString(), 'ether');

    return contract.methods.withdrawFees(amountInWei).send();
}


export async function getCampaignsByAuthor(authorAddress, page = 1) {
    const pageSize = 5; 
    const contract = getContract(); 
    const campaigns = [];
    
    try {
        const totalCampaigns = await contract.methods.nextId().call(); 
        const totalPages = Math.ceil(totalCampaigns / pageSize); 
        const start = (page - 1) * pageSize + 1;
        const end = Math.min(start + pageSize - 1, totalCampaigns); 

        for (let i = start; i <= end; i++) {
            const campaign = await contract.methods.campaigns(i).call(); 

            if (campaign.author.toLowerCase() === authorAddress.toLowerCase()) {
                campaigns.push(campaign);
            }
        }

        return {
            campaigns, 
            totalPages
        };
        
    } catch (error) {
        console.error('Error fetching campaigns by author:', error);
        throw new Error('Could not retrieve campaigns for this author.');
    }
}


export async function getCampaignIdsByAuthor(authorAddress) {
    const contract = getContract(); 
    const campaignIds = [];

    try {
        const totalCampaigns = await contract.methods.nextId().call();

        for (let id = 1; id <= totalCampaigns; id++) {
            const campaign = await contract.methods.campaigns(id).call(); 

            if (campaign.author.toLowerCase() === authorAddress.toLowerCase()) {
                campaignIds.push(id); 
            }
        }

        return campaignIds; 
    } catch (error) {
        console.error('Error fetching campaign IDs by author:', error);
        throw new Error('Could not retrieve campaign IDs.');
    }
}