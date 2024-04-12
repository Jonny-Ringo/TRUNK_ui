import React, { ReactNode } from 'react';
import './fonts/Cascadia.ttf';
import './style.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-cover bg-center bg-repeat-x"
         style={{ 
            backgroundImage: `url('./images/background.png')`,
            // backgroundSize: '50%, 100%' 
            }}>
      {children}
    </div>
  );
};

export default Layout;
