import React, { useEffect, useState, FormEvent  } from 'react';
import Modal from '../app_wheel/Modal';
import Spinner from '../app_wheel/Spinner';
import { SubmitNewProject, GetTrunkBalance, SendTrunk, GetProjects,  } from '../app_wheel/MiscTools';

interface ProjectProps {
    isOpen: boolean;
    onClose: () => void;
    address: string;
    selectedProject: ProjectInfo | null;
}

interface ProjectInfo {
    Name: string;
    IconURL: string;
    SiteURL: string;
    Stake: number;
    Owner: string;
}

const ProjectDetails : React.FC<ProjectProps> = ({ isOpen, onClose, address, selectedProject }) => {

    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchBalance = async () => {
            if (address) {
                console.log("Fetching balance for: ", address);
                const balance = await GetTrunkBalance(address);
                setBalance(balance);
            }
        };

        fetchBalance();
    }, [isOpen]);

    useEffect(() => {
        console.log("Selected address: ", address);
    }, [isOpen === true]);

    const handleVote = async () => {
        console.log("Voting for: ", selectedProject?.Owner , " with stake: ", balance );
        // if (address) {
        //     console.log("Voting for: ", address);
        //     await SendTrunk(address, selectedProject?.Owner, selectedProject?.Stake);
        // }
    };

    return (
        
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-4">
                <p className="text-lg font-bold text-white">Project Details</p>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                        <img className="w-8 h-8 rounded-full" src={selectedProject?.IconURL} alt={selectedProject?.Name} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {selectedProject?.Name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{selectedProject?.SiteURL}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 rtl:space-x-reverse p-4">
                    <button className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#9ECBFF] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                    onClick={ () => { handleVote(); } } >Vote { balance }</button>
                </div>
            </div>
        </Modal>
        
    );
}

export default ProjectDetails;