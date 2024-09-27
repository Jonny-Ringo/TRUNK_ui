import React, { useEffect, useState } from 'react';
import { dryrun, message, createDataItemSigner, result  } from "@permaweb/aoconnect";
import { PermissionType } from 'arconnect';
import { GetProjects, GetProjectVotes, SortProjectsByVotes } from '../app_wheel/MiscTools';
import ProjectsList from './ProjectsList';
import AddProject from './AddProject';
import { useGlobalContext } from '../GlobalProvider';
import Spinner from '../app_wheel/Spinner';

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
    totalVotes: number;
}

interface ProjectVote {
  Stake: number;
  Owner: string;
  ID : number;
}

interface VoterModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  address: string;
}

const TRUNK = "wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ"; //OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww
const VOTER = "FdEWGam9Jv5l8b5t3a5buqvzIZz8c_Z2oJ4eDnlylt4"; //"7QfXjBhW2sU3FJfPJ7t-_Cn8ScoZuzQOPSprNC4q_CE" //aajbSwRdSrIIErliiiXDvHVUkauSPa2vmBATGkjDcf4

const VoterModal: React.FC<VoterModalProps> = ({ isOpen, setIsOpen, address }) => {

    const {
      PROJECTS, 
      setPROJECTS,
      VOTES,
      setVOTES
    } = useGlobalContext();

    const [isLoading, setIsLoading] = useState(false);
    const [loadMessage, setLoadMessage] = useState('');

    const [Projects, setProjects] = useState<ProjectInfo[]>([]);
    const [addProjectOpen, setAddProjectOpen] = useState(false);
    const [projectsLoaded, setProjectsLoaded] = useState(false);

    useEffect(() => {
        console.log("VoterModal Address: ", address);
    }, [address]);

    useEffect(() => {
      if(!isOpen) {
        console.log("Voter Modal is closed");
      } else {
        console.log("Voter Modal is open");
        setIsLoading(true);
        GetAllProjects();
      }
  }, [isOpen]);

  useEffect(() => {
    
    if( projectsLoaded ) {
        const sortedByVote = SortProjectsByVotes(PROJECTS, VOTES); console.log("Sorted By Vote: ", sortedByVote);
        setProjects(sortedByVote);
    } else {
        setProjects([]);
    }

  }, [projectsLoaded]);

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
        };
    
        setupIframe();
    }, []);

    const GetAllProjects = async () => {

      const fetchProjects = async () => {

        setProjects([]); // Clear Projects
        setProjectsLoaded(false);

          const processResponse = await GetProjects();
          // console.log("Process Response: ", processResponse);

          const json: ProjectInfo[] = JSON.parse(processResponse);
          setPROJECTS(json);
      };

      const fecthVotes = async () => {
          const processResponse = await GetProjectVotes();
          // console.log("Process Response: ", processResponse);

          const json: ProjectVote[] = JSON.parse(processResponse);
          setVOTES(json);
          setProjectsLoaded(true);
          setIsLoading(false);
      };

      fetchProjects();
      fecthVotes();
    }

    if (!isOpen) return null;

    const onClose =  () => {
        setIsOpen(false);
    };

    const onAddProjectOpen =  () => {
      setAddProjectOpen(true);
  };

  function LoadedModalRender() {
    return (
        <>
          <button 
              onClick={onClose} 
              className="absolute top-3 right-3 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Close Modal"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button>

          <ProjectsList Projects={Projects} setProjects={setProjects} setIsOpen={setIsOpen} />

          <AddProject isOpen={addProjectOpen} onClose={() => setAddProjectOpen(false)} address={address}
            setIsOpen={setIsOpen}/>

          <button className="bg-[#12121C] text-white rounded-lg p-2 z-10 hover:bg-slate-50 focus:outline-none hover:text-black" 
              onClick={(e) => {
                  e.stopPropagation();
                  onAddProjectOpen();
              }} >

              Add Project
          </button>
        </>
      );
  }

  function LoadingRenderer() {
      return (
        <>

          <Spinner />

          <div className="flex flex-col items-center justify-center"> {loadMessage} </div> 

        </>
      );
  }

  function DisconnectedRenderer() {
      return (
        <>
          <div className="flex flex-col items-center justify-center"> Disconnected </div> 
        </>
      );
  }

  function MainRenderer() {
      return (
      <>
          { address === "" ? DisconnectedRenderer() :  LoadedModalRender()}
      </>
      );
  }


    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex" onClick={onClose}>
        <div className="relative p-6 bg-[#1A1B2D] w-full max-w-md m-auto flex-col flex rounded-lg border-8 border-[#12121C] z-10" onClick={(e) => e.stopPropagation()}>

        { isLoading ? LoadingRenderer() : MainRenderer() }

        </div>
      </div>
    );
  }
  
  export default VoterModal;