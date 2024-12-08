import {
  Avatar,
  Identity,
  Name,
  Badge,
  Address,
} from "@coinbase/onchainkit/identity";

const Navbar = () => {
  const address = localStorage.getItem("address");
  return (
    <div className=" w-full flex justify-between h-20 p-4 fixed top-0 left-0 z-50">
      <h1 className="text-2xl font-bold">FrostByte</h1>
      {address && (
        <div className="flex items-center space-x-4 mr-4">
          <Identity
            address={address}
            schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
          >
            <Avatar />
            <Name>
              <Badge />
            </Name>
            <Address />
            );
          </Identity>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
