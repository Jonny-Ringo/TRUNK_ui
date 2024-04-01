import React, { useState, useEffect } from 'react';

const MouseFollower: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({
        x: event.clientX,
        y: event.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)', // Centers the div on the cursor
        width: '100px',
        height: '100px',
        backgroundColor: 'red',
        pointerEvents: 'none', // Allows clicks to pass through the div
      }}
    />
  );
};

export default MouseFollower;
