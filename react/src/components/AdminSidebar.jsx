const AdminSidebar = ({ isOwner, walletConnected, saldoKontrak, handleTarikDana, setShowFormModal, handleResetKontrak, handleDisconnectWallet, loading }) => {
    if (!isOwner || !walletConnected) return null;
    return (
        <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg z-30 hidden lg:block">
            <div className="p-6">
                <h2 className="text-xl font-bold text-indigo-700 mt-2 mb-6">Admin Dashboard</h2>

                {/* Saldo */}
                <div className="mb-6">
                    <p className="text-gray-600 border-b-2 border-b-gray-200 pb-4">
                        Contract Balance: <br />
                        <span className="text-2xl font-bold text-indigo-700">{saldoKontrak} ETH</span>
                    </p>
                </div>

                {/* Aksi Dana */}
                <div className="space-y-3 mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Funds</h3>
                    <button
                        onClick={handleTarikDana}
                        className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 transition ${loading || saldoKontrak === "0" ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={loading || saldoKontrak === "0"}
                        title="Withdraw all funds from the contract"
                    >
                        Withdraw Funds
                    </button>
                </div>

                {/* Aksi Produk */}
                <div className="space-y-3 mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Product</h3>
                    <button
                        onClick={() => setShowFormModal(true)}
                        className="w-full bg-teal-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-teal-700 transition"
                        title="Add a new product"
                    >
                        Add Product
                    </button>
                    <button
                        onClick={handleResetKontrak}
                        className={`w-full bg-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-red-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={loading}
                        title="Reset contract to seeder data"
                    >
                        Reset Contract
                    </button>
                </div>

                {/* Wallet */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Wallet</h3>
                    <button
                        onClick={handleDisconnectWallet}
                        className="w-full bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-700 transition"
                        title="Disconnect your wallet"
                    >
                        Disconnect Wallet
                    </button>
                </div>
            </div>
        </aside>

    );
};

export default AdminSidebar;