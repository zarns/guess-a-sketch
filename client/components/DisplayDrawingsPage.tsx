// components/DisplayDrawingsPage.tsx

import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

interface DisplayDrawingsPageProps {
  roomId: string | string[] | undefined;
  onBack: () => void;
}

const DisplayDrawingsPage: React.FC<DisplayDrawingsPageProps> = ({ roomId, onBack }) => {
  // Add the logic for displaying the drawings here
  const [allFlipbooks, setAllFlipbooks] = useState([]);
  const socket = useSocket();

  const handleViewAllDrawings = () => {
    if (socket) {
      socket.emit('viewAllDrawings', roomId);
  
      const handleFlipbooksData = (allFlipbooks: Array<{ username: string, data: { type: 'drawing' | 'guess', content: string }[] }>) => {
        setAllFlipbooks(allFlipbooks);
      };
  
      socket.on('FlipbooksData', handleFlipbooksData);
  
      return () => {
        socket.off('allFlipbooksData', handleFlipbooksData);
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
        {allFlipbooks.map((flipbook, index) => (
        <div key={index} className="flipbook-container">
          <h2 className="flipbook-title">{flipbook.username}'s Flipbook</h2>
          {flipbook.data.map((page, pageIndex) => (
            <div key={pageIndex} className="page-container">
              <h4 className="contributor">{page.username}</h4>
              {page.type === 'drawing' ? (
                <div className="drawing-container">
                  <img src={page.content} alt={`Drawing ${pageIndex + 1}`} />
                </div>
              ) : (
                <div className="guess-container">
                  <h3 className="guess-description">{page.content}</h3>
                </div>
              )}
            </div>
          ))}
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
