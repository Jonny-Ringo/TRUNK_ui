import React, { useEffect, useState } from 'react';

interface ProjectInfo {
    Name: string;
    IconURL: string;
    SiteURL: string;
    Stake: number;
    Owner: string;
}

interface ProjectsListProps {
    Projects: ProjectInfo[];
}


function ProjectsList ( { Projects }: ProjectsListProps ) {

    function FormatStake( amount : number ) {
        const formated = amount / 1000;
        return formated;
    }

    return (
    <div >
        {Projects.length > 0 && <>
        <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
            
            <div className="flex items-center justify-center">
                <h1 className="text-lg text-center font-semibold text-gray-900 dark:text-white">AO Project Leaderboard</h1>
            </div>

            {Projects.length > 0 && Projects.map((project, index) => (
                <li key={index} className="pt-3 pb-3 sm:pt-4 sm:pb-4">
                    <a href={project.SiteURL} target="_blank" rel="noopener noreferrer">
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
                                #{index +1}
                            </div>
                        </div>
                    </a>
                </li>
            ))}
        </ul>
        </> }
    </div>
      );
  }
  
  export default ProjectsList;