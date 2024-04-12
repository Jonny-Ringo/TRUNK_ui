import { dryrun } from "@permaweb/aoconnect";
import { PermissionType } from 'arconnect';

const TRUNK = "OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww";

interface StakerInfo {
    amount: string;
    unstake_at?: number;
}

interface StakerResult {
    success: boolean;
    amount?: string;
    message?: string;
}

// export const GetAddressStakedTrunk = async (address: string): Promise<StakerResult> => {
//     try {
//         console.log("Getting stakers...");
//         const result = await dryrun({
//             process: TRUNK,
//             tags: [
//                 { name: 'Action', value: "Stakers" }
//             ]
//         });
//         if (result && result.Messages && result.Messages[0]) {
//             try {
//                 const allStakers: { [key: string]: StakerInfo } = JSON.parse(result.Messages[0].Data);
//                 if (allStakers.hasOwnProperty(address)) {
//                     console.log("You have staked: ", allStakers[address].amount);
//                     return { success: true, amount: allStakers[address].amount };
//                 } else {
//                     console.log("No staked amount found for the provided address.");
//                     return { success: false, message: "Address not found" };
//                 }
//             } catch (parseError) {
//                 console.error("Error parsing data: ", parseError);
//                 return { success: false, message: "Error parsing data" };
//             }
//         } else {
//             console.log("No readable data from dryrun!");
//             return { success: false, message: "No readable data available" };
//         }
//     } catch (e) {
//         console.error("Error: ", (e as Error).message);
//         return { success: false, message: (e as Error).message };
//     }
// };


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
                    // Convert and return the amount as a number
                    return parseFloat(allStakers[address].amount);
                } else {
                    console.log("No staked amount found for the provided address.");
                    return 0;  // Return 0 or throw an error if address is not found
                }
            } catch (parseError) {
                console.error("Error parsing data: ", parseError);
                return 0;  // Return 0 or decide on an error handling strategy
            }
        } else {
            console.log("No readable data from dryrun!");
            return 0;  // Return 0 or handle the absence of data appropriately
        }
    } catch (e) {
        console.error("Error: ", (e as Error).message);
        return 0;  // Return 0 or use a specific error value or throw
    }
};


export default GetAddressStakedTrunkAmount;
