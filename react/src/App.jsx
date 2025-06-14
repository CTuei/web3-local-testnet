import { useEffect, useState, useCallback } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import contractData from "./contracts/contract-address.json";
import TokoDigital from "./contracts/TokoDigital.json";
import seederData from "./seeders/seeder.json";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import AdminSidebar from "./AdminSidebar";
import ProductCard from "./ProductCard";
import SkeletonProductCard from "./SkeletonProductCard";
import ProductForm from "./ProductForm";
import PurchaseHistory from "./PurchaseHistory";
import Footer from "./Footer";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.error("ErrorBoundary caught:", error, errorInfo);
      setHasError(true);
      setError(error);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="p-8 text-red-600 text-center bg-white rounded-2xl shadow-lg max-w-md mx-auto mt-20">
        <h2 className="text-3xl font-bold">Something Went Wrong</h2>
        <p className="mt-4">Please refresh the page or contact support.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>
    );
  }
  return children;
};

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [produkList, setProdukList] = useState([]);
  const [filteredProdukList, setFilteredProdukList] = useState([]);
  const [riwayatPembelian, setRiwayatPembelian] = useState([]);
  const [saldoKontrak, setSaldoKontrak] = useState("0");
  const [loading, setLoading] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [formProduk, setFormProduk] = useState({ nama: "", harga: "", deskripsi: "", id: null, gambar: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [sudahBeli, setSudahBeli] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRiwayat, setExpandedRiwayat] = useState(null);

  const contractAddress = contractData.address;
  const abi = TokoDigital.abi;

  const particlesInit = useCallback(async (main) => {
    try {
      await loadFull(main);
    } catch (e) {
      console.warn("Failed to initialize particles:", e);
    }
  }, []);

  const init = useCallback(async () => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask not detected!", { icon: "🚫" });
        return;
      }

      setLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);

      const toko = new Contract(contractAddress, abi, signer);
      const owner = await toko.getPemilik();
      setIsOwner(address.toLowerCase() === owner.toLowerCase());

      const produk = await toko.getSemuaProduk();
      const produkData = produk.map((p) => ({
        id: Number(p.id),
        nama: p.nama,
        harga: formatEther(p.harga),
        deskripsi: p.deskripsi,
        aktif: p.aktif,
        gambar: p.gambar || "/assets/placeholder.jpg",
      }));
      setProdukList(produkData);
      setFilteredProdukList(produkData);

      const sudahBeliData = {};
      for (const produk of produkData) {
        const status = await toko.cekStatusBeli(address, produk.id);
        sudahBeliData[produk.id] = status;
      }
      setSudahBeli(sudahBeliData);

      const riwayat = await toko.getRiwayatPembelian(address);
      setRiwayatPembelian(
        riwayat.map((r) => ({
          produkId: Number(r.produkId),
          timestamp: new Date(Number(r.timestamp) * 1000).toLocaleString("id-ID"),
          namaProduk: produkData.find((p) => p.id === Number(r.produkId))?.nama || "Unknown",
          deskripsi: produkData.find((p) => p.id === Number(r.produkId))?.deskripsi || "No description",
        }))
      );

      if (address.toLowerCase() === owner.toLowerCase()) {
        const saldo = await toko.getSaldoKontrak();
        setSaldoKontrak(formatEther(saldo));
      }
    } catch (error) {
      console.error("❌ Initialization failed:", error);
      toast.error("Failed to initialize: " + (error.message || "Unknown error"), { icon: "🚫" });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleConnectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected!", { icon: "🚫" });
      return;
    }

    try {
      setLoading(true);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletConnected(true);
      await init();
      toast.success("Wallet connected successfully!", { icon: "🔗" });
    } catch (error) {
      console.error("❌ Wallet connection failed:", error);
      toast.error("Failed to connect wallet: " + (error.message || "Unknown error"), { icon: "🚫" });
    } finally {
      setLoading(false);
    }
  }, [init]);

  const handleDisconnectWallet = useCallback(() => {
    setWalletConnected(false);
    setUserAddress("");
    setIsOwner(false);
    setProdukList([]);
    setFilteredProdukList([]);
    setRiwayatPembelian([]);
    setSudahBeli({});
    setSaldoKontrak("0");
    toast.success("Wallet disconnected successfully!", { icon: "🔌" });
    toast.info("To fully disconnect, please remove the account in MetaMask.", { icon: "ℹ️" });
  }, []);

  const handleBeli = useCallback(
    async (produkId, harga) => {
      try {
        setLoading(true);
        toast.info("Preparing transaction...", { icon: "⏳" });

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const toko = new Contract(contractAddress, abi, signer);

        const tx = await toko.beliProduk(produkId, { value: parseEther(harga) });
        toast.info(`Transaction sent: ${tx.hash.slice(0, 6)}...`, { icon: "📤" });

        await tx.wait();
        setShowParticles(true);
        toast.success("Purchase successful! 🎉", { icon: "✅" });
        setSudahBeli((prev) => ({ ...prev, [produkId]: true }));
        await init();
        setTimeout(() => setShowParticles(false), 3000);
      } catch (err) {
        console.error("❌ Transaction error:", err);
        toast.error(`Purchase failed: ${err.reason || err.message}`, { icon: "🚫" });
      } finally {
        setLoading(false);
      }
    },
    [init]
  );

  const handleTarikDana = useCallback(async () => {
    try {
      setLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const toko = new Contract(contractAddress, abi, signer);

      const tx = await toko.tarikDana();
      await tx.wait();
      toast.success("Funds withdrawn successfully!", { icon: "💸" });
      await init();
    } catch (err) {
      console.error("❌ Failed to withdraw funds:", err);
      toast.error(`Failed: ${err.reason || err.message}`, { icon: "🚫" });
    } finally {
      setLoading(false);
    }
  }, [init]);

  const handleResetKontrak = useCallback(async () => {
    if (!window.confirm("Are you sure you want to reset the contract? Changes will be reverted to the seeder data and purchase history will be cleared!")) {
      return;
    }

    try {
      setLoading(true);
      toast.info("Resetting contract...", { icon: "⏳" });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const toko = new Contract(contractAddress, abi, signer);

      const seededProduk = seederData.products.map((p, index) => ({
        id: index + 1,
        nama: p.nama,
        harga: parseEther(p.harga),
        deskripsi: p.deskripsi,
        aktif: true,
        gambar: p.gambar,
      }));

      const tx = await toko.resetContract(seededProduk);
      await tx.wait();
      toast.success(`Contract reset successfully: ${seededProduk.length} products restored!`, { icon: "🔄" });
      await init();
    } catch (err) {
      console.error("❌ Failed to reset contract:", err);
      toast.error(`Reset failed: ${err.reason || err.message}`, { icon: "🚫" });
    } finally {
      setLoading(false);
    }
  }, [init]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    const filtered = produkList.filter(
      (produk) =>
        produk.nama.toLowerCase().includes(query.toLowerCase()) ||
        produk.deskripsi.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProdukList(filtered);
  }, [produkList]);

  useEffect(() => {
    try {
      if (window.ethereum && window.ethereum.selectedAddress) {
        setWalletConnected(true);
        init();
      }
    } catch (e) {
      console.warn("Storage access error during useEffect:", e);
      toast.error("Failed to check wallet connection. Please connect manually.", { icon: "🚫" });
    }

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setWalletConnected(true);
        init();
      } else {
        handleDisconnectWallet();
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    }
  }, [init, handleDisconnectWallet]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 font-inter relative">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="flex flex-col items-center text-white">
              <svg className="animate-spin h-12 w-12 mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-lg font-semibold">Processing...</p>
            </div>
          </div>
        )}

        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            particles: {
              number: { value: 20 },
              color: { value: "#ffffff" },
              shape: { type: "circle" },
              opacity: { value: 0.1 },
              size: { value: 1, random: true },
              move: {
                enable: true,
                speed: 0.5,
                direction: "none",
                random: true,
                outModes: { default: "out" },
              },
            },
            interactivity: { events: {} },
            retina_detect: true,
          }}
          className="absolute inset-0 pointer-events-none"
        />

        <Header
          walletConnected={walletConnected}
          userAddress={userAddress}
          handleConnectWallet={handleConnectWallet}
          handleDisconnectWallet={handleDisconnectWallet}
        />

        <AdminSidebar
          isOwner={isOwner}
          walletConnected={walletConnected}
          saldoKontrak={saldoKontrak}
          handleTarikDana={handleTarikDana}
          setShowFormModal={() => setShowForm(true)}
          handleResetKontrak={handleResetKontrak}
          handleDisconnectWallet={handleDisconnectWallet}
          loading={loading}
        />

        <main className={`pt-16 ${isOwner && walletConnected ? "lg:ml-64" : ""} transition-all duration-300`}>
          {!walletConnected ? (
            <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-gray-100">
              <div className="text-center max-w-2xl px-4">
                <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to TokoCorp</h1>
                <p className="text-lg text-gray-600 mb-8">
                  Discover premium digital products powered by blockchain technology. Connect your wallet to start shopping.
                </p>
                <button
                  onClick={handleConnectWallet}
                  className="bg-blue-600 text-white py-4 px-10 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
                  title="Connect your wallet"
                >
                  Connect Wallet
                </button>
              </div>
            </section>
          ) : (
            <>
              <section className="py-20 bg-gradient-to-r from-blue-50 to-teal-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-5xl font-bold text-gray-900 mb-4">Premium Digital Marketplace</h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Explore our curated collection of digital products, secured by Ethereum blockchain.
                  </p>
                </div>
              </section>

              <section id="products" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {showForm && isOwner ? (
                  <ProductForm
                    formProduk={formProduk}
                    setFormProduk={setFormProduk}
                    formErrors={formErrors}
                    setFormErrors={setFormErrors}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    setShowForm={setShowForm}
                    loading={loading}
                    setLoading={setLoading}
                    init={init}
                  />
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-8 flex-col sm:flex-row gap-4">
                      <h2 className="text-3xl font-bold text-gray-800">Our Products</h2>
                      <div className="w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                          aria-label="Search products by name or description"
                        />
                      </div>
                    </div>
                    {filteredProdukList.length === 0 && !loading ? (
                      <p className="text-gray-600 text-center text-lg">No products found.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading
                          ? Array(6).fill().map((_, i) => <SkeletonProductCard key={i} />)
                          : filteredProdukList.map((produk) => (
                              <ProductCard
                                key={produk.id}
                                produk={produk}
                                handleBeli={handleBeli}
                                loading={loading}
                                sudahBeli={sudahBeli}
                                isOwner={isOwner}
                                setFormProduk={setFormProduk}
                                setImagePreview={setImagePreview}
                                setShowFormModal={() => setShowForm(true)}
                              />
                            ))}
                      </div>
                    )}
                  </>
                )}
              </section>

              <PurchaseHistory
                riwayatPembelian={riwayatPembelian}
                expandedRiwayat={expandedRiwayat}
                setExpandedRiwayat={setExpandedRiwayat}
              />
            </>
          )}
        </main>

        <Footer />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="light"
          toastClassName="bg-white shadow-lg rounded-lg p-4 flex items-center text-gray-800 font-semibold border border-gray-200"
          bodyClassName="flex items-center"
          progressClassName="bg-blue-600"
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;