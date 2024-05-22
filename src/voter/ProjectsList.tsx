import React, { useEffect, useState } from 'react';
import ProjectDetails from './ProjectDetails';

interface ProjectInfo {
    Name: string;
    IconURL: string;
    SiteURL: string;
    Stake: number;
    Owner: string;
}

interface ProjectsListProps {
    Projects: ProjectInfo[];
    address: string;
}


function ProjectsList ( { Projects, address }: ProjectsListProps ) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);

    function FormatStake( amount : number ) {
        const formated = amount / 1000;
        return formated;
    }

    useEffect(() => {
        console.log("Selected Project: ", selectedProject);
        if(selectedProject) {
            setIsModalOpen(true);
        }
      }, [selectedProject]);

    useEffect(() => {
        console.log("ProjectsList address: ", address);
    }, [address]);

    const handleProjectClick = (project: ProjectInfo) => { 
        setSelectedProject(project);
    };

    return (
        <div >
            
            <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                {Array.isArray(Projects) && Projects.length > 0 ? (
                    Projects.map((project, index) => (
                        <li key={index} className="pt-3 pb-3 sm:pt-4 sm:pb-4">
                            <div className="cursor-pointer"
                                onClick={() => handleProjectClick(project)}
                            >
                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                    <div className="flex-shrink-0">
                                        <img className="w-8 h-8 rounded-full" src={project.IconURL} alt={project.Name} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            {project.Name}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                            {FormatStake(project.Stake)} | {project.Owner}
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                        #{index + 1}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="pt-3 pb-3 sm:pt-4 sm:pb-4 text-gray-500 dark:text-gray-400">
                        No projects available
                    </li>
                )}
            </ul>

        { address && <ProjectDetails isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} address={address} selectedProject={selectedProject} /> }
            
        </div>
      );
  }
  
  export default ProjectsList;