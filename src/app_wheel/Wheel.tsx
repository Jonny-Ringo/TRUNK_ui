import { useEffect, useState, useRef } from 'react';
import { dryrun, message, createDataItemSigner, result  } from "@permaweb/aoconnect";
import { PermissionType } from 'arconnect';
import {
    Rive,
    useRive,
    useStateMachineInput,
    Fit,
    Alignment,
    EventType,
    RiveEventType
} from "@rive-app/react-canvas";
import VoteModal from './VoteModal';
import './extrastyle.css';
import { GetAddressStakedTrunkAmount } from './MiscTools';
import StakeModal from './StakeModal';


const TRUNK = "OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww"
const INITIAL_FRAME = "X5TgFGNgbje0JezztY5RL__VnYD9IieHa_9n9p0dMb0"

const permissions: PermissionType[] = [
  'ACCESS_ADDRESS',
  'SIGNATURE',
  'SIGN_TRANSACTION',
  'DISPATCH'
];

interface VoteItem {
  tx: string;
  yay: number;
  nay: number;
  deadline: number;
}

interface Tag {
  name: string;
  value: string;
}

interface RiveEvent {
  data: {
    type: RiveEventType | number;
    name: string;
    url?: string;
    target?: string;
    delay?: number;
  };
}

function Wheel () {

    const [iframeSrc, setIframeSrc] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);

    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string>('');
    const [voteData, setVoteData] = useState<VoteItem[]>([]);
    const [stakeValue, setStakeValue] = useState('');
    const [unstakeValue, setUnstakeValue] = useState('');

    const [ addressStakedTrunk, setAddressStakedTrunk] = useState<number>(0);

    const [ typedValue, setTypedValue ] = useState<string>('');

    const {
      rive,
      setCanvasRef,
      setContainerRef,
      canvas: canvasRef,
      container: canvasContainerRef,
    } = useRive(
      {
        src: "/app_wheel/trunk_app.riv",
        artboard: "TrunkUI",
        stateMachines: "app_state",
        autoplay: true,
        onLoad: () => {
          console.log("Rive loaded!");
        },
        onPlay: () => {
          console.log('Animation is playing..');
        }
      },
      {
        shouldResizeCanvasToContainer: true,
      }
    );

    const animWalletConnected = useStateMachineInput(rive, 'app_state', 'wallet_connected', false);
    // const stateIndex = useStateMachineInput(rive, 'app_state', 'state_index');

    useEffect(() => {
      // Moved inside useEffect to have access to setIsModalOpen
      const onRiveEventReceived = ( riveEvent: RiveEvent ) => {
          const { data } = riveEvent;
        
          if (data.type === RiveEventType.General) {
            console.log("Event name", data.name);

            if( data.name === "vote_event" ) {
              setIsModalOpen(true);
              // setTypedValue( "" +data.name );
            } else if( data.name === "stake_event" ) {

              // console.log( "Why isnt this able to get the address form the wallet?" );
              // CheckAddress();

              // if( address !== null && address !== "") {
              //   console.log( "Address: " +address );
              // } else  {
                // console.log( address );
              // }

              // if( address !== "" ) {
                setIsStakeModalOpen(true);
              // } else  {
              //   alert("Please connect your wallet first.");
              // }

              
            } else if( data.name === "wallet_click" ) {
              if( !isConnected ) {
                fetchAddress();
              } else {
                // disconnect();
              }
            } 
            // else if( data.name === "vote_enter" ) {
            //   setTypedValue( "Vote w/ Trunk" );
            // }else if( data.name === "hover_exit" ) {
            //   setTypedValue( "" );
            // }

          } else if (data.type === RiveEventType.OpenUrl && data.url) {
            // console.log("Event name", data.name);
            // console.log("URL", data.url);

            // setTypedValue( "" +data.name );

            if (data.target && data.target === '_blank') {
              window.open(data.url, '_blank');
            } else {
              window.location.href = data.url;
            }
          }
      };

      if (rive) {
          rive.on(EventType.RiveEvent, onRiveEventReceived as any);
      }
      
      return () => {
          if (rive) {
              rive.off(EventType.RiveEvent, onRiveEventReceived as any);
          }
      };
  }, [rive, setIsModalOpen]);

  useEffect(() => {
    if(animWalletConnected) {
      animWalletConnected.value = isConnected;
      }
  }, [isConnected]);


    useEffect(() => {
        const getWebsite = async () => {
          try {
            const result = await dryrun({
              process: TRUNK,
              tags: [{ name: 'Action', value: "Get-Frame" }]
            });
            if (result) {
              return result.Messages[0].Data;
            } else {
              console.log("Got no response from dryrun!")
              return INITIAL_FRAME
            }
          } catch (e) {
            console.log(e);
          }
        };
    
        const setupIframe = async () => {
          const processResponse = await getWebsite();
          const url = `https://arweave.net/${processResponse}`;
          setIframeSrc(url);

          checkConnected(); // fetchAddress();
        };
    
        setupIframe();
      }, []);

      const checkConnected = async () => {
        console.log("Fetching address...");
        try {
          // Check if ArConnect is available
          if (window.arweaveWallet) {
            try {
              // Try to get permissions without prompting the user again if they're already connected
              const currentPermissions = await window.arweaveWallet.getPermissions();
              if (currentPermissions.includes('ACCESS_ADDRESS')) {
                const address = await window.arweaveWallet.getActiveAddress();
                console.log("Connected: ", address);
                setAddress(address);
                setIsConnected(true);
              } else {
                console.log("Not connected.");
                setIsConnected(false);
              }
              
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
      
    return (
      <div className='wheel'>
      <div className="min-h-screen bg-cover bg-center bg-repeat-x"
        style={{ 
          backgroundImage: `url('./app_wheel/background.png')`,
         }}>

          <div className="wrapper">
              <div className="typing-demo">
              Welcome to $TRUNK
              </div>
              { truncateAddress(address) }
          </div>

          <VoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} address={address} />
          <StakeModal isOpen={isStakeModalOpen} onClose={() => setIsStakeModalOpen(false)} address={address} />

            <div 
              ref={setContainerRef} 
              className="w-full h-1/2 bg-transparent flex justify-center items-center mx-auto"
            >
              <canvas
                ref={setCanvasRef}
                className="w-full h-full bg-transparent block relative max-h-screen max-w-screen align-top"
                aria-label="Dog haz coin?"
              ></canvas>
            </div>

            <div className="wrapper">
                <div className="typing-demo">
                  {typedValue}
                </div>
            </div>
            
        </div>

        
        </div>
	);
}

export default Wheel;