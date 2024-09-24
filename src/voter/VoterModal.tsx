import React, { useEffect, useState } from 'react';
import { dryrun, message, createDataItemSigner, result  } from "@permaweb/aoconnect";
import { PermissionType } from 'arconnect';
import { GetAddressStakedTrunkAmount, GetTrunkBalance, StakeTrunk, UnstakeTrunk, FetchAddress } from '../app_wheel/MiscTools';
import ProjectsList from './ProjectsList';
import AddProject from './AddProject';

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

interface VoterModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  address: string;
}

const TRUNK = "OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww"
const VOTER = "7QfXjBhW2sU3FJfPJ7t-_Cn8ScoZuzQOPSprNC4q_CE" //"aajbSwRdSrIIErliiiXDvHVUkauSPa2vmBATGkjDcf4"


const fakeProjects: ProjectInfo[] = [
  {
    Name: "Project Alpha",
    IconURL: "https://via.placeholder.com/40x40.png?text=PA",
    SiteURL: "https://projectalpha.com",
    Stake: 1200,
    Owner: "John Doe"
  },
  {
    Name: "Project Beta",
    IconURL: "https://via.placeholder.com/40x40.png?text=PB",
    SiteURL: "https://projectbeta.com",
    Stake: 2500,
    Owner: "Jane Smith"
  },
  {
    Name: "Project Gamma",
    IconURL: "https://via.placeholder.com/40x40.png?text=PG",
    SiteURL: "https://projectgamma.com",
    Stake: 3000,
    Owner: "Alice Johnson"
  },
  {
    Name: "Project Delta",
    IconURL: "https://via.placeholder.com/40x40.png?text=PD",
    SiteURL: "https://projectdelta.com",
    Stake: 4500,
    Owner: "Bob Williams"
  },
  {
    Name: "Project Epsilon",
    IconURL: "https://via.placeholder.com/40x40.png?text=PE",
    SiteURL: "https://projectepsilon.com",
    Stake: 1800,
    Owner: "Charlie Brown"
  },
  {
    Name: "Project Zeta",
    IconURL: "https://via.placeholder.com/40x40.png?text=PZ",
    SiteURL: "https://projectzeta.com",
    Stake: 3700,
    Owner: "Diana Prince"
  },
  {
    Name: "Project Eta",
    IconURL: "https://via.placeholder.com/40x40.png?text=PE",
    SiteURL: "https://projecteta.com",
    Stake: 600,
    Owner: "Bruce Wayne"
  },
  {
    Name: "Project Theta",
    IconURL: "https://via.placeholder.com/40x40.png?text=PT",
    SiteURL: "https://projecttheta.com",
    Stake: 5000,
    Owner: "Clark Kent"
  },
  {
    Name: "Project Iota",
    IconURL: "https://via.placeholder.com/40x40.png?text=PI",
    SiteURL: "https://projectiota.com",
    Stake: 1100,
    Owner: "Peter Parker"
  },
  {
    Name: "Project Kappa",
    IconURL: "https://via.placeholder.com/40x40.png?text=PK",
    SiteURL: "https://projectkappa.com",
    Stake: 3600,
    Owner: "Tony Stark"
  },
  {
    Name: "Project Lambda",
    IconURL: "https://via.placeholder.com/40x40.png?text=PL",
    SiteURL: "https://projectlambda.com",
    Stake: 2100,
    Owner: "Steve Rogers"
  },
  {
    Name: "Project Mu",
    IconURL: "https://via.placeholder.com/40x40.png?text=PM",
    SiteURL: "https://projectmu.com",
    Stake: 4900,
    Owner: "Natasha Romanoff"
  },
  {
    Name: "Project Nu",
    IconURL: "https://via.placeholder.com/40x40.png?text=PN",
    SiteURL: "https://projectnu.com",
    Stake: 2500,
    Owner: "Bruce Banner"
  },
  {
    Name: "Project Xi",
    IconURL: "https://via.placeholder.com/40x40.png?text=PX",
    SiteURL: "https://projectxi.com",
    Stake: 3900,
    Owner: "Diana Prince"
  },
  {
    Name: "Project Omicron",
    IconURL: "https://via.placeholder.com/40x40.png?text=PO",
    SiteURL: "https://projectomicron.com",
    Stake: 800,
    Owner: "Carol Danvers"
  },
  {
    Name: "Project Pi",
    IconURL: "https://via.placeholder.com/40x40.png?text=PP",
    SiteURL: "https://projectpi.com",
    Stake: 1800,
    Owner: "T'Challa"
  },
  {
    Name: "Project Rho",
    IconURL: "https://via.placeholder.com/40x40.png?text=PR",
    SiteURL: "https://projectrho.com",
    Stake: 700,
    Owner: "Stephen Strange"
  },
  {
    Name: "Project Sigma",
    IconURL: "https://via.placeholder.com/40x40.png?text=PS",
    SiteURL: "https://projectsigma.com",
    Stake: 3100,
    Owner: "Bucky Barnes"
  },
  {
    Name: "Project Tau",
    IconURL: "https://via.placeholder.com/40x40.png?text=PT",
    SiteURL: "https://projecttau.com",
    Stake: 4000,
    Owner: "Wanda Maximoff"
  },
  {
    Name: "Project Upsilon",
    IconURL: "https://via.placeholder.com/40x40.png?text=PU",
    SiteURL: "https://projectupsilon.com",
    Stake: 2300,
    Owner: "Sam Wilson"
  }
];


const VoterModal: React.FC<VoterModalProps> = ({ isOpen, setIsOpen, address }) => {

    const [Projects, setProjects] = useState<ProjectInfo[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addProjectOpen, setAddProjectOpen] = useState(false);

    useEffect(() => {
        console.log("VoterModal Address: ", address);
    }, [address]);

    

    
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
            
            <ProjectsList Projects={fakeProjects} />

            <AddProject isOpen={addProjectOpen} onClose={() => setAddProjectOpen(false)} address={address} />

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