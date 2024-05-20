import React, { useEffect, useState, FormEvent  } from 'react';
import Modal from '../app_wheel/Modal';
import Spinner from '../app_wheel/Spinner';
import { SubmitNewProject, GetTrunkBalance, SendTrunk, GetProjects } from '../app_wheel/MiscTools';

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    address: string;
}
  
  const AddProject: React.FC<AddProjectModalProps> = ({ isOpen, onClose, address }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [loadMessage, setLoadMessage] = useState('');

    const [name, setName] = useState('');
    const [iconURL, setIconURL] = useState('');
    const [siteURL, setSiteURL] = useState('');
    const [stake, setStake] = useState('');
    const [owner, setOwner] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        SubmitNewProject(name, iconURL, siteURL, stake, owner);
        // console.log({ name, iconURL, siteURL, stake, owner });
    };

    useEffect(() => {
        if(!isOpen) {
        } else {
        }
    }, [isOpen]);
    
    function LoadedModalRender() {
        return (
          <>
           <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-white-700">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="iconURL" className="block text-sm font-medium text-white-700">Icon URL</label>
                    <input
                        type="text"
                        id="iconURL"
                        value={iconURL}
                        onChange={e => setIconURL(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="siteURL" className="block text-sm font-medium text-white-700">Site URL</label>
                    <input
                        type="text"
                        id="siteURL"
                        value={siteURL}
                        onChange={e => setSiteURL(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="stake" className="block text-sm font-medium text-white-700">Stake</label>
                    <input
                        type="text"
                        id="stake"
                        value={stake}
                        onChange={e => setStake(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="owner" className="block text-sm font-medium text-white-700">Owner</label>
                    <input
                        type="text"
                        id="owner"
                        value={owner}
                        onChange={e => setOwner(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#9ECBFF] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Submit
                </button>
            </form>
            
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
        
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-4">
                { isLoading ? LoadingRenderer() : MainRenderer() }

                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#9ECBFF] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={ () => {SendTrunk( "10", address, "aajbSwRdSrIIErliiiXDvHVUkauSPa2vmBATGkjDcf4" ); } }>
                    Send 1 TRUNK
                </button>

                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#9ECBFF] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={ () => {GetProjects(); } }>
                    Get-Projects
                </button>

            </div>
        </Modal>
        
    );
  }
  
  export default AddProject;