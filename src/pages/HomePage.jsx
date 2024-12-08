import { useName } from "@coinbase/onchainkit/identity";
import { useEffect, useState } from "react";
import { mainnet } from "viem/chains";
import { getAddress } from "@coinbase/onchainkit/identity";

const HomePage = () => {
  const [mediaList, setMediaList] = useState([]);
  const [blobList, setBlobList] = useState([]);
  const address = localStorage.getItem("address");
  const password = localStorage.getItem("password");
  const [isBaseNameModalOpen, setIsBaseNameModalOpen] = useState(false);
  const [baseName, setBaseName] = useState("");

  const name = useName({
    address,
    schemaId:
      "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9",
  });

  useEffect(() => {
    if (!name) {
      setIsBaseNameModalOpen(true);
    }
  }, [name]);

  const fetchMediaList = async (address) => {
    try {
      const response = await fetch(
        "http://localhost:3000/media/list?address=" + address
      );
      if (response.ok) {
        const list = await response.json();
        setMediaList(list);
      } else {
        console.error("Error fetching blob list:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching blob list:", error);
      return null;
    }
  };

  const fetchMedia = async (blobId) => {
    try {
      const response = await fetch(`http://localhost:3000/media/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          passwordHash: password,
          blobId: blobId,
        }),
      });
      if (response.ok) {
        const blob = await response.blob();
        setBlobList((prevBlobList) => [...prevBlobList, { blobId, blob }]);
      } else {
        console.error("Error fetching blob:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching blob:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchMediaList(address);
  }, [address]);

  useEffect(() => {
    mediaList.forEach((blobId) => {
      fetchMedia(blobId);
    });
  }, [mediaList]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedBlobId, setSelectedBlobId] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // Modal for sharing
  const [shareAddress, setShareAddress] = useState(""); // Address to share access
  const [ensAddress, setEnsAddress] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); // Create a preview URL for the image
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("address", address);
      formData.append("file", selectedImage); // Pass the raw file object
      const response = await fetch("http://localhost:3000/media/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        console.log(await response.json());
      } else {
        alert("Failed to upload the file.");
      }

      setSelectedImage(null);
      setIsModalOpen(false);
    }
  };

  // Handle sharing access
  const handleShareAccess = async () => {
    if (selectedBlobId && shareAddress) {
      try {
        const response = await fetch(
          "http://localhost:3000/media/shareAccess",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address,
              passwordHash: password,
              blobId: selectedBlobId,
              destinationAddress: shareAddress,
            }),
          }
        );
        if (response.ok) {
          alert("Access shared successfully");
          setIsShareModalOpen(false);
          setShareAddress("");
          setSelectedBlobId(null);
        } else {
          console.error("Error sharing access:", response.statusText);
        }
      } catch (error) {
        console.error("Error sharing access:", error);
      }
    }
  };

  useEffect(() => {
    const regex = /\b[a-zA-Z0-9-]+\.base\.eth\b/;
    if (regex.test(shareAddress)) {
      getAddress({
        name: shareAddress,
        chain: mainnet,
      }).then((addressFromName) => {
        console.log(addressFromName);
        setEnsAddress(addressFromName);
      });
    } else {
      setEnsAddress("");
    }
  }, [shareAddress]);

  const handleRegisterBaseName = async function () {
    if (baseName) {
      const response = await fetch("http://localhost:3000/basename/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          passwordHash: password,
          name: baseName,
        }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Error registering base name:", response.statusText);
      }
      setIsBaseNameModalOpen(false);
    }
  };

  return (
    <div className="h-screen relative bg-[url('https://www.climaterealityproject.org/sites/default/files/adam-chang-iwenq-4jhqo-unsplash.jpg')] bg-cover bg-fixed">
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your Photos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {blobList.map((data, index) => (
              <div
                key={index}
                className="relative bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group"
              >
                <img
                  src={URL.createObjectURL(data.blob)}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Share Access Button */}
                <button
                  onClick={() => {
                    setIsShareModalOpen(true);
                    setSelectedBlobId(data.blobId);
                  }}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm px-3 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  Share Access
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Upload Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Upload
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-2">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Upload Photo
            </h3>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {selectedImage && (
              <div className="mb-4">
                <h4 className="text-gray-600 text-sm mb-2">Preview:</h4>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-md border"
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Sharing Access */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Share Access
            </h3>
            <input
              type="text"
              placeholder="Enter address"
              value={shareAddress}
              onChange={(e) => setShareAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
            />
            {/* Ethereum Address */}
            <div className="mb-4 ml-2">
              <h4 className=" text-sm mb-2">{ensAddress}</h4>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleShareAccess}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Basename Modal */}
      {isBaseNameModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Register Base Name
            </h2>
            <input
              type="text"
              value={baseName}
              onChange={(e) => setBaseName(e.target.value)}
              placeholder="Eg: jesse.basetest.eth"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsBaseNameModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterBaseName}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
