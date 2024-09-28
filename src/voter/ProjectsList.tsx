import React, { useEffect, useState } from 'react';
import { SendVoteForProject, VoteForProject, GetTrunkBalance } from '../app_wheel/MiscTools';
import { useGlobalContext } from '../GlobalProvider';
import Swal from 'sweetalert2';

interface ProjectInfo {
    Name: string;
    IconURL: string;
    SiteURL: string;
    Stake: number;
    Owner: string;
    ID: number;
    totalVotes: number;
  }

interface ProjectsListProps {
    Projects: ProjectInfo[];
    setProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


function ProjectsList ( { Projects , setProjects,  setIsOpen }: ProjectsListProps ) {

    const {
        ADDRESS
    } = useGlobalContext();

    const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);
    const [trunkBalance, setTrunkBalance] = useState<number>(0);

    function FormatStake( amount : number ) {
        const formated = amount / 1000;
        return formated;
    }

    const showSuccess = ( project : ProjectInfo ) => {

        Swal.fire({
          title: "" + project.Name,
          text: `You voted for ${project.Name} with your ${trunkBalance} Trunk`,
          color: "white",
          icon: 'success',
          confirmButtonText: 'Done',
          background: '#2a2c49',
        });
      };

    const showFail = () => {
        Swal.fire({
          title: 'Vote Cancelled',
          text: 'Vote Not Submitted',
          color: "white",
          icon: 'error',
          confirmButtonText: 'Done',
          background: '#2a2c49',
        });
      };

      const handleVote = (project: ProjectInfo) => {

        setSelectedProject(project);
        console.log("Project: ", project.Name);

        Swal.fire({
            title: `Vote ${trunkBalance} Trunk for ${project.Name}?`,
            text: `No Trunk will be removed from your wallet to vote.`,
            color: "white",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Vote!',
            cancelButtonText: 'No, Cancel',
            background: '#2a2c49',
            reverseButtons: true,
            customClass: {
                confirmButton: 'swal-confirm-button',
                cancelButton: 'swal-cancel-button',
            },
        }).then((result) => {
            if (result.isConfirmed && project) {
                SubmitNewVote( project );
                showSuccess(project);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                showFail();
            }
        });
    };

    const CallGetTrunkBalance = async () => {
        try {
            const balance = await GetTrunkBalance( ADDRESS );
            setTrunkBalance( balance );
        } catch (error) {
            console.log('Error: ' + error);
        }
    }

    const SubmitNewVote = async ( project: ProjectInfo ) => {

        if( !project ) { console.log("No Project Selected"); return; }
        console.log("Voting for: ", project.ID);

        CallGetTrunkBalance();

        try {
            // const result = await SendVoteForProject( ADDRESS, project.Name, project.ID.toString() );
            const result = await VoteForProject( project.ID.toString() );
            if( result === "Success" ) {
                console.log("Vote Success");
                showSuccess(project);
            } else {
              console.log("Vote Fail");
            }

            setProjects([]);
            setIsOpen(false);
        } catch (error) {
            console.log('Error: ' + error);

            setProjects([]);
            setIsOpen(false);
        }
    }

    useEffect(() => {
        console.log("Selected Project: ", selectedProject);
    }, [selectedProject]);

    useEffect(() => {
        console.log("Trunk Balance: ", trunkBalance);
    }, [trunkBalance]);

    useEffect(() => {
        console.log("SetIsOpen");
        CallGetTrunkBalance();
    }, [setIsOpen]);

    return (
    <div >
        {Projects.length > 0 && <>
        <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
            
            <div className="flex items-center justify-center">
                <h1 className="text-lg text-center font-semibold text-gray-900 dark:text-white">AO Project Leaderboard</h1>
            </div>

            {Projects.length === 0 && <>
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    No Projects Found
                </p>
            </>}

        {Projects.length > 0 && Projects.map((project, index) => (

            <li key={index} className="pt-3 pb-3 sm:pt-4 sm:pb-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">

                {/* Project Index */}
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    #{index + 1}
                </div>
                
                {/* Project Icon */}
                <div className="flex-shrink-0">
                    <a href={project.SiteURL} target="_blank" rel="noopener noreferrer">
                        <img className="w-12 h-12 rounded-full" src={project.IconURL} alt={project.Name} />
                    </a>
                </div>

                {/* Project Details */}
                <div className="flex-1 min-w-0" >
                
                {/* Project Name */}
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {project.Name}
                </p>

                    {/* Vote Info and Button in a Single Row */}
                    <div className="flex items-center mt-1">
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {FormatStake(project.totalVotes)} | {project.Owner}
                        </p>
                        <button
                            className="ml-4 px-4 py-1 bg-[#9ECBFF] text-white text-sm font-semibold rounded-md hover:bg-slate-50 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleVote(project);
                            }}
                        >
                            Vote
                        </button>
                    </div>
                </div>

                        
            </div>
            </li>
        ))}

        </ul>
        </> }
    </div>
      );
  }
  
  export default ProjectsList;