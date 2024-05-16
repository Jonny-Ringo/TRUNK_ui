import React, { useEffect, useState, FormEvent  } from 'react';
import Modal from '../app_wheel/Modal';
import Spinner from '../app_wheel/Spinner';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    address: string;
}
  
  const AddProject: React.FC<BaseModalProps> = ({ isOpen, onClose, address }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [loadMessage, setLoadMessage] = useState('');

    useEffect(() => {
        if(!isOpen) {
        } else {
        }
    }, [isOpen]);

    
    function LoadedModalRender() {
        return (
          <>
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
            </div>
        </Modal>
        
    );
  }
  
  export default AddProject;