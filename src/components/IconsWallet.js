import React from "react";

const IconColumn = ({ icons }) => (
  <div className="col-2 p-4 d-flex flex-column align-items-center">
    {icons.map((icon, index) => (
      <img
        key={index}
        src={icon.src}
        alt={icon.alt}
        style={{
          width: icon.width,
          border: "none",
          marginTop: icon.marginTop || '0px',
          marginBottom: icon.marginBottom || "0px" 
        }}
      />
    ))}
  </div>
);

export default function IconsWallet() {
  const wallets = [
    {
      src: "https://lh3.googleusercontent.com/QW0gZ3yugzXDvTANa5-cc1EpabQ2MGnl6enW11O6kIerEaBQGOhgyUOvhRedndD9io8RJMmJZfIXq1rMxUsFHS2Ttw=s60",
      alt: "Metamask Wallet logo",
      width: "35px",
    },
    {
      src: "https://lh3.googleusercontent.com/HE43gZIKp76W3bCaCbPwiTf8uB__YpY8byc4dkb300gNQGDcAraTM4l1uiwfsjhre9rtsHGiok8d3TY11dirxvLq=s60",
      alt: "Coinbase Wallet logo",
      width: "45px",
      marginTop: "15px"
    },
    {
      src: "/icons/binance.svg",
      alt: "Binance Wallet logo",
      width: "35px",
    },
    {
      src: "https://lh3.googleusercontent.com/np4HOumdAD8htlHsTMiuJz_CyjcWhaG8BUG7WW_GJx7g3nb370MuBYEE8fZbG8bdsBiQZxiX_uJqutp2fn99C7X1uQI=s60",
      alt: "Trust Wallet logo",
      width: "44px",
      marginTop: "15px"
    },
    {
      src: "https://lh3.googleusercontent.com/dXvdD2VjLS-imsW8WG2oB3y7sBHhL9gFlv7KZnqZSA9_MU1VROSHRpJidav8-a77uQT1-8X_zK5ibsAC39IFn5tn=s60",
      alt: "Phantom Wallet logo",
      width: "37px"
    },
    {
      src: "https://lh3.googleusercontent.com/9GS6Mou3xZMaLbPd9O0Ao3N1y44mA3a5a9jxxmDDg7fMe6I80BQ3slda-yvsrgY_cZiDIc-0gCOsntTbJAuyNHLr=s60",
      alt: "Bravoos Wallet logo",
      width: "34.3px",
      marginTop: "18px"
    },
    {
      src: "/icons/uniswap.svg",
      alt: "Uniswap Wallet logo",
      width: "45px",
      marginTop: "-10px"
    },
    {
      src: "https://lh3.googleusercontent.com/vnBK5cIqGFfMnjjbFhLqPwDGvamvCSe79hjvXy3FEsR8z0thgdhpx6ouMdgBJYScMVurWgmGMkbsw28DIHIfXDFs=s60",
      alt: "Enkrypt Crypto Wallet logo",
      width: "40px",
      marginTop: '16px'
    },
    {
      src: "/icons/keplr.svg",
      alt: "Keplr Wallet logo",
      width: "35px",
    },
    {
      src: "https://812904053-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FV16jazlRl57seHanahS6%2Flogo%2FpdZQh7ufN423GCf4WSGF%2Fxdefi.svg?alt=media&amp;token=d6e9b55d-d504-4ddd-ab29-94c00ac2a7bd",
      alt: "XDEFI Wallet logo",
      width: "32px",
      marginTop: "21px"
    },
    {
      src: "/icons/brave.svg",
      alt: "Brave Wallet logo",
      width: "35px",
    },
    {
      src: "https://lh3.googleusercontent.com/-EANsHrMrwTYq1D865xPAuBcU9Qw60Q9Wl_wDVWVpjM5-NQZS0LQqgLsErPJ4XtCnJApuhLTckFPoepLNh_x_b9F2Dc=s60",
      alt: "Rabby Wallet logo",
      width: "35px",
      marginTop: "20.3px"
    },
  ];

  const columns = [];
  for (let i = 0; i < wallets.length; i += 2) {
    columns.push(wallets.slice(i, i + 2));
  }

  return (
    <div className="container col-12 justify-content-start">
      <div className="row d-flex flex-wrap justify-content-start">
        {columns.slice(0, 6).map((icons, index) => (
          <IconColumn key={index} icons={icons} />
        ))}
      </div>
    </div>
  );
};