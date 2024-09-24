import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ProjectInfo {
  Name: string;
  IconURL: string;
  SiteURL: string;
  Stake: number;
  Owner: string;
}

interface GlobalContextType {
  ADDRESS: string;
  setADDRESS: React.Dispatch<React.SetStateAction<string>>;
  MODAL_INDEX: number;
  setMODAL_INDEX: React.Dispatch<React.SetStateAction<number>>;
  PROJECTS: ProjectInfo[];
  setPROJECTS: React.Dispatch<React.SetStateAction<ProjectInfo[]>>;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  const [ADDRESS, setADDRESS] = useState<string>('');
  const [MODAL_INDEX, setMODAL_INDEX] = useState<number>(0); // use this to open modals, 0 is closed
  const [PROJECTS, setPROJECTS] = useState<ProjectInfo[]>([]); // List of projects in the DAO

  useEffect(() => {
    console.log("MODAL_INDEX: ", MODAL_INDEX);
  }, [MODAL_INDEX]);

  return (
    <GlobalContext.Provider
      value={{
        ADDRESS: ADDRESS,
        setADDRESS: setADDRESS,
        MODAL_INDEX,
        setMODAL_INDEX,
        PROJECTS,
        setPROJECTS
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
