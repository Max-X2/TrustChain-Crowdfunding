import React, { useRef } from 'react';

export const EthInput = ({ value, onChange }) => {
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (/^\d*\.?\d{0,18}$/.test(inputValue)) {
      onChange(inputValue); 
    }
  };

  return (
    <div className="form-floating">
      <input
        type="text" 
        id="goal"
        className="form-control"
        value={value}
        ref={inputRef}
        onChange={handleInputChange} 
      />
      <label htmlFor="ethInput">ETH Goal</label>
    </div>
  );
};

export const DonateInput = ({ onChange, value, onSubmit }) => {
  
    const handleInputChange = (e) => {
      const inputValue = e.target.value;
  

      if (/^\d*\.?\d{0,18}$/.test(inputValue)) {
        onChange(e); 
      }
    };
  
    return (
      <div className="col-12">
         <h1 className="lead fs-6 text-start">Donation Amount</h1>
         <div className="form-floating">
          <input
            type="text"
            className="form-control "
            value={value}
            onChange={handleInputChange} 
          />
          <label htmlFor="donateInput">Amount</label>
        </div>
        <button
          type="button"
          className="col-12 d-flex justify-content-center align-items-center mt-2 btn btn-primary fs-6 fw-bold py-1  "
          onClick={onSubmit}
        >
          Send
        </button>
      </div>
    );
};

export const MediaTypeSelectorInput = ({ mediaType, onChange, mediaUrl, onInputChange }) => {
  return (
    <div>
      <h1 className="lead fs-6 mt-4">Media Type</h1>
      <div>
        <label>
          <input
            type="radio"
            value="image"
            checked={mediaType === 'image'}
            onChange={onChange}
            className="me-1"
          />
          Image
        </label>
        <label className="ms-3">
          <input
            type="radio"
            value="video"
            checked={mediaType === 'video'}
            onChange={onChange}
            className="me-1"
          />
          Video
        </label>
      </div>

      <h1 className="lead fs-6 mt-4">{mediaType === 'image' ? 'Image URL' : 'Video URL'}</h1>
      <div className="form-floating mb-3">
        <input
          type="text"
          id="mediaUrl"
          className="form-control"
          value={mediaUrl || ''}
          onChange={onInputChange}
        />
        <label htmlFor="mediaUrl">{mediaType === 'image' ? 'Image URL' : 'Video URL'}</label>
      </div>
    </div>
  );
};