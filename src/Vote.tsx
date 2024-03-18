import { useEffect, useState } from 'react';
import { dryrun, message, createDataItemSigner, result } from '@permaweb/aoconnect/browser';
import { PermissionType } from 'arconnect';

import Footer from './Footer';

const TRUNK = "OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww";

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

const Vote = () => {
    const [address, setAddress] = useState('');
    const [voteData, setVoteData] = useState<VoteItem[]>([]);
    const [stakeValue, setStakeValue] = useState('');
    const [unstakeValue, setUnstakeValue] = useState('');
    const [stakeSuccess, setStakeSuccess] = useState(false);

    const fetchAddress = async () => {
        await window.arweaveWallet.connect(permissions, {
            name: "TRUNK",
            logo: "4eTBOaxZSSyGbpKlHyilxNKhXbocuZdiMBYIORjS4f0"
        });
        try {
            const address = await window.arweaveWallet.getActiveAddress();
            setAddress(address);
        } catch (error) {
            console.error(error);
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

    const vote = async (id: string, side: string) => {
        console.log(id, side);
        try {
            const getVoteMessage = await message({
                process: TRUNK,
                tags: [
                    { name: 'Action', value: 'Vote' },
                    { name: 'Side', value: side.toString() },
                    { name: 'TXID', value: id.toString() },
                ],
                signer: createDataItemSigner(window.arweaveWallet),
            });
            try {
                let { Messages, Error } = await result({
                    message: getVoteMessage,
                    process: TRUNK,
                });
                if (Error) {
                    alert("Error handling vote:" + Error);
                    return;
                }
                if (!Messages || Messages.length === 0) {
                    alert("No messages were returned from ao. Please try later.");
                    return;
                }
                alert("Vote successful!");
            } catch (e) {
                console.log(e);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStakeValue(event.target.value);
    };

    const stake = async () => {
        const value = parseInt(stakeValue);
        const units = value * 1000;
        const trunkUnits = units.toString();
        try {
            const getStakeMessage = await message({
                process: TRUNK,
                tags: [
                    { name: 'Action', value: 'Stake' },
                    { name: 'Quantity', value: trunkUnits },
                    { name: 'UnstakeDelay', value: '1000' },
                ],
                signer: createDataItemSigner(window.arweaveWallet),
            });
            const { Messages, Error } = await result({
                message: getStakeMessage,
                process: TRUNK,
            });
            if (Error) {
                alert("Error handling staking:" + Error);
                return;
            }
            if (!Messages || Messages.length === 0) {
                alert("No messages were returned from ao. Please try later.");
                return; 
            }
            setStakeSuccess(true);
        } catch (error) {
            alert('There was an error staking: ' + error);
        }
    };

    const handleUnstakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUnstakeValue(event.target.value);
    };

    const unstake = async () => {
        const value = parseInt(unstakeValue);
        const units = value * 1000;
        const trunkUnits = units.toString();
        try {
            const getUnstakeMessage = await message({
                process: TRUNK,
                tags: [
                    { name: 'Action', value: 'Unstake' },
                    { name: 'Quantity', value: trunkUnits },
                ],
                signer: createDataItemSigner(window.arweaveWallet),
            });
            const { Messages, Error } = await result({
                message: getUnstakeMessage,
                process: TRUNK,
            });
            if (Error) {
                alert("Error handling unstaking:" + Error);
                return;
            }
            if (!Messages || Messages.length === 0) {
                alert("No messages were returned from ao. Please try later.");
                return; 
            }
            // Optionally, handle success (e.g., updating UI or state)
            alert('Unstake successful!');
        } catch (error) {
            alert('There was an error unstaking: ' + error);
        }
    };
    
    

    

    useEffect(() => {
        const fetchVotes = async () => {
            const votes = await getVotes();
            if (typeof votes !== 'string') { 
                setVoteData(votes);
            }
        };

        fetchVotes();
    }, [address]);

    function getVoteData() {
        return (
          <>
            {voteData.map((item, index) => (
                <div key={index} className='p-4 border border-gray rounded shadow-md max-w-md lg:max-w-xs sm:max-w-sm w-full md:w-1/2 lg:w-1/4 sm:w-full md:mr-2'>
                    <p className='text-2xl mb-4'>Candidate #{index}</p>
                    <a className='font-bold underline' href={`https://arweave.net/${item.tx}`} target="_blank" rel="noopener noreferrer">Memeframe URL</a>
                    <p className='mt-4'>Yay: {item.yay / 1000}, Nay: {item.nay / 1000}</p>
                    <p>Decided at block: {item.deadline}</p>
                    {address ? (
                        <div className='text-center mt-4'>
                            <button onClick={() => vote(item.tx, "yay")} className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-4">
                                Yes 
                            </button>
                            <button onClick={() => vote(item.tx, "nay")} className="bg-red-600 hover:bg-red-400 text-white font-bold py-2 px-4 rounded">
                                No 
                            </button>
                            <p className='text-sm my-2'>Your vote is cast with all the TRUNK you currently have staked.</p>
                        </div>
                    ) : (
                        <div>
                            <p className='text-center my-4'>
                                <button onClick={fetchAddress} className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                                    Connect 
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            ))}
          </>
        );
    }

    return (
        <div>
            <div className='flex flex-wrap justify-center h-100 my-40'>
                {voteData.length > 0 ? getVoteData() : <p>No votes yet...</p>}
            </div>
            {stakeSuccess ? 
                <p>You have staked TRUNK successfully.</p> :
                <div className="flex flex-col items-center justify-center">
                    <input
                        type="text"
                        name="stake"
                        placeholder="Enter TRUNK to stake"
                        value={stakeValue}
                        onChange={handleInputChange}
                        className="py-2 px-4 border rounded-md"
                    />
                    <button
                        className="py-2 px-4 bg-black text-white rounded-md mt-2"
                        onClick={stake}
                    >
                        Stake TRUNK
                    </button>
                </div>
                
            }

            {/* Unstake input and button */}
            <div className="flex flex-col items-center justify-center mt-4">
              <input
                 type="text"
                 name="unstake"
                 placeholder="Enter TRUNK to unstake"
                 value={unstakeValue}
                 onChange={handleUnstakeInputChange}
                 className="py-2 px-4 border rounded-md"
                  />
             <button
               className="py-2 px-4 bg-black text-white rounded-md mt-2"
               onClick={unstake}
              >
              Unstake TRUNK
              </button>
            </div>
            <Footer />
        </div>
    );
};

export default Vote;

  