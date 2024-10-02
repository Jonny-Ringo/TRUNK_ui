import React, { useEffect, useState } from 'react';
import { GetTopProjects } from '../app_wheel/MiscTools';

interface VoterFooterProps {
  isModalOpen: boolean;
  setVoterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProjectInfo {
  Name: string;
  IconURL: string;
  SiteURL: string;
  Stake: number;
  Owner: string;
}

const VoterFooter: React.FC<VoterFooterProps> = ({ setVoterModalOpen }) => {

  const [currentProjectIndex, setCurrentProjectIndex] = useState<number>(0);
  const [topProjects, setTopProjects] = useState<ProjectInfo[]>([]);

  useEffect(() => {
    fetchTopProjects();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTops();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const fetchTops = async () => {
    try {
      fetchTopProjects();
    } catch (e) {
      console.log(e);
    }
  };

  const fetchTopProjects = async () => {
    try {
      const top = await GetTopProjects();
      const json: ProjectInfo[] = JSON.parse(top);
      setTopProjects(json);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProjectIndex((prevIndex) => (prevIndex + 1) % topProjects.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [topProjects.length]);

  const onOpenVoterModal = () => {
    // console.log("Opening voter modal");
    setVoterModalOpen(true);
  };

  return (
    <footer
      onClick={onOpenVoterModal}
      className="absolute bottom-0 right-0 bg-[#1A1B2D] text-white py-2 px-6 rounded-tl-lg flex items-center shadow-lg"
    >

      {topProjects.length === 0 && <>
        <p className="text-sm font-bold">Loading... </p>
      </> }

      {topProjects.length > 0 && topProjects[currentProjectIndex] && (
        <>
          <img
            src={topProjects[currentProjectIndex].IconURL}
            alt={topProjects[currentProjectIndex].Name}
            className="w-10 h-10 rounded-full mr-3 border-2 border-white"
          />
          <div className="text-left">
            <p className="text-sm font-bold">{topProjects[currentProjectIndex].Name}</p>
            <p className="text-xs">{topProjects[currentProjectIndex].SiteURL}</p>
          </div>
        </>
      )} 

      

    </footer>
  );
};

export default VoterFooter;
