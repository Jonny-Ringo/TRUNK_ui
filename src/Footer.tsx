import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { dryrun, message, createDataItemSigner, result } from '@permaweb/aoconnect/browser';
import { PermissionType } from 'arconnect';

const TRUNK = "OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww";

const permissions: PermissionType[] = [
  'ACCESS_ADDRESS',
  'SIGNATURE',
  'SIGN_TRANSACTION',
  'DISPATCH'
];

const Footer = () => {

  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  useEffect(() => {
    
    // Listen for disconnect events
    const handleDisconnect = () => {
      console.log("Wallet disconnected.");
      setIsConnected(false);
      setAddress('');
    };
    window.addEventListener('disconnect', handleDisconnect);

    return () => {
      window.removeEventListener('disconnect', handleDisconnect);
    };

  }, []);

  const fetchAddress = async () => {
    console.log("Fetching address...");
    try {
      // Check if ArConnect is available
      if (window.arweaveWallet) {
        try {
          // Try to get permissions without prompting the user again if they're already connected
          const currentPermissions = await window.arweaveWallet.getPermissions();
          if (!currentPermissions.includes('ACCESS_ADDRESS')) {
            // Connect if ACCESS_ADDRESS permission hasn't been granted yet
            await window.arweaveWallet.connect(permissions, {
              name: "TRUNK",
            });
          }
          // Fetch the active address
          const address = await window.arweaveWallet.getActiveAddress();
          console.log("Connected: ", address);
          setAddress(address);
          setIsConnected(true);
        } catch (error) {
          console.error("Error connecting to ArConnect:", error);
          setIsConnected(false);
        }
      } else {
        console.log("ArConnect not installed.");
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Failed to fetch address:", error);
      setIsConnected(false);
    }
  };

  // useEffect(() => {

  //     if(address !== '') {
  //         console.log("Connected: ", address);
  //         setIsConnected(true);
  //     } else {
  //         console.log("Disconnected: ", address);
  //         setIsConnected(false);
  //     }

  // }, [address]);

  useEffect(() => {

    if(isConnected) {
        console.log("Connected");
        // getBalance();
    } else {
        console.log("Disconnected");
    }

  }, [isConnected]);

  const truncateAddress = (address: string) => {
    if (address.length > 10) {
      return `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;
    }
    return address;
  };

  const disconnect = () => {
    console.log("Wallet disconnected.");
    setIsConnected(false);
    setAddress('');
  };
  
  const getBalance = async () => {
    console.log("Getting balance...");
    try {
      console.log("trying balance...");
        const result = await dryrun({
            process: TRUNK,
            tags: [
                { name: 'Action', value: "Balance" }
            ],
            anchor: "latest",
        });
        if (result && result.Messages[0]) {
            return JSON.parse(result.Messages[0].Data);
        } else {
            console.log("No readable data from dryrun!");
            return "";
        }
    } catch (e) {
        console.log(e);
        return "";
    }
};

const testMessage = async () => {
  console.log("testMessage...");

  try {
    console.log("trying balance...");
      const result = await message({
          process: TRUNK,
          tags: [
              { name: 'Action', value: "Balance" }
          ],
          signer: createDataItemSigner(window.arweaveWallet),
          //   data: "any data",
      });
      if (result) {
        console.log(result);
          return JSON.parse(result);
      } else {
          console.log("No readable data from dryrun!");
          return "";
      }
  } catch (e) {
      console.log(e);
      return "";
  }
  
  // const result = await message({
  //   process: TRUNK,
  //   tags: [
  //     { name: "Action", value: "Balance" }
  //   ],
  //   signer: createDataItemSigner(window.arweaveWallet),
  //   data: "any data",
  // })
  //   .then(console.log)
  //   .catch(console.error);

  // console.log(result);
};

  function handleIsConnected() {
    return (
      <>
        <div className="md:col-span-1 flex justify-center md:justify-end">
          Welcome to Trunk {truncateAddress(address)}
            <button onClick={disconnect} className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                Dissconnect 
            </button>
        </div>
      </>
    );
  }

  function handleIsNotConnected() {
    return (
      <>
        <div className="md:col-span-1 flex justify-center md:justify-end">
              <button onClick={fetchAddress} className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                  Connect 
              </button>
          </div>
      </>
    );
  }

  // useEffect(() => {

  //   console.log("handleArweaveWalletLoaded");

  //   const handleArweaveWalletLoaded = async () => {
  //     // Ensure window.arweaveWallet is available before calling methods on it
  //     if (window.arweaveWallet) {
  //       try {
  //         const permissions = await window.arweaveWallet.getPermissions();

  //         if (permissions.length <= 0) {
  //           await window.arweaveWallet.connect(["ACCESS_ADDRESS"]);

  //           const userAddress = await window.arweaveWallet.getActiveAddress();
  //           console.log("Your wallet address is", userAddress);
  //         }
  //       } catch (error) {
  //         console.error("Error interacting with ArConnect:", error);
  //       }
  //     }
  //   };

  //   // Listen for the arweaveWalletLoaded event
  //   window.addEventListener("arweaveWalletLoaded", handleArweaveWalletLoaded);

  //   // Clean up the event listener on component unmount
  //   return () => {
  //     window.removeEventListener("arweaveWalletLoaded", handleArweaveWalletLoaded);
  //   };
  // }, []);

  return (
    <footer className="bg-gray-100 text-gray-800">
      <div className="container px-5 py-8 mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

        <div className="md:col-span-1 flex justify-center md:justify-start">
          <Link to={"/"}>
            <img className='w-48' src="Trunk Logo.svg" alt="Logo" />
          </Link>
        </div>

        <div className="md:col-span-2">
          <h2 className="title-font font-semibold text-gray-900 text-lg mb-3 text-center md:text-left">Have Some Fun!</h2>
          <nav className="flex justify-center md:justify-start flex-wrap">
          
            <Link to={"https://bark.arweave.dev/#/"} className="mr-5 text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out">
              <div className="flex items-center">
                <img src="bark_logo.png" alt="Bark Logo" className="w-4 h-4 mr-2" />
                Swap TRUNK
              </div>
            </Link>

            <Link to={"/vote/"} className="mr-5 text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out">
              <div className="flex items-center">
              <img src="vote_icon.png" alt="Vote Icon" className="w-4 h-4 mr-2" />
                Vote
              </div>
            </Link>

            <a href="https://github.com/Jonny-Ringo/TRUNK_ui" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out">
              <div className="flex items-center">
              <img src="github_icon.png" alt="Github Logo" className="w-4 h-4 mr-2" />
                Contribute
              </div>
            </a>
            
          </nav>

          { isConnected ? handleIsConnected() : handleIsNotConnected() }

          <button onClick={testMessage} className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
              testMessage
            </button>
          
        </div>
      </div>
    </footer>

  );
};

export default Footer;