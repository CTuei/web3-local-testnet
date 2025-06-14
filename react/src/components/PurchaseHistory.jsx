const PurchaseHistory = ({ riwayatPembelian, expandedRiwayat, setExpandedRiwayat }) => (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 mb-12 lg:px-8" id="orders">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Purchase History</h2>
        {riwayatPembelian.length === 0 ? (
            <p className="text-gray-600 text-center text-lg">No purchases yet.</p>
        ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="space-y-4">
                    {riwayatPembelian.map((pembelian, index) => (
                        <div key={index} className="border-b py-4 last:border-b-0">
                            <div
                                className="flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition"
                                onClick={() => setExpandedRiwayat(expandedRiwayat === index ? null : index)}
                                role="button"
                                aria-expanded={expandedRiwayat === index}
                                aria-label={`Toggle purchase details for ${pembelian.namaProduk}`}
                            >
                                <div>
                                    <p className="font-semibold text-gray-800">{pembelian.namaProduk} (ID: {pembelian.produkId})</p>
                                    <p className="text-gray-600 text-sm">{pembelian.timestamp}</p>
                                </div>
                                <span className="text-blue-600 font-semibold flex items-center">
                                    Purchased
                                    <svg
                                        className={`ml-2 h-5 w-5 transform transition-transform ${expandedRiwayat === index ? "rotate-180" : ""}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </div>
                            {expandedRiwayat === index && (
                                <div className="mt-2 text-gray-600 p-4">
                                    <p><strong>Description:</strong> {pembelian.deskripsi}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}
    </section>
);

export default PurchaseHistory;