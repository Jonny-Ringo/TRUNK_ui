import { dryrun, message, createDataItemSigner, result } from "@permaweb/aoconnect";
import { PermissionType } from 'arconnect';

const TRUNK = "OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww";

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
                alert("Error handling staking:" + Error);
                return "";
            }
            if (!Messages || Messages.length === 0) {
                alert("No messages were returned from ao. Please try later.");
                return ""; 
            }
            alert('Stake successful!');
            return "Success"; //Messages[0].tx;
        } catch (error) {
            alert('There was an error staking: ' + error);
            return "Error";
        }
};

export const UnstakeTrunk = async (amount: string) => { 
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