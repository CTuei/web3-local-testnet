const ProductCard = ({ produk, handleBeli, loading, sudahBeli, isOwner, setFormProduk, setImagePreview, setShowFormModal }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition duration-300">
        <img
            src={produk.gambar}
            alt={produk.nama}
            className="w-full h-48 object-cover"
            onError={(e) => (e.target.src = "/assets/placeholder.jpg")}
        />
        <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{produk.nama}</h3>
            <p className="text-gray-600 line-clamp-2 mb-4">{produk.deskripsi}</p>
            <p className="text-gray-900 font-bold text-lg mb-4">{produk.harga} ETH</p>
            <div className="flex justify-between items-center gap-3">
                {produk.aktif ? (
                    <button
                        onClick={() => handleBeli(produk.id, produk.harga)}
                        className={`w-full bg-teal-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-teal-700 transition ${loading || sudahBeli[produk.id] ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={loading || sudahBeli[produk.id]}
                        title={sudahBeli[produk.id] ? "Product already purchased" : "Purchase this product"}
                    >
                        {sudahBeli[produk.id] ? "Purchased" : "Buy Now"}
                    </button>
                ) : (
                    <p className="text-red-600 font-medium">Product Inactive</p>
                )}
                {isOwner && (
                    <button
                        onClick={() => {
                            setFormProduk({
                                id: produk.id,
                                nama: produk.nama,
                                harga: produk.harga,
                                deskripsi: produk.deskripsi,
                                gambar: produk.gambar,
                            });
                            setImagePreview(produk.gambar);
                            setShowFormModal(true);
                        }}
                        className="w-full bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-700 transition"
                        title="Edit this product"
                    >
                        Edit
                    </button>
                )}
            </div>
        </div>
    </div>
);

export default ProductCard;