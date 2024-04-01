// VoteModal.tsx
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { dryrun, message, createDataItemSigner, result } from '@permaweb/aoconnect/browser';
import { PermissionType } from 'arconnect';

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


interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

const VoteModal: React.FC<VoteModalProps> = ({ isOpen, onClose, address }) => {


    // const [address, setAddress] = useState('');
    const [voteData, setVoteData] = useState<VoteItem[]>([]);
    const [stakeValue, setStakeValue] = useState('');
    const [unstakeValue, setUnstakeValue] = useState('');

    const [trunkBalance, setTrunkBalance] = useState(0)
    const [credBalance, setCredBalance] = useState(0)

    const [maxTrunkBalance, setMaxTrunkBalance] = useState('')

    // Reset stake/unstake values
    useEffect(() => {

      if(!isOpen) {
        setStakeValue('');
        setUnstakeValue('');
        setTrunkBalance(0);
        // setMaxTrunkBalance('');
      } 

    }, [isOpen]);

    // const fetchAddress = async () => {
    //     await window.arweaveWallet.connect(permissions, {
    //         name: "TRUNK",
    //         logo: "4eTBOaxZSSyGbpKlHyilxNKhXbocuZdiMBYIORjS4f0"
    //     });
    //     try {
    //         const address = await window.arweaveWallet.getActiveAddress();
    //         setAddress(address);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

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

    const setMaxBalance = () => {
        console.log("Setting max balance...");
        fetchBalance(TRUNK);
    }

    useEffect(() => {
      
      setStakeValue( trunkBalance.toString() );
    }, [trunkBalance]);

    const stake = async () => {
        const value = parseInt(stakeValue);
        const units = value * 1000;
        const trunkUnits = units.toString();
        console.log("Staking Value:", value);
        console.log("Units to Stake:", units);
        console.log("Request Payload:", trunkUnits);
        try {
            const getStakeMessage = await message({
                process: TRUNK,
                tags: [
                    { name: 'Action', value: 'Stake' },
                    { name: 'Quantity', value: trunkUnits },
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
            // Optionally, handle success (e.g., updating UI or state)
            alert('Stake successful!');
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
        console.log("Unstaking Value:", value);
        console.log("Units to Unstake:", units);
        console.log("Request Payload:", trunkUnits);
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

    const fetchBalance = async (process: string) => {
      if (address) {
        console.log( "Fetching balance for :" + address);
          try {
              if (process === TRUNK) {
                  const messageResponse = await dryrun({
                      process,
                      tags: [
                          { name: 'Action', value: 'Balance' },
                          { name: 'Recipient', value: address },
                      ],
                  });
                  const balanceTag = messageResponse.Messages[0].Tags.find((tag: Tag) => tag.name === 'Balance')
                  const balance = balanceTag ? parseFloat((balanceTag.value / 1000).toFixed(4)) : 0;
                  setTrunkBalance(balance)
                  
              } else {
                  const messageResponse = await dryrun({
                      process,
                      tags: [
                          { name: 'Action', value: 'Balance' },
                          { name: 'Target', value: address },
                      ],
                  });
                  const balanceTag = messageResponse.Messages[0].Tags.find((tag: Tag) => tag.name === 'Balance')
                  const balance = balanceTag ? parseFloat((balanceTag.value / 1000).toFixed(4)) : 0;
                  setCredBalance(balance)
              }
          } catch (error) {
              console.error(error);
          }
      }
  };

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
                                Yay 
                            </button>
                            <button onClick={() => vote(item.tx, "nay")} className="bg-rose-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded">
                                Nay 
                            </button>
                            <p className='text-sm my-2'>Your vote is cast with all the TRUNK you currently have staked.</p>
                        </div>
                    ) : (
                        <div>
                            <p className='text-center my-4'>
                                {/* <button onClick={fetchAddress} className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                                    Connect 
                                </button> */}
                            </p>
                        </div>
                    )}
                </div>
            ))}
          </>
        );
    }


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">

        <div className="flex flex-col items-center justify-center">
          {voteData.length > 0 ? getVoteData() : <p>No votes yet...</p>}

          <div className="w-1/2 h-px bg-white mx-auto"></div>
          <br/>
        </div>
        
        <div className="flex flex-col items-center justify-center">

              <div className="flex flex-row items-center justify-center space-x-2">
                <input
                  type="text"
                  name="stake"
                  placeholder="Enter TRUNK to stake"
                  value={stakeValue}
                  onChange={handleInputChange}
                  className="py-2 px-4 border rounded-md text-black"
                />
                <button className="text-white" onClick={setMaxBalance} > Max {maxTrunkBalance} </button>
              </div>


            <button
                className="py-2 px-4 bg-[#9ECBFF] text-white rounded-md mt-2"
                onClick={stake}
            >
                Stake TRUNK
            </button>
        </div>

        <div className="flex flex-col items-center justify-center mt-4">
              <input
                 type="text"
                 name="unstake"
                 placeholder="Enter TRUNK to unstake"
                 value={unstakeValue}
                 onChange={handleUnstakeInputChange}
                 className="py-2 px-4 border rounded-md text-black"
                  />
             <button
               className="py-2 px-4 bg-[#EF707E] text-white rounded-md mt-2"
               onClick={unstake}
              >
              Unstake TRUNK
              </button>
            </div>
        
      </div>
    </Modal>
  );
};

export default VoteModal;
