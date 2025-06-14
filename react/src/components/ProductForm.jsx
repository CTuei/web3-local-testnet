import { useCallback } from "react";
import { toast } from "react-toastify";
import { BrowserProvider, Contract, parseEther } from "ethers";
import contractData from "../contracts/contract-address.json";
import TokoDigital from "../contracts/TokoDigital.json";

const ProductForm = ({
    formProduk,
    setFormProduk,
    formErrors,
    setFormErrors,
    imagePreview,
    setImagePreview,
    setShowForm,
    loading,
    init,
}) => {
    const contractAddress = contractData.address;
    const abi = TokoDigital.abi;

    const validateForm = useCallback((form) => {
        const errors = {};
        if (!form.nama.trim()) errors.nama = "Product name is required";
        if (!form.harga || parseFloat(form.harga) <= 0) errors.harga = "Price must be greater than 0 ETH";
        if (!form.deskripsi.trim()) errors.deskripsi = "Description is required";
        if (!form.gambar.trim() && form.id === null) errors.gambar = "Image URL is required for new products";
        else if (form.gambar && !/\.(jpg|jpeg|png|gif)$/i.test(form.gambar)) {
            errors.gambar = "URL must point to an image (jpg, jpeg, png, gif)";
        }
        return errors;
    }, []);

    const handleTambahProduk = useCallback(async () => {
        const errors = validateForm(formProduk);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            toast.error("Please check the invalid fields!", { icon: "🚫" });
            return;
        }

        try {
            setLoading(true);
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const toko = new Contract(contractAddress, abi, signer);

            const tx = await toko.tambahProduk(
                formProduk.nama,
                parseEther(formProduk.harga),
                formProduk.deskripsi,
                formProduk.gambar
            );
            await tx.wait();
            toast.success("Product added successfully!", { icon: "✅" });
            setFormProduk({ nama: "", harga: "", deskripsi: "", id: null, gambar: "" });
            setImagePreview(null);
            setFormErrors({});
            setShowForm(false);
            await init();
        } catch (err) {
            console.error("❌ Failed to add product:", err);
            toast.error(`Failed: ${err.reason || err.message}`, { icon: "🚫" });
        } finally {
            setLoading(false);
        }
    }, [formProduk, setFormErrors, setFormProduk, setImagePreview, setShowForm, init]);

    const handleUpdateProduk = useCallback(async () => {
        const errors = validateForm({ ...formProduk, gambar: formProduk.gambar || "optional" });
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            toast.error("Please check the invalid fields!", { icon: "🚫" });
            return;
        }

        try {
            setLoading(true);
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const toko = new Contract(contractAddress, abi, signer);

            const tx = await toko.updateProduk(
                formProduk.id,
                formProduk.nama,
                parseEther(formProduk.harga),
                formProduk.deskripsi,
                true,
                formProduk.gambar || ""
            );
            await tx.wait();
            toast.success("Product updated successfully!", { icon: "✅" });
            setFormProduk({ nama: "", harga: "", deskripsi: "", id: null, gambar: "" });
            setImagePreview(null);
            setFormErrors({});
            setShowForm(false);
            await init();
        } catch (err) {
            console.error("❌ Failed to update product:", err);
            toast.error(`Failed: ${err.reason || err.message}`, { icon: "🚫" });
        } finally {
            setLoading(false);
        }
    }, [formProduk, setFormErrors, setFormProduk, setImagePreview, setShowForm, init]);

    return (
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                    {formProduk.id !== null ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                    onClick={() => {
                        setFormProduk({ nama: "", harga: "", deskripsi: "", id: null, gambar: "" });
                        setImagePreview(null);
                        setFormErrors({});
                        setShowForm(false);
                    }}
                    className="text-gray-600 hover:bg-gray-200 rounded-full p-2 transition"
                    title="Close"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="nama">Product Name</label>
                            <input
                                id="nama"
                                type="text"
                                placeholder="Enter product name"
                                value={formProduk.nama}
                                onChange={(e) => setFormProduk({ ...formProduk, nama: e.target.value })}
                                className={`w-full p-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${formErrors.nama ? "ring-2 ring-red-500" : ""
                                    }`}
                                aria-invalid={!!formErrors.nama}
                                aria-describedby={formErrors.nama ? "nama-error" : undefined}
                            />
                            {formErrors.nama && <p id="nama-error" className="text-red-500 text-sm mt-1">{formErrors.nama}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="harga">Price (ETH)</label>
                            <input
                                id="harga"
                                type="number"
                                step="0.0001"
                                placeholder="Enter price"
                                value={formProduk.harga}
                                onChange={(e) => setFormProduk({ ...formProduk, harga: e.target.value })}
                                className={`w-full p-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${formErrors.harga ? "ring-2 ring-red-500" : ""
                                    }`}
                                aria-invalid={!!formErrors.harga}
                                aria-describedby={formErrors.harga ? "harga-error" : undefined}
                            />
                            {formErrors.harga && <p id="harga-error" className="text-red-500 text-sm mt-1">{formErrors.harga}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="deskripsi">Description</label>
                            <textarea
                                id="deskripsi"
                                placeholder="Enter product description"
                                value={formProduk.deskripsi}
                                onChange={(e) => setFormProduk({ ...formProduk, deskripsi: e.target.value })}
                                className={`w-full p-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] max-h-[300px] transition duration-200 ${formErrors.deskripsi ? "ring-2 ring-red-500" : ""
                                    }`}
                                rows="4"
                                aria-invalid={!!formErrors.deskripsi}
                                aria-describedby={formErrors.deskripsi ? "deskripsi-error" : undefined}
                            />
                            {formErrors.deskripsi && <p id="deskripsi-error" className="text-red-500 text-sm mt-1">{formErrors.deskripsi}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="gambar">Product Image URL</label>
                        <input
                            id="gambar"
                            type="text"
                            placeholder="Enter image URL (jpg, jpeg, png, gif)"
                            value={formProduk.gambar}
                            onChange={(e) => {
                                const url = e.target.value;
                                setFormProduk({ ...formProduk, gambar: url });
                                setImagePreview(url || null);
                            }}
                            className={`w-full p-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${formErrors.gambar ? "ring-2 ring-red-500" : ""
                                }`}
                            aria-invalid={!!formErrors.gambar}
                            aria-describedby={formErrors.gambar ? "gambar-error" : undefined}
                        />
                        {formErrors.gambar && <p id="gambar-error" className="text-red-500 text-sm mt-1">{formErrors.gambar}</p>}
                        {imagePreview && (
                            <div className="mt-4">
                                <p className="text-gray-600 text-sm mb-2">Image Preview:</p>
                                <img
                                    src={imagePreview}
                                    className="w-75 h-45 object-cover rounded-xl border border-gray-200"
                                    onError={(e) => (e.target.src = "/assets/placeholder.jpg")}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-between items-center w-full">
                    <button
                        onClick={() => {
                            setFormProduk({ nama: "", harga: "", deskripsi: "", id: null, gambar: "" });
                            setImagePreview(null);
                            setFormErrors({});
                            setShowForm(false);
                        }}
                        className="bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-400 transition duration-200"
                        title="Cancel changes"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={formProduk.id !== null ? handleUpdateProduk : handleTambahProduk}
                        className={`bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={loading}
                        title={formProduk.id !== null ? "Update product" : "Add new product"}
                    >
                        {formProduk.id !== null ? "Update" : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;