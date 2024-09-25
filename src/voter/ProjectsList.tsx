import React, { useEffect, useState } from 'react';
import { SendVoteForProject } from '../app_wheel/MiscTools';
import { useGlobalContext } from '../GlobalProvider';
import Swal from 'sweetalert2';

interface ProjectInfo {
    Name: string;
    IconURL: string;
    SiteURL: string;
    Stake: number;
    Owner: string;
    ID: number;
  }

interface ProjectsListProps {
    Projects: ProjectInfo[];
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


function ProjectsList ( { Projects , setIsOpen }: ProjectsListProps ) {

    const {
        ADDRESS
    } = useGlobalContext();

    const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);

    function FormatStake( amount : number ) {
        const formated = amount / 1000;
        return formated;
    }

    const showSuccess = ( project : ProjectInfo ) => {

        Swal.fire({
          title: "" + project.Name,
          text: 'You Selected this project',
          color: "white",
          icon: 'success',
          confirmButtonText: 'Done',
          background: '#2a2c49',
        });
      };

    const showFail = () => {
        Swal.fire({
          title: 'Fail!',
          text: 'Project Not Added',
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
            title: `Vote for ${project.Name}?`,
            text: "Are you sure you want to vote for this project?",
            color: "white",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Vote!',
            cancelButtonText: 'No, Cancel',
            background: '#2a2c49',
            reverseButtons: true, // Optional: Reverses the order of buttons
            // Custom button colors (optional)
            customClass: {
                confirmButton: 'swal-confirm-button',
                cancelButton: 'swal-cancel-button',
            },
        }).then((result) => {
            if (result.isConfirmed && project) {
                // User clicked 'Yes, Vote!'
                // showSuccess(project);
                SubmitNewVote( project );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // User clicked 'No, Cancel' or dismissed the modal
                showFail();
            }
        });
    };

    const SubmitNewVote = async ( project: ProjectInfo ) => {

        if( !project ) { console.log("No Project Selected"); return; }
        console.log("Voting for: ", project.ID);

        try {
            const result = await SendVoteForProject( ADDRESS, project.Name, project.ID.toString() );
            if( result === "Success" ) {
                console.log("Vote Success");
                showSuccess(project);
            } else {
              console.log("Vote Fail");
            }
  
        } catch (error) {
            console.log('Error: ' + error);
        }
    }

    useEffect(() => {
        console.log("Selected Project: ", selectedProject);
    }, [selectedProject]);

    return (
    <div >
        {Projects.length > 0 && <>
        <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
            
            <div className="flex items-center justify-center">
                <h1 className="text-lg text-center font-semibold text-gray-900 dark:text-white">AO Project Leaderboard</h1>
            </div>

            {Projects.length > 0 && Projects.map((project, index) => (
                <li key={index} className="pt-3 pb-3 sm:pt-4 sm:pb-4">
                    
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-shrink-0">
                                
                            <a href={project.SiteURL} target="_blank" rel="noopener noreferrer">
                                <img className="w-8 h-8 rounded-full" src={project.IconURL} alt={project.Name} />
                            </a>

                            </div>
                            <div className="flex-1 min-w-0" onClick={() => handleVote(project)} >
                                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    {project.Name}
                                </p>
                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                    {FormatStake(project.Stake)} | {project.Owner}
                                </p>
                                
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                #{index +1}
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