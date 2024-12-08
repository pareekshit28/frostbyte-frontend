import { getAddress } from "@coinbase/onchainkit/identity";
import { useState } from "react";
import { base, baseSepolia, mainnet } from "viem/chains";

const OnboardingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const regex = /\b[a-zA-Z0-9-]+\.base\.eth\b/;

  const handleLogin = async () => {
    if (regex.test(address)) {
      const addressFromName = await getAddress({
        name: address,
        chain: mainnet,
      });
      console.log(addressFromName);
      localStorage.setItem("address", addressFromName);
    } else {
      localStorage.setItem("address", address);
    }
    localStorage.setItem("password", password);
    window.location.reload();
  };

  const handleCreateWallet = async () => {
    const response = await fetch("http://localhost:3000/wallet/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ passwordHash: newPassword }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("address", data.address);
      localStorage.setItem("password", newPassword);
      setAddress(data.address);
    } else {
      alert("Error creating wallet");
      console.error("Error creating wallet:", response.statusText);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://www.climaterealityproject.org/sites/default/files/adam-chang-iwenq-4jhqo-unsplash.jpg')] bg-cover">
      <div className="bg-white/70 shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Welcome to FrostSync
        </h1>

        {/* Login Section */}
        <div className="mb-6">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-600"
          >
            Basename or Wallet Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Eg. jesse.basetest.eth or 0x6b8E1c....cd031f0"
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600 mt-4"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={handleLogin}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </div>

        {/* Create Wallet Button */}
        <div className="text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create a Wallet
          </button>
        </div>
      </div>

      {/* Modal for Wallet Creation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Create Wallet
            </h2>

            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-600"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter a new password"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWallet}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
