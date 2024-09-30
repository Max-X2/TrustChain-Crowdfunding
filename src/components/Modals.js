import React, { useState } from "react";
import CopyIcon from "./CopyIcon"; 

export const ModalCreateAlert = ({ title, message, id, onClose }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>

        <div className="modal-body">
          <div className="message-content">{message}</div>

          <div className="address-container">
            <span className="address-content fs-5 fw-bolder">
              {String(id)}
            </span>
            <button className="copy-button btn btn-outline-primary" title="Copy ID">
              <CopyIcon valueToCopy={id} setCopySuccess={setCopySuccess} />
            </button>
          </div>
        </div>

        {copySuccess && <p className="copy-success text-success mt-2">Copied!</p>}
      </div>
    </div>
  );
};

export const ModalAlert = ({ title, message, value, onClose }) => {

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>

        <div className="modal-body">
          <div className="message-content">{message}</div>

          <div className="address-container">
            <span className="address-content fs-6 fst-italic lead">
              Value: {String(value)} <strong className="ms-1">ETH</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


export const ModalConfirm = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="p-3 fs-5">{title}</h2>
          <button onClick={onCancel} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          <div className="message-content">{message}</div>
        </div>
        <div className="modal-footer d-flex mt-3 gap-3 justify-content-center align-items-center">
          <button onClick={onConfirm} className="btn btn-primary fw-bolder px-3 py-1">Confirm</button>
          <button onClick={onCancel} className="btn btn-danger lead py-1">Cancel</button>
        </div>
      </div>
    </div>
  );
};


export const ModalWallet = ({ message, error, address, closeModal }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{error ? "Error" : "Message"}</h2>
          <button onClick={closeModal} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          {message && <div className="message-content">{message}</div>}
          {error && <div className="error-content">{error}</div>}
          {address && (
            <div className="address-container">
              <span className="address-content">{address}</span>
              <button className="copy-button">
                <CopyIcon 
                valueToCopy={address}
                setCopySuccess={setCopySuccess}
                />
              </button>
            </div>
          )}
        </div>
        {copySuccess && <p className="copy-success">Copied!</p>}
      </div>
    </div>
  );
};