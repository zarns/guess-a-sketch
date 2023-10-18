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
        console.log("Received flipbooks data: ", allFlipbooks);
      };
  
      socket.on('allFlipbooksData', handleFlipbooksData);
      console.log(`Client emitted 'viewAllDrawings' with roomId ${roomId}`);
  
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
          <div className="title-container">
            <h2 className="title-description">{flipbook.username}'s Flipbook</h2>
          </div>
          {flipbook.data.map((page, pageIndex) => (
            <div key={pageIndex} className="page-container">
              {pageIndex === 0 ? (
                <h4 className='original-word-description'>Starter Word: {page.content}</h4>
              ) : (
                page.type === 'drawing' ? (
                  <div className="drawing-container">
                    <h4 className="artist-description">{page.username}</h4>
                    <img src={page.content} alt={`Drawing ${pageIndex + 1}`} />
                  </div>
                ) : (
                  <h3 className="guess-description">{page.username} Guessed {page.content}</h3>
                )
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
