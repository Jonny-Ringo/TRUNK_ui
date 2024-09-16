import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dryrun, message, createDataItemSigner, result } from "@permaweb/aoconnect";
import { PermissionType } from 'arconnect'

import Footer from './Footer';

const TRUNK = "wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ"
const wAR = "xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10"

const permissions: PermissionType[] = [
  'ACCESS_ADDRESS',
  'SIGNATURE',
  'SIGN_TRANSACTION',
  'DISPATCH'
]

interface Tag {
    name: string;
    value: string;
}

function Trunk() {
    const [address, setAddress] = useState('')
    const [trunkBalance, setTrunkBalance] = useState(0)
    const [credBalance, setCredBalance] = useState(0)
    const [credValue, setCredValue] = useState('')
    const [stakeValue, setStakeValue] = useState('')
    const [swapSuccess, setSwapSuccess] = useState(false)
    const [stakeSuccess, setStakeSuccess] = useState(false)
    const [staker, setStaker] = useState(false)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case "stake":
                setStakeValue(value);
                break;
            case "swap":
                setCredValue(value);
                break;
            default:
                break;
        }
    };

    const fetchAddress =  async () => {
        await window.arweaveWallet.connect(
            permissions,
            {
                name: "TRUNK",
                logo: "4eTBOaxZSSyGbpKlHyilxNKhXbocuZdiMBYIORjS4f0"
            }
        )
        try {
            const address = await window.arweaveWallet.getActiveAddress()
            setAddress(address)
        } catch(error) {
            console.error(error)
        }
    }

    const swap = async () => {
        var value = parseInt(credValue)
        var units = value * 1000
        var credUnits = units.toString()
        try {
            const getSwapMessage = await message({
                process: CRED,
                tags: [
                    { name: 'Action', value: 'Transfer' },
                    { name: 'Recipient', value: TRUNK },
                    { name: 'Quantity', value: credUnits }
                ],
                signer: createDataItemSigner(window.arweaveWallet),
            });
            try {
                let { Messages, Error } = await result({
                    message: getSwapMessage,
                    process: CRED,
                });
                if (Error) {
                    alert("Error handling swap:" + Error);
                    return;
                }
                if (!Messages || Messages.length === 0) {
                    alert("No messages were returned from ao. Please try later.");
                    return; 
                }
                const actionTag = Messages[0].Tags.find((tag: Tag) => tag.name === 'Action')
                if (actionTag.value === "Debit-Notice") {
                    setSwapSuccess(true)
                }
            } catch (error) {
                alert("There was an error when swapping CRED for TRUNK: " + error)
            }
        } catch (error) {
            alert('There was an error swapping: ' + error)
        }
    }

    const stake = async () => {
        var value = parseInt(stakeValue)
        var units = value * 1000
        var trunkUnits = units.toString()
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
            try {
                let { Messages, Error } = await result({
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
                setStakeSuccess(true)
            } catch (error) {
                alert("There was an error when staking TRUNK: " + error)
            }
        } catch (error) {
            alert('There was an error staking: ' + error)
        }
    }

    useEffect(() => {
        const fetchBalance = async (process: string) => {
            if (address) {
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

        const fetchStakers = async () => {
            if (address) {
                try {
                    const messageResponse = await dryrun({
                        process: TRUNK,
                        tags: [
                            { name: 'Action', value: 'Get-Stakers' },
                        ],
                    });
                    const stakers = JSON.parse(messageResponse.Messages[0].Data)
                    const stakerAddresses = Object.keys(stakers)
                    const isStaker = stakerAddresses.includes(address)
                    if (isStaker) {
                        setStaker(true)
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }

        fetchBalance(TRUNK)
        fetchBalance(CRED)
        fetchStakers()
    }, [address, swapSuccess])

	return (
        <div>
            <div className='md:w-1/3 h-[450px] my-20 md:my-40 mx-8 md:mx-auto border border-gray rounded'>
                {address ?
                    (
                        <div>
                            <p className='text-center mt-4'>
                                Address: <span className='font-bold'>{`${address.slice(0, 5)}...${address.slice(-3)}`}</span>
                            </p>
                            <div className='grid grid-cols-2 gap-2 my-8'>
                                <div className='border-r border-black'>
                                    <p className='text-lg text-center'>
                                        CRED: <span className='font-bold'>{credBalance}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className='text-lg text-center'>
                                    TRUNK: <span className='font-bold'>{trunkBalance}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) :
                    (
                        <p className='text-center mt-44'>
                            <button onClick={fetchAddress} className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                                Connect 
                            </button>
                        </p>
                    )
                }
                { address && credBalance > 0 ? 
                    (
                        <div>
                            <div className="flex flex-col space-y-2 items-center justify-center mt-8">
                            <input
                                type="text"
                                name="swap"
                                placeholder="Enter value of CRED to swap"
                                value={credValue}
                                onChange={handleInputChange}
                                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                className="py-2 px-4 bg-black text-white font-semibold rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                onClick={swap}
                            >
                                Swap
                            </button>
                            </div>
                        </div>
                    ) : 
                    (
                        <div></div>
                    )
                }
                {address && credBalance === 0 ? 
                    (
                        <div>
                            <p className='text-sm text-center'>Get CRED by completing <a href="https://cookbook_ao.g8way.io/tutorials/begin/index.html" target="_blank" rel="noopener noreferrer" className='font-bold underline'>quests on ao</a>.</p>
                        </div>
                    ) :
                    (
                        <div></div>
                    )
                }
                { swapSuccess || trunkBalance > 0 ?
                    (
                        <div>
                            <div className="flex flex-col space-y-2 items-center justify-center mt-8">
                            <input
                                type="text"
                                name="stake"
                                placeholder="Enter value of TRUNK to stake"
                                value={stakeValue}
                                onChange={handleInputChange}
                                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                className="py-2 px-4 bg-black text-white font-semibold rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                onClick={stake}
                            >
                                Stake TRUNK
                            </button>
                            </div>
                        </div>
                    )
                    :
                    (
                        <div></div>
                    )  
                }
                { stakeSuccess ? <div><p className='text-sm text-center my-2'>You have staked TRUNK successfully. Please visit the <Link className='font-bold underline' to={"/vote/"}>vote page</Link> to cast votes on different memeframes!</p></div> : <div></div>}
                { staker ? <p className='text-sm text-center my-2'>You are already staking!<br/>Please visit the <Link className='font-bold underline' to={"/vote/"}>vote page</Link> to cast your vote.</p> : <div></div>}
            </div>
            <Footer />
        </div>
		
	);
}

export default Trunk;
