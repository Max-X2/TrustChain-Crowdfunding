# Crowd Crypto

Crowd Crypto is a decentralized crowdfunding platform built on Ethereum, allowing users to create and support campaigns securely. This application facilitates the fundraising process through smart contracts, ensuring transparency and trust between authors and backers.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [License](#license)

## Features

- Create new crowdfunding campaigns.
- Donate to existing campaigns.
- View campaigns by author.
- Check the total fees collected.
- Withdraw funds from campaigns.

## Technologies

This project is built using:

- **Next.js** for server-side rendering and routing.
- **React** for building the user interface.
- **Web3.js** for interacting with Ethereum smart contracts.
- **Bootstrap** for responsive design.
- **dotenv-safe** for managing environment variables.

## Getting Started

To get started with the project, clone the repository and install the dependencies:

```
git clone https://github.com/Lucas-Lantimant/crowd-crypto.git 
```

```
cd crowd-crypto
```

```
npm install
```

## Environment Variables

Create a `.env` file in the root directory of the project and add the following variable:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=<your_contract_address_here>
```

Replace `<your_contract_address_here>` with your deployed smart contract address.

## Usage

To run the application in development mode, use the following command:

```
npm run dev
```

This will start the Next.js development server. You can access the application at [http://localhost:3000](http://localhost:3000).

## Scripts

- **dev:** Starts the Next.js development server.
- **build:** Compiles the application for production.
- **start:** Starts the production server.
- **lint:** Lints the project files.

## License

This project is licensed under the `MIT License` - see the LICENSE file for details.