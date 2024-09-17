import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { dryrun, message, createDataItemSigner, result } from '@permaweb/aoconnect/browser';
import { PermissionType } from 'arconnect';
import { GetAddressStakedTrunkAmount, FetchAddress } from './MiscTools';
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
    command: string;
    prop: string;
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

const VoteModal: React.FC<VoteModalProps> = ({ isOpen, onClose, address }) => {
    const [voteData, setVoteData] = useState<VoteItem[]>([]);
    const [stakeValue, setStakeValue] = useState('');
    const [unstakeValue, setUnstakeValue] = useState('');
    const [trunkBalance, setTrunkBalance] = useState(0);
    const [credBalance, setCredBalance] = useState(0);
    const [maxTrunkBalance, setMaxTrunkBalance] = useState('');
    const [maxStakedBalance, setMaxStakedBalance] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [loadMessage, setLoadMessage] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setStakeValue('');
            setUnstakeValue('');
            setTrunkBalance(0);
            setLoadMessage('');
        } else {
            UpdateUI();
        }
    }, [isOpen]);

    const UpdateUI = async () => {
        try {
            setIsLoading(true);
            CallGetAddressStakedTrunkAmount();
            
            // Fetch votes
            const votes = await getVotes();
            if (typeof votes !== 'string') { 
                setVoteData(votes);
            }

            // Extra second for loading spinner
            await new Promise(resolve => setTimeout(resolve, 500));

            setIsLoading(false);
        } catch (error) {
            console.error("Failed to update: ", error);
        }
    };

    const getVotes = async () => {
        try {
            const result = await dryrun({
                process: TRUNK,
                tags: [
                    { name: 'Action', value: "Get-Votes" }
                ]
            });
    
            if (result && result.Messages && result.Messages[0]) {
                try {
                    const votes = JSON.parse(result.Messages[0].Data);
                    console.log('Votes:', votes); // Log the votes to inspect
                    return votes;
                } catch (parseError) {
                    console.error("Failed to parse JSON data:", parseError);
                    return [];
                }
            } else {
                console.log("No readable data from dryrun!");
                return [];
            }
        } catch (e) {
            console.log(e);
            return [];
        }
    };
    

    const vote = async (id: string, side: string) => {
        console.log(id, side);
        setIsLoading(true);
        try {
            const getVoteMessage = await message({
                process: TRUNK,
                tags: [
                    { name: 'Action', value: 'Vote' },
                    { name: 'Side', value: side.toString() },
                    { name: 'TXID', value: id.toString() },
                    { name : 'VoteID', value: id.toString() },
                ],
                signer: createDataItemSigner(window.arweaveWallet),
            });
            try {
                let { Messages, Error } = await result({
                    message: getVoteMessage,
                    process: TRUNK,
                });
                if (Error) {
                    setLoadMessage("Error handling vote:" + Error);
                    return;
                }
                if (!Messages || Messages.length === 0) {
                    setLoadMessage("No messages were returned from ao. Please try later.");
                    return;
                }

                UpdateUI();
                setLoadMessage("Vote successful!");
            } catch (e) {
                console.log(e);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const CallGetAddressStakedTrunkAmount = async () => {
        try {
            const result = await GetAddressStakedTrunkAmount(address);
            setMaxStakedBalance(result);
        } catch (error) {
            console.error("Failed to get stakers: ", error);
        }
    };

    function getVoteDataInModal() {
        return (
          <>
            <div className="flex flex-row items-center justify-center space-x-2">
                <div className="flex flex-col items-center justify-center space-x-2">
                    <img src="Trunk_Logo_White.png" alt="Trunk Logo" className="w-12 h-12" />
                </div>
                <div className="flex flex-col items-center justify-center space-x-2">
                <p className="text-white"> Staked: {maxStakedBalance !== null && maxStakedBalance !== undefined ? maxStakedBalance.toLocaleString() : 'N/A'} </p>
                </div>
            </div>

            <br/>
            <div className="w-1/2 h-px bg-white mx-auto"></div>
            <br/>

            <div>
            {voteData.map((item, index) => (
                <div key={index} className='p-4 border border-gray rounded shadow-md w-full'>
                    <p className='text-2xl mb-4'>Candidate #{index}</p>

                    {/* Display the command field */}
                    <p className='text-sm mb-4'>Command: <br></br><span className='text-white-600'>{item.command || 'N/A'}</span></p>

                    {/* Display the prop (proposal) field */}
                    <div>
                        <p className='text-sm mb-4'>Proposal: <br></br><span className='text-white-600'>{item.prop || 'N/A'}</span></p>
                    </div>

                    <p className='mt-4'>Yay: {item.yay ? item.yay / 1000 : 0}, Nay: {item.nay ? item.nay / 1000 : 0}</p>
                    <p>Decided at block: {item.deadline || 'Unknown'}</p>

                    {address ? (
                        <div className='text-center mt-4'>
                            <button onClick={() => vote(item.tx, "yay")} className="bg-[#9ECBFF] hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-4">
                                Yay
                            </button>
                            <button onClick={() => vote(item.tx, "nay")} className="bg-[#EF707E] hover:bg-red-400 text-white font-bold py-2 px-4 rounded">
                                Nay
                            </button>
                            <p className='text-sm my-2'>Your vote is cast with all the TRUNK you currently have staked.</p>
                        </div>
                    ) : (
                        <div>
                            <p className='text-center my-4'>
                                <button onClick={FetchAddress} className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                                    Connect
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            ))}
            </div>
          </>
        );
    }

    function VoteModalRenderer() {
        return (
            <div className="flex flex-col items-center justify-center">
                {voteData.length > 0 && address !== "" ? getVoteDataInModal() : <p>No votes available...</p>}
            </div>
        );
    }

    function DisconnectedRenderer() {
        return (
            <>
                <div className="flex flex-col items-center justify-center">Disconnected</div> 
            </>
        );
    }

    function LoadingRenderer() {
        return (
            <>
                <Spinner />
                <div className="flex flex-col items-center justify-center">{loadMessage}</div> 
            </>
        );
    }

    function MainRenderer() {
        return (
            <>
                {address === "" ? DisconnectedRenderer() : VoteModalRenderer()}
            </>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-4">
                {isLoading ? LoadingRenderer() : MainRenderer()}
            </div>
        </Modal>
    );
};

export default VoteModal;

