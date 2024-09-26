import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ProjectInfo {
  Name: string;
  IconURL: string;
  SiteURL: string;
  Stake: number;
  Owner: string;
  ID: number;
}

interface ProjectVote {
  Stake: number;
  Owner: string;
  ID: number;
}

interface GlobalContextType {
  ADDRESS: string;
  setADDRESS: React.Dispatch<React.SetStateAction<string>>;
  MODAL_INDEX: number;
  setMODAL_INDEX: React.Dispatch<React.SetStateAction<number>>;
  PROJECTS: ProjectInfo[];
  setPROJECTS: React.Dispatch<React.SetStateAction<ProjectInfo[]>>;
  VOTES: ProjectVote[];
  setVOTES: React.Dispatch<React.SetStateAction<ProjectVote[]>>;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  const [ADDRESS, setADDRESS] = useState<string>('');
  const [MODAL_INDEX, setMODAL_INDEX] = useState<number>(0); // Not Used: 9.26.24
  const [PROJECTS, setPROJECTS] = useState<ProjectInfo[]>([]);
  const [VOTES, setVOTES] = useState<ProjectVote[]>([]);

  useEffect(() => {
    console.log("MODAL_INDEX: ", MODAL_INDEX);
  }, [MODAL_INDEX]);

  useEffect(() => {
    console.log("PROJECTS: ", PROJECTS);
  }, [PROJECTS]);

  return (
    <GlobalContext.Provider
      value={{
        ADDRESS: ADDRESS,
        setADDRESS: setADDRESS,
        MODAL_INDEX,
        setMODAL_INDEX,
        PROJECTS,
        setPROJECTS,
        VOTES,
        setVOTES
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};


export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export default GlobalProvider;
