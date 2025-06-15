# 🛍️ Web3 DApp Marketplace

A simple Web3 DApp (Decentralized Application) that allows users to purchase digital products using the Ethereum Virtual Machine (EVM) on a local Hardhat network.

## 🚧 Project Status: In Development

This project is still under active development.\
Please expect bugs, incomplete features, or UI changes.

> 💡 Feel free to report issues or suggest features via [Issues](https://github.com/Fruzh/web3-local-testnet/issues).

---

## 🖼️ Website Preview

**Landing Page**
![Landing](https://raw.githubusercontent.com/Fruzh/web3-local-testnet/refs/heads/master/react/src/assets/landing.png) 

**Dashboard**
![Dashboard](https://raw.githubusercontent.com/Fruzh/web3-local-testnet/refs/heads/master/react/src/assets/purchased.png)

**Edit Product**
![Edit](https://raw.githubusercontent.com/Fruzh/web3-local-testnet/refs/heads/master/react/src/assets/edit.png)

**Transaction**
![Verifikasi](https://raw.githubusercontent.com/Fruzh/web3-local-testnet/refs/heads/master/react/src/assets/verification.png)

**Purchase History**
![Edit](https://raw.githubusercontent.com/Fruzh/web3-local-testnet/refs/heads/master/react/src/assets/purchase_history.png)

---

## 📁 Project Structure

```
project-root/
├── react/            # Frontend (React dApp)
└── solidity/         # Smart contracts & deployment scripts
```

---

## 🚀 Features

- 🔐 Authenticate via wallet (Metamask)
- 💸 Purchase products using Ethereum (ETH)
- 🔄 Reset purchases (admin only)
- 📦 Smart contract includes ABI & auto-generated address

---

## 🧰 Requirements

Make sure you have:

- [Node.js](https://nodejs.org/) v22+
- [Metamask Extension](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
- Git
- VS Code or other text editor

---

## 🔧 Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/Fruzh/web3-local-testnet.git
cd web3-local-testnet
```

### 2. 📦 Install Dependencies

**Install for both Hardhat (backend) & React (frontend):**

```bash
npm run install
```

**If Hardhat hasn’t been installed yet in this project:**

```bash
npm run install:hardhat
```

This will start a local blockchain at `http://127.0.0.1:8545` with 20 demo accounts.

Example account:

```
Account #0: 0x5Fb... (Private Key: 0xabc...)
```

### 3. 🦊 Connect Metamask

1. **Install Metamask Extension** from [metamask.io](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)

2. **Import an Account** from Hardhat output:

   - Click "Import Account"
   - Paste one of the private keys shown in your terminal

3. **Add Local Network:**

   - Network Name: `Hardhat`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Symbol: `ETH`

4. Select the "Hardhat" network in Metamask.

### 4. 📦 Deploy Contracts & Run the dApp

```bash
npm run start
```

In a new terminal:

```bash
npm run deploy
```

This will:

- Deploy `TokoDigital.sol`
- Generate:
  - `contract-address.json`
  - `contract-abi.json`
- Store them in `react/src/contracts/`
- Start the frontend on `http://localhost:5173`

---

## 🛒 How to Use

1. Open `http://localhost:5173`
2. Click **"Connect Wallet"**
3. Click **"Buy Now"** to purchase a product
4. If you are the contract owner, a **Reset Purchases** button will appear