import React, { useEffect, useState } from 'react';
import { dryrun, message, createDataItemSigner, result  } from "@permaweb/aoconnect";
import { PermissionType } from 'arconnect';
import { GetAddressStakedTrunkAmount, GetTrunkBalance, StakeTrunk, UnstakeTrunk, FetchAddress } from '../app_wheel/MiscTools';
import ProjectsList from './ProjectsList';

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

interface ProjectInfo {
    Name: string;
    IconURL: string;
    SiteURL: string;
    Stake: number;
    Owner: string;
}


const TRUNK = "OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww"
const VOTER = "aajbSwRdSrIIErliiiXDvHVUkauSPa2vmBATGkjDcf4"

function VoterModal () {

    const [Projects, setProjects] = useState<ProjectInfo[]>([]);

    
    useEffect(() => {

        const getAllStakers = async () => {
          try {
            const result = await dryrun({
              process: TRUNK,
              tags: [{ name: 'Action', value: "Stakers" }]
            });
            if (result) {
              return result.Messages[0].Data;
            } else {
              console.log("Got no response from dryrun!")
            }
          } catch (e) {
            console.log(e);
          }
        };
    
        const setupIframe = async () => {
            const processResponse = await getAllStakers();
            const json = JSON.parse(processResponse);
            
            const allStakers: { [key: string]: StakerInfo } = json;
            console.log("All Stakers: ", allStakers);

            if (allStakers.hasOwnProperty("eqWPXgEngDqBptVFmSlJT0YC9wgyAD4U8l1wrqKu_WE")) {
                console.log("You have staked: ", allStakers["eqWPXgEngDqBptVFmSlJT0YC9wgyAD4U8l1wrqKu_WE"].amount);
                return parseFloat(allStakers["eqWPXgEngDqBptVFmSlJT0YC9wgyAD4U8l1wrqKu_WE"].amount) / 1000;
            } else {
                console.log("No staked amount found for the provided address.");
                return 0;
            }
        };
    
        setupIframe();
    }, []);

    const GetAllProjects = async () => {
        
        const GetAllProjects = async () => {
            console.log("Getting all projects");
            try {
              const result = await dryrun({
                process: VOTER,
                tags: [{ name: 'Action', value: "Get-Project" }]
              });
              if (result) {
                    return result.Messages[0].Data;
              } else {
                console.log("Got no response from dryrun!")
              }
            } catch (e) {
              console.log(e);
            }
          };

          const SortProjects = async () => {
            const processResponse = await GetAllProjects();
            const projectsData: ProjectInfo[] = processResponse;
            setProjects(projectsData);
            
            // const json = JSON.parse(processResponse);
            console.log("Projects: ", projectsData);
        };
    
        SortProjects();

    }

    useEffect(() => {
        GetAllProjects();
    }, []);

    useEffect(() => {
        // GetTopProject();
        console.log("Projects: ", Projects);
    }, [Projects]);

    const GetTopProject = () => {
        if( Projects.length > 0 ) {
            const topProject = Projects[0];
            console.log("Top Project: ", topProject);
        }
    };

    // useEffect(() => {

    //     const getWebsite = async () => {
    //       try {
    //         const result = await dryrun({
    //           process: TRUNK,
    //           tags: [{ name: 'Action', value: "Get-Frame" }]
    //         });
    //         if (result) {
    //           return result.Messages[0].Data;
    //         } else {
    //           console.log("Got no response from dryrun!")
    //           return INITIAL_FRAME
    //         }
    //       } catch (e) {
    //         console.log(e);
    //       }
    //     };
    
    //     const setupIframe = async () => {
    //       const processResponse = await getWebsite();
    //       const url = `https://arweave.net/${processResponse}`;
    //       console.log("URL", url);
    //     };
    
    //     setupIframe();
    //   }, []);


    return (
        <div className="relative p-8 bg-[#1A1B2D] w-full max-w-md m-auto flex-col flex rounded-lg border-8 border-[#12121C] z-10">
            <ProjectsList Projects={Projects} />
        </div>
      );
  }
  
  export default VoterModal;