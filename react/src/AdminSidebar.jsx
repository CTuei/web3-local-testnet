const AdminSidebar = ({ isOwner, walletConnected, saldoKontrak, handleTarikDana, setShowFormModal, handleResetKontrak, handleDisconnectWallet, loading }) => {
    if (!isOwner || !walletConnected) return null;
    return (
        <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg z-30 hidden lg:block">
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Contract Balance: <span className="font-semibold text-blue-600">{saldoKontrak} ETH</span>
                    </p>
                    <button
                        onClick={handleTarikDana}
                        className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition ${loading || saldoKontrak === "0" ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={loading || saldoKontrak === "0"}
                        title="Withdraw all funds from the contract"
                    >
                        Withdraw Funds
                    </button>
                    <button
                        onClick={() => setShowFormModal(true)}
                        className="w-full bg-amber-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-600 transition"
                        title="Add a new product"
                    >
                        Add Product
                    </button>
                    <button
                        onClick={handleResetKontrak}
                        className={`w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={loading}
                        title="Reset contract to seeder data"
                    >
                        Reset Contract
                    </button>
                    <button
                        onClick={handleDisconnectWallet}
                        className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition"
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