// client/components/DrawingPage.tsx

import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useRouter } from 'next/router';
import { useSocket } from '../contexts/SocketContext';

interface DrawingPageProps {
  roomId: string | string[] | undefined;
  previousGuess: string;
  onViewDrawings: () => void;
}

const DrawingPage: React.FC<DrawingPageProps> = ({ roomId, previousGuess, onViewDrawings }) => {
  const socket = useSocket();
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [timer, setTimer] = useState(60);
  const [waitingForFlipbook, setWaitingForFlipbook] = useState(false);

  const colors = [
    '#FF0000', // Red
    '#FFA500', // Orange
    '#FFD700', // Darker Yellow
    '#008000', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#EE82EE', // Violet
    '#000000', // Black
    '#808080', // Gray
    '#F5F5F5', // Very light gray
  ];

  useEffect(() => {
    if (!canvasRef.current) return;
  
    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white background
    });
  
    // Set the canvas size (customize as needed)
    canvas.setWidth(800);
    canvas.setHeight(600);
    canvasRef.current = canvas;
  
    return () => {
      canvas.dispose();
    };
  }, []);
  
  // Add a new effect for updating the brush
  useEffect(() => {
    if (!canvasRef.current) return;
  
    const canvas = canvasRef.current;
  
    // Update the brush color and size
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = brushSize;
  }, [color, brushSize]);  
  
  const handleSubmitDrawing = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const drawingDataUrl = canvas.toDataURL();

    if (socket) {
      socket.emit('saveDrawing', { roomId, drawingDataUrl });
      setWaitingForFlipbook(true);
      console.log("DrawingPage emitted saveDrawing");
      socket.emit('requestNextFlipbook', { roomId });
    }

    console.log('Drawing submitted');
  };

  const handleViewAllDrawings = () => {
    if (socket) {
      socket.emit('viewAllDrawings', roomId);
      onViewDrawings(); // Call the onViewDrawings prop function
    }
  };

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    if (timer === 0) {
      handleSubmitDrawing();
      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
  }, [timer]);

  useEffect(() => {
    if (socket) {
      // Add listener for 'viewAllDrawings' event
      socket.on('viewAllDrawings', () => {
        handleViewAllDrawings(); // Fetch and display drawings when the event is received
      });
  
      // Clean up the listener when the component is unmounted
      return () => {
        socket.off('viewAllDrawings');
      };
    }
  }, [socket]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            marginTop: '.5rem',
            marginBottom: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            backgroundImage: 'linear-gradient(to top, rgba(0, 0, 60, 0.7), rgba(20, 20, 200, 0.9))',
            transition: 'background-color 0.3s',
          }}
        >
          Room {roomId}
        </h1>
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            marginTop: '.5rem',
            marginBottom: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            backgroundColor: timer < 10 ? 'red' : 'blue',
            transition: 'background-color 0.3s',
          }}
        >
          Timer: {timer} Seconds
        </h2>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
      <div className="previous-guess">
          Draw: {previousGuess}
        </div>
      </div>
      <div style={{marginBottom:'20px'}}>
        <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
      </div>
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <div>
          {colors.map((colorValue) => (
            <button
              key={colorValue}
              style={{
                backgroundColor: colorValue,
                width: '30px',
                height: '30px',
                margin: '2px',
              }}
              onClick={() => setColor(colorValue)}
            />
          ))}
        </div>
        <div
          style={{
            backgroundImage: 'linear-gradient(to top, rgba(255, 165, 0, 0.5), rgba(255, 204, 0, 0.9))',
            borderRadius: '0.375rem', // Rounded corners
            padding: '0.5rem', // Padding
            fontWeight: 'bold',
          }}
        >
          <label htmlFor="brushSize">Brush Size: </label>
          <input
            type="range"
            id="brushSize"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
          />
        </div>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <button
            onClick={handleSubmitDrawing}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
          <button
            onClick={handleViewAllDrawings}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            View Drawings
          </button>
        </div>
      </div>
      {waitingForFlipbook && (
        <div 
          className={"text-black font-bold py-2 px-4 rounded"} 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '1rem', 
            fontSize: '25px'  // or any other value you prefer
          }}
        >
          Submitted. Waiting for next flipbook to become available...
        </div>

      )}
    </div>
  );
};

export default DrawingPage;
