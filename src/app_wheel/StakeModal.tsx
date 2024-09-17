import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { dryrun, message, createDataItemSigner, result } from '@permaweb/aoconnect/browser';
import { PermissionType } from 'arconnect';
import { GetAddressStakedTrunkAmount, GetTrunkBalance, StakeTrunk, UnstakeTrunk, FetchAddress } from './MiscTools';
import { useRive } from "@rive-app/react-canvas";
import Spinner from './Spinner';

const TRUNK = "wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ";

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


interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

const StakeModal: React.FC<VoteModalProps> = ({ isOpen, onClose, address }) => {

    const [trunkBalance, setTrunkBalance] = useState<number>(0);
    const [maxTrunkBalance, setMaxTrunkBalance] = useState<number>(0);

    const [stakedBalance, setStakedBalance] = useState<number>(0);
    const [maxStakedBalance, setMaxStakedBalance] = useState<number>(0);

    // Inputs
    const [amountToStake, setAmountToStake] = useState<string>("");
    const [amountToUnstake, setAmountToUnstake] = useState<string>("");

    const [isLoading, setIsLoading] = useState(false);
    const [loadMessage, setLoadMessage] = useState('');

    const {
        rive,
        setCanvasRef,
        setContainerRef,
        canvas: canvasRef,
        container: canvasContainerRef,
      } = useRive(
        {
          src: "/app_wheel/trunk_spinner.riv",
          artboard: "spinner",
          stateMachines: "main",
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

    // Reset stake/unstake values
    useEffect(() => {

        if(!isOpen) {
          console.log("Closing stake modal... ");
        } else {
          console.log("Opening stake modal...");

          
            if( address === "" ) {
                console.error("No address provided!");
            } else {
                console.log("Modal Address: " , address);
            }

          UpdateUI();
        }
  
    }, [isOpen]);

    const UpdateUI = async () => {
        try {

            setIsLoading(true);

            // Get TRUNK balance
            const balance = await GetTrunkBalance( address );
            setTrunkBalance( balance );

            // Get Staked amount
            const stakedAmount = await GetAddressStakedTrunkAmount( address );
            setStakedBalance( stakedAmount );

            // Clear input amounts
            setAmountToStake("");
            setAmountToUnstake("");

            // Extra second for loading spinner
            await new Promise(resolve => setTimeout(resolve, 500));

            setLoadMessage("");
            setIsLoading(false);

        } catch (error) {
            console.error("Failed to get balance: ", error);
        }
    }

    const CallFetchAddress = async () => {
        try {
            const res = await FetchAddress();
            UpdateUI();
            console.log("Fetched address: ", res);
        } catch (error) {
            console.error("Failed to stake: ", error); 
        }
    }

    const CallStakeTrunk = async () => {
      setIsLoading(true);
        try {
            const res = await StakeTrunk(amountToStake);
            setLoadMessage("Stake result: " +res);
            UpdateUI();
        } catch (error) {
            setLoadMessage("Failed to Stake: " + error); 
        }
    }

    const CallUnStakeTrunk = async () => {
      setIsLoading(true);
        try {
            const res = await UnstakeTrunk(amountToUnstake);
            setLoadMessage("Unstaked: " + res);
            UpdateUI();
        } catch (error) {
            setLoadMessage("Failed to Unstake: " + error);
        }
    }

    const CallGetMaxBalance = async () => {
        try {     
            const balance = await GetTrunkBalance( address );
            setAmountToStake( balance.toString() );
        } catch (error) {
        }
    }

    const CallGetMaxStaked = async () => {
      try {     
          const balance = await GetAddressStakedTrunkAmount( address );
          setAmountToUnstake( balance.toString() );
      } catch (error) {
      }
  }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmountToStake(event.target.value);
    };

    const handleUnstakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmountToUnstake(event.target.value);
    };

    function StakeModalRender() {
        return (
          <>
            <div className="flex flex-col items-center justify-center">

            <div className="flex flex-row items-center justify-center space-x-2">

                <div className="flex flex-col items-center justify-center space-x-2">
                    <img src="Trunk_Logo_White.png" alt="Trunk Logo" className="w-24 h-24" />
                </div>

                
                <div className="flex flex-col items-center justify-center space-x-2">
                    <h2 className="text-white text-2xl font-bold">{stakedBalance}</h2>
                    <p className="text-white">Staked</p>
                </div>

                <div className="flex flex-col items-center justify-center space-x-2">
                    <h2 className="text-white text-2xl font-bold">{trunkBalance}</h2>
                    <p className="text-white">Balance</p>
                </div>
            </div>

            <br/>
                <div className="w-1/2 h-px bg-white mx-auto"></div>
            <br/>
            </div>

            <div className="flex flex-col items-center justify-center">

            <div className="flex flex-row items-center justify-center space-x-2">
                <input
                type="text"
                name="stake"
                value={amountToStake}
                onChange={handleInputChange}
                placeholder="Enter TRUNK to stake"
                className="py-2 px-4 border rounded-md text-black"
                />
                <button className="text-white" onClick={CallGetMaxBalance} > Max </button>
            </div>


            <button
                className="py-2 px-4 bg-[#9ECBFF] text-white rounded-md mt-2"
                onClick={CallStakeTrunk}
            >
                Stake TRUNK
            </button>
            </div>

            <div className="flex flex-col items-center justify-center mt-4">
            

            <div className="flex flex-row items-center justify-center space-x-2">
                <input
                type="text"
                name="unstake"
                value={amountToUnstake}
                onChange={handleUnstakeInputChange}
                placeholder="Enter TRUNK to unstake"
                className="py-2 px-4 border rounded-md text-black"
                />
                <button className="text-white" onClick={CallGetMaxStaked}> Max </button>
            </div>

            <button
            className="py-2 px-4 bg-[#EF707E] text-white rounded-md mt-2"
            onClick={CallUnStakeTrunk}
            >
                Unstake TRUNK
            </button>
            </div>
          </>
        );
    }

    function DisconnectedRenderer() {
        return (
          <>
            <div className="flex flex-col items-center justify-center"> Disconnected </div> 
          </>
        );
    }

    function LoadingRenderer() {
        return (
          <>
            {/* <div 
              ref={setContainerRef} 
              className="w-full h-1/2 bg-transparent flex justify-center items-center mx-auto"
            >
              <canvas
                ref={setCanvasRef}
                className="w-full h-full bg-transparent block relative max-h-screen max-w-screen align-top"
                aria-label="Dog haz coin?"
              ></canvas>
            </div> */}

            {/* <div className="flex flex-col items-center justify-center"> ... </div>  */}

            <Spinner />

            <div className="flex flex-col items-center justify-center"> {loadMessage} </div> 

          </>
        );
    }

    function MainRenderer() {
        return (
          <>
            { address === "" ? DisconnectedRenderer() :  StakeModalRender()}
          </>
        );
    }

    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <div className="p-4">

          { isLoading ? LoadingRenderer() : MainRenderer() }
            
          </div>
        </Modal>
      );
    };
    
    export default StakeModal;