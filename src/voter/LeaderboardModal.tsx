import React, { useEffect, useState } from 'react';
import Modal from '../app_wheel/Modal';
import { useGlobalContext } from '../GlobalProvider';

interface LeaderboardModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }

  interface VoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    address: string;
  }

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, setIsOpen }) => {
    if (!isOpen) return null;

    // const { MODAL_INDEX, setMODAL_INDEX } = useGlobalContext();

    const onClose =  () => {
        setIsOpen(false);
    };
   
    return (
        <div 
        className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex" 
        onClick={onClose}
      >
        aosubdoiqbeoiwew
      </div>
    );
};

export default LeaderboardModal;

  