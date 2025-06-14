import { useCallback } from "react";
import logo from "../assets/logo-indigo.png";

const Header = ({ walletConnected, userAddress, handleConnectWallet, handleDisconnectWallet }) => (
    <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
                <img src={logo} alt="TokoCorp Logo" className="h-10 w-auto" />
            </div>
            <nav className="hidden md:flex space-x-8">
                {[
                    { label: "Home", href: "#" },
                    { label: "Products", href: "#products" },
                    { label: "My Orders", href: "#orders" },
                ].map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className="text-gray-600 hover:text-indigo-600 font-medium transition"
                    >
                        {item.label}
                    </a>
                ))}
            </nav>
            <div className="flex items-center space-x-4">
                {walletConnected && (
                    <span className="text-gray-600 font-medium hidden sm:block truncate max-w-[150px]">
                        {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                    </span>
                )}
                <button
                    onClick={walletConnected ? handleDisconnectWallet : handleConnectWallet}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${walletConnected ? "bg-red-600 text-white hover:bg-red-700" : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    title={walletConnected ? "Disconnect your wallet" : "Connect your wallet"}
                >
                    {walletConnected ? "Disconnect" : "Connect Wallet"}
                </button>
            </div>
        </div>
    </header>
);

export default Header;