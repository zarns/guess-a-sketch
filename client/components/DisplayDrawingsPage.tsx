// components/DisplayDrawingsPage.tsx

import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

interface DisplayDrawingsPageProps {
  roomId: string;
  onBack: () => void;
}

const DisplayDrawingsPage: React.FC<DisplayDrawingsPageProps> = ({ roomId, onBack }) => {
  // Add the logic for displaying the drawings here
  const [drawings, setDrawings] = useState({});
  const socket = useSocket();

  const handleViewAllDrawings = () => {
    if (socket) {
      socket.emit('viewAllDrawings', roomId);
  
      const handleDrawingData = ({ index, imageData }) => {
        setDrawings((prevDrawings) => ({ ...prevDrawings, [index]: imageData }));
      };
  
      socket.on('drawingData', handleDrawingData);
  
      return () => {
        socket.off('drawingData', handleDrawingData);
      };
    }
  };

  useEffect(() => {
    handleViewAllDrawings();
  }, []);

  return (
    <div>
      <div style={{marginTop: '20px'}}>
        <h2 className='page-description'>
          Drawings in Room {roomId}
        </h2>
        {Object.values(drawings).map((imageData, index) => (
          <div key={index} className='drawing-container'>
            <h1 className='drawing-description'>
              somebody drew:
            </h1>
            <img src={imageData as string} alt={`Drawing ${index + 1}`} />
          </div>
        ))}
        <button
          onClick={onBack}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default DisplayDrawingsPage;
