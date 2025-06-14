# 🛍️ Web3 DApp

Aplikasi Web3 (Decentralized Application) sederhana yang memungkinkan pengguna membeli produk digital serta menggunakan Ethereum Virtual Machine (EVM) sebagai blockchain di jaringan lokal Hardhat.

## 🚧 Status Proyek: Dalam Tahap Pengembangan

Aplikasi ini masih dalam proses pengembangan.  
Harap maklum jika ada bug, fitur belum sempurna, atau tampilan berubah sewaktu-waktu.

> 💡 Silakan laporkan masalah atau beri saran melalui [Issues](https://github.com/Fruzh/web3-local-testnet/issues).

---

## 🖼️ Preview Website

| Landing Page | Dashboard |
|--------------|-----------|
| ![Landing](https://raw.githubusercontent.com/Fruzh/web3-local-testnet/refs/heads/master/react/src/assets/landing.png) | ![Dashboard](https://raw.githubusercontent.com/Fruzh/web3-local-testnet/refs/heads/master/react/src/assets/purchased.png) |

| Verifikasi Wallet | Edit Produk |
|-------------------|-------------|
| ![Verifikasi](https://raw.githubusercontent.com/Fruzh/web3-local-testnet/refs/heads/master/react/src/assets/verification.png) | ![Edit](https://raw.githubusercontent.com/Fruzh/web3-local-testnet/refs/heads/master/react/src/assets/edit.png) |

---

## 📁 Struktur Folder

```
project-root/
├── react/            # Frontend React (dApp)
└── solidity/         # Smart contract + script deploy
```

---

## 🚀 Fitur

- 🔐 Autentikasi via wallet (Metamask)
- 💸 Beli produk menggunakan Ethereum (ETH)
- 🔄 Reset contract (oleh pemilik contract)
- 📦 Smart contract sudah lengkap dengan ABI & auto-deploy address

---

## 🧰 Persyaratan

Pastikan sudah meng-install:

- [Node.js](https://nodejs.org/) v22 atau lebih
- [Metamask](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) di browser (Chrome/Brave/Edge)
- Git
- VS Code atau text editor lain

---

## 🔧 Cara Setup dari Awal

### 1. Clone Project

```bash
git clone https://github.com/Fruzh/web3-local-testnet.git
cd web3-local-testnet
```

### 2. 📦 Install Dependency
**Untuk smart contract (Hardhat) & frontend (React):**
```bash
npm run install
```

**Jika belum pernah install Hardhat di proyek ini:**
```bash
npm run install:hardhat
```

Ini akan menjalankan jaringan lokal di `http://127.0.0.1:8545` dan menampilkan 20 akun beserta private key-nya.

Contoh akun:

```
Account #0: 0x5Fb... (Private Key: 0xabc...)
```

---

## 3. 🦊 Hubungkan Metamask

1. **Install Extension Metamask** di [metamask.io](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
2. **Import Akun** dari terminal Hardhat:
   - Import akun dengan Private Key:
   **Account → Import Account**
   - Tempelkan salah satu Private Key dari Hardhat

3. **Tambahkan Network Lokal:**

   - Network Name: `Hardhat`
   - New RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

4. Pilih jaringan "Hardhat" di Metamask.

---

## 3. 📦 Deploy Smart Contract & Menjalankan Frontend (React DApp)

```bash
npm run start
```

Buka terminal baru:

```bash
npm run deploy
```

Ini akan:

- Deploy `TokoDigital.sol`
- Generate file `contract-address.json` dan `contract-abi.json`
- Simpan alamat contract ke: `react/src/contracts/contract-address.json`
- Simpan ABI ke:  `react/src/contracts/contract-abi.json`
- Aplikasi akan berjalan di `http://localhost:5173`

---

## 🛒 Cara Pakai Aplikasi

1. Buka `http://localhost:5173`
2. Klik **"Connect Wallet"**
3. Klik **"Buy Now"** untuk membeli produk
4. Jika kamu pemilik contract, tombol **Reset Pembelian** akan muncul