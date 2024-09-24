import { dryrun, message, createDataItemSigner, result } from "@permaweb/aoconnect";
import { PermissionType } from 'arconnect';

const TRUNK = "OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww";
const VOTER = "7QfXjBhW2sU3FJfPJ7t-_Cn8ScoZuzQOPSprNC4q_CE"; //"aajbSwRdSrIIErliiiXDvHVUkauSPa2vmBATGkjDcf4";

const permissions: PermissionType[] = [
    'ACCESS_ADDRESS',
    'SIGNATURE',
    'SIGN_TRANSACTION',
    'DISPATCH'
];

interface StakerInfo {
    amount: string;
    unstake_at?: number;
}

interface StakerResult {
    success: boolean;
    amount?: string;
    message?: string;
}

interface Tag {
    name: string;
    value: string;
}

export const GetAddressStakedTrunkAmount = async (address: string): Promise<number> => {
    try {
        console.log("Getting stakers...");
        const result = await dryrun({
            process: TRUNK,
            tags: [
                { name: 'Action', value: "Stakers" }
            ]
        });
        if (result && result.Messages && result.Messages[0]) {
            try {
                const allStakers: { [key: string]: StakerInfo } = JSON.parse(result.Messages[0].Data);
                if (allStakers.hasOwnProperty(address)) {
                    console.log("You have staked: ", allStakers[address].amount);
                    return parseFloat(allStakers[address].amount) / 1000;
                } else {
                    console.log("No staked amount found for the provided address.");
                    return 0;
                }
            } catch (parseError) {
                console.error("Error parsing data: ", parseError);
                return 0;
            }
        } else {
            console.log("No readable data from dryrun!");
            return 0;
        }
    } catch (e) {
        console.error("Error: ", (e as Error).message);
        return 0;
    }
};

export const GetTrunkBalance = async (address: string): Promise<number> => { 
    if (address) {
        console.log( "Fetching balance for :" + address);
        try {
            const messageResponse = await dryrun({
                process: TRUNK,
                tags: [
                    { name: 'Action', value: 'Balance' },
                    { name: 'Recipient', value: address },
                ],
            });
            const balanceTag = messageResponse.Messages[0].Tags.find((tag: Tag) => tag.name === 'Balance')
            const balance = balanceTag ? parseFloat((balanceTag.value / 1000).toFixed(4)) : 0;
            return balance;

        } catch (error) {
            console.error(error);
            return 0;
        }
    } else 
    {
        return 0;
    }
};

export const StakeTrunk = async (amount: string): Promise<string> => { 
        const value = parseInt(amount);
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
                // alert("Error handling staking:" + Error);
                return "Error handling staking:" + Error;
            }
            if (!Messages || Messages.length === 0) {
                // alert("No messages were returned from ao. Please try later.");
                return "No messages were returned from ao. Please try later."; 
            }
            // alert('Stake successful!');
            return "Success"; //Messages[0].tx;
        } catch (error) {
            // alert('There was an error staking: ' + error);
            return "Error";
        }
};

export const UnstakeTrunk = async (amount: string): Promise<string> => { 
    const value = parseInt(amount);
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
                // alert("Error handling unstaking:" + Error);
                return "Error handling unstaking:" + Error;
            }
            if (!Messages || Messages.length === 0) {
                //  alert("No messages were returned from ao. Please try later.");
                return "No messages were returned from ao. Please try later."; 
            }
            // Optionally, handle success (e.g., updating UI or state)
            // alert('Unstake successful!');
            return "Success";
        } catch (error) {
            // alert('There was an error unstaking: ' + error);
            return "Error";
        }
};
    
export const FetchAddress = async () => { 
    console.log("Fetching address...");
    try {
        // Check if ArConnect is available
        if (window.arweaveWallet) {
            console.log("ArConnect is installed.");
          try {
            // Try to get permissions without prompting the user again if they're already connected
            const currentPermissions = await window.arweaveWallet.getPermissions();
            if (!currentPermissions.includes('ACCESS_ADDRESS')) {
              // Connect if ACCESS_ADDRESS permission hasn't been granted yet
              await window.arweaveWallet.connect(permissions, {
                name: "TRUNK",
                logo: "4eTBOaxZSSyGbpKlHyilxNKhXbocuZdiMBYIORjS4f0",
              });
            }
            // Fetch the active address
            const address = await window.arweaveWallet.getActiveAddress();
            console.log("Connected: ", address);
          } catch (error) {
            console.error("Error connecting to ArConnect:", error);
          }
        } else {
          console.log("ArConnect not installed.");
        }   
      } catch (error) {
        console.error("Failed to fetch address:", error);
      }

    // await window.arweaveWallet.connect(permissions, {
    //     name: "TRUNK",
    //     logo: "4eTBOaxZSSyGbpKlHyilxNKhXbocuZdiMBYIORjS4f0"
    // });
    // try {
    //     const address = await window.arweaveWallet.getActiveAddress();
    //     console.log("Address: ", address);
    // } catch (error) {
    //     console.error(error);
    // }
};

// name, iconURL, siteURL, stake, owner
export const SubmitNewProject = async (name: string, iconURL: string, siteURL: string, stake: string, owner: string ): Promise<string> => { 
    console.log("Submiting New Project: " +name + " " + iconURL + " " + siteURL + " " + stake + " " + owner);
    
    // const value = parseInt(stake);
    // const units = value * 1000;
    // const trunkUnits = units.toString();

    // console.log("Staking Value:", value);
    // console.log("Units to Stake:", units);
    // console.log("Request Payload:", trunkUnits);

    // -- Get TRUNK balance
    // try {
    //     const balance = await GetTrunkBalance(owner);
    //     console.log("Owner Balance: ", balance);

    //     if (balance > parseFloat("0.001")) {
    //         console.log("Owner can add project");
    //         return "Owner can add project";
    //     } else {
    //         console.log("Owner does not have enough balance to stake.");
    //         return "Owner does not have enough balance to stake.";
    //     }
        
    // } catch (error) {
    //     console.log('There was an error adding project: ' + error);
    //     return "Error";
    // }
    
    const stakeResult = await SendTrunk( "10", owner, "aajbSwRdSrIIErliiiXDvHVUkauSPa2vmBATGkjDcf4" );
    console.log("Stake Result: " + stakeResult);

    if(stakeResult === "Success") {

        try {

            // Send the project objects
            const getResult = await message({
                process: VOTER,
                tags: [
                    { name: 'Action', value: 'Add-Project' },
                    { name: 'Name', value: name },
                    { name: 'IconURL', value: iconURL },
                    { name: 'SiteURL', value: siteURL },
                    { name: 'Stake', value: stake },
                    { name: 'ProjectOwner', value: owner },
                ],
                signer: createDataItemSigner(window.arweaveWallet),
            });
            const { Messages, Error } = await result({
                message: getResult,
                process: VOTER,
            });
            if (Error) {
                console.log("Error:" + Error);
                return "Error:" + Error;
            }
            if (!Messages || Messages.length === 0) {
                console.log("No messages were returned from ao. Please try later.");
                return "No messages were returned from ao. Please try later."; 
            }
            console.log('Project added successfully!');
            return "Success";
        } catch (error) {
            console.log('There was an error adding project: ' + error);
            return "Error";
        }

    } else {
        console.log("Error Staking: " + stakeResult);
        return "Error Staking: " + stakeResult;
    }
   

};

export const CheckOwnerBalance = async (amount: string, owner: string ): Promise<string> => { 
    console.log("Checking Owner Balance: " + amount + " " + owner);
    
    // const value = parseInt(stake);
    // const units = value * 1000;
    // const trunkUnits = units.toString();

    // console.log("Staking Value:", value);
    // console.log("Units to Stake:", units);
    // console.log("Request Payload:", trunkUnits);

    try {
        const getBalance = await message({
            process: owner,
            tags: [
                { name: 'Target', value: 'OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww' },
                { name: 'Action ', value: "Balance" },
            ],
            signer: createDataItemSigner(window.arweaveWallet),
        });
        const { Messages, Error } = await result({
            message: getBalance,
            process: owner,
        });

        if (Error) {
            console.log("Error:" + Error);
            return "Error:" + Error;
        }
        if (!Messages || Messages.length === 0) {
            console.log("No messages were returned from ao. Please try later.");
            return "No messages were returned from ao. Please try later."; 
        }
        console.log('Project added successfully!');
        return "Success";
    } catch (error) {
        console.log('There was an error adding project: ' + error);
        return "Error";
    }

};

export const SendTrunk = async (amount: string, sender : string, recipient : string): Promise<string> => { 

    console.log("Sending Trunk: " + amount + " Sender:" + sender + " Recipient:" + recipient);

    const value = parseInt(amount);
    const units = value * 1000;
    const trunkUnits = units.toString();
    console.log("Send Value:", value);
    console.log("Units to Send:", units);
    console.log("Send Payload:", trunkUnits);

    //Send({ Target = "Sa0iBLPNyJQrwpTTG-tWLQU-1QeUAJA73DdxGGiKoJc", Action = "Transfer", Quantity = "300000", Recipient = "eqWPXgEngDqBptVFmSlJT0YC9wgyAD4U8l1wrqKu_WE" })

    // Send 0.001 TRUNK
    // const sendTrunk = await message({
    //     process: owner,
    //     tags: [
    //         { name: 'Action', value: 'Transfer' },
    //         { name: 'Quantity', value: "0.001" },
    //         { name: 'Recipient', value: VOTER },
    //     ],
    //     signer: createDataItemSigner(window.arweaveWallet),
    // });
    // const { mess, err } = await result({
    //     message: sendTrunk,
    //     process: VOTER,
    // });

    try {
        const sendTrunk = await message({
            process: TRUNK,
            tags: [
                { name: 'Action', value: 'Transfer' },
                { name: 'Recipient', value: recipient },
                { name: 'Quantity', value: amount },
                { name: 'Sender', value: sender },
                
            ],
            signer: createDataItemSigner(window.arweaveWallet),
        });
        const { Messages, Error } = await result({
            message: sendTrunk,
            process: TRUNK,
        });
        if (Error) {
            return "Error sending:" + Error;
        }
        if (!Messages || Messages.length === 0) {
            return "No messages were returned from ao. Please try later."; 
        }
        const actionTag = Messages[0].Tags.find((tag: Tag) => tag.name === 'Action')
        if (actionTag.value === "Debit-Notice") {
            console.log("Debit-Notice: ", actionTag.value);
            console.log("From: ", Messages[0].Target);
        }
        return "Success"; //Messages[0].tx;
    } catch (error) {
        return "Error";
    }
};

// Send({ Target = ao.id, Action = "Get-Project" })
export const GetProjects = async () => { 
    console.log("Get-Project...");
    try {
        const result = await dryrun({
            process: VOTER,
            tags: [
                { name: 'Action', value: 'Get-Project' },
            ],
            signer: createDataItemSigner(window.arweaveWallet),
        });
        if (result) {
            return result.Messages[0].Data;
          } else {
            console.log("Got no response from dryrun!")
          }
    } catch (error) {
        return "Error";
    }
};

// Send({ Target = ao.id, Action = "Get-Top-Projects" })
export const GetTopProjects = async () => { 
    console.log("Get-Top-Projects...");
    try {
        const result = await dryrun({
            process: VOTER,
            tags: [
                { name: 'Action', value: 'Get-Top-Projects' },
            ],
            signer: createDataItemSigner(window.arweaveWallet),
        });
        if (result) {
            return result.Messages[0].Data;
          } else {
            console.log("Got no response from dryrun!")
          }
    } catch (error) {
        return "Error";
    }
};