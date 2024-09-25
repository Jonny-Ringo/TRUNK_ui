import React, { useEffect, useState } from 'react';
import { dryrun, message, createDataItemSigner, result  } from "@permaweb/aoconnect";
import { PermissionType } from 'arconnect';
import { SendVoteForProject } from '../app_wheel/MiscTools';
import ProjectsList from './ProjectsList';
import AddProject from './AddProject';
import { useGlobalContext } from '../GlobalProvider';

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
    ID : number;
}

interface VoterModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  address: string;
}

const TRUNK = "wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ" //OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww
const VOTER = "7QfXjBhW2sU3FJfPJ7t-_Cn8ScoZuzQOPSprNC4q_CE" //aajbSwRdSrIIErliiiXDvHVUkauSPa2vmBATGkjDcf4

const VoterModal: React.FC<VoterModalProps> = ({ isOpen, setIsOpen, address }) => {

    const {
      PROJECTS, 
      setPROJECTS
    } = useGlobalContext();

    const [Projects, setProjects] = useState<ProjectInfo[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addProjectOpen, setAddProjectOpen] = useState(false);

    useEffect(() => {
        console.log("VoterModal Address: ", address);
    }, [address]);

    useEffect(() => {
      if(!isOpen) {
        console.log("Voter Modal is closed");
      } else {
        console.log("Voter Modal is open");
        GetAllProjects();
      }
  }, [isOpen]);

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

            // if (allStakers.hasOwnProperty("eqWPXgEngDqBptVFmSlJT0YC9wgyAD4U8l1wrqKu_WE")) {
            //     console.log("You have staked: ", allStakers["eqWPXgEngDqBptVFmSlJT0YC9wgyAD4U8l1wrqKu_WE"].amount);
            //     return parseFloat(allStakers["eqWPXgEngDqBptVFmSlJT0YC9wgyAD4U8l1wrqKu_WE"].amount) / 1000;
            // } else {
            //     console.log("No staked amount found for the provided address.");
            //     return 0;
            // }
        };
    
        setupIframe();
    }, []);

    const GetAllProjects = async () => {
        
        const fetchProjects = async () => {
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
            const processResponse = await fetchProjects();

            const json: ProjectInfo[] = JSON.parse(processResponse);
            setProjects(json);
            setPROJECTS(json); // Set the globals too
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

    if (!isOpen) return null;

    const onClose =  () => {
        setIsOpen(false);
    };

    const onAddProjectOpen =  () => {
      setAddProjectOpen(true);
  };

    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex" onClick={onClose}>
        <div className="relative p-6 bg-[#1A1B2D] w-full max-w-md m-auto flex-col flex rounded-lg border-8 border-[#12121C] z-10" onClick={(e) => e.stopPropagation()}>

          <button 
              onClick={onClose} 
              className="absolute top-3 right-3 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Close Modal"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button>

        <ProjectsList Projects={Projects} setIsOpen={setIsOpen} />

            <AddProject isOpen={addProjectOpen} onClose={() => setAddProjectOpen(false)} address={address}
             setIsOpen={setIsOpen}/>

            <button className="bg-[#2F80ED] text-white rounded-lg p-2 z-10" 
                onClick={(e) => {
                    e.stopPropagation();
                    onAddProjectOpen();
                }}
            >
                Add Project
            </button>
        </div>


    </div>

    );
  }
  
  export default VoterModal;