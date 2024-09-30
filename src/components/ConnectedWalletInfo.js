import CopyIcon from './CopyIcon';
import { generateAvatarURL } from '@cfx-kit/wallet-avatar';

export default function ConnectedWalletInfo({ address, copySuccess, setCopySuccess}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  return (
    <>
    <div className="connected-wallet-info py-4 col-7">
      <div className="details-container">
        <h1 className="lead fs-6">Connected Wallet Address:</h1>
        
        <div className="d-flex justify-content-center align-items-center text-center">
          <img
            src={generateAvatarURL(address)}
            width="28"
            height="27"
            className="rounded-circle"
            alt="Author Avatar"
          />
          <span className="address lead fs-6 ms-2">{address}</span>
          <button className="copy-button" onClick={handleCopy}>
            <CopyIcon className="copy-icon" />
          </button>
        </div>
        
      </div>
      {copySuccess && <div className="copy-success">Copied!</div>}
      
    </div>
    <hr className="mt-5" />
    </>
    
  );
};