// client/pages/[roomId].tsx

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { fabric } from 'fabric';
import { useSocket } from '../contexts/SocketContext';

const Room: React.FC = () => {
  const router = useRouter();
  const socket = useSocket();
  const canvasRef = useRef(null);
  const { roomId } = router.query;
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [timer, setTimer] = useState(60);
  const [drawings, setDrawings] = useState({});

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
  
    // Store the canvas instance in a ref
    canvasRef.current = canvas;
  
    return () => {
      canvas.dispose();
    };
  }, []); // <-- Remove the dependencies
  
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
    }

    console.log('Drawing submitted');
  };

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
    const countdown = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    if (timer === 0) {
      handleSubmitDrawing();
      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
  }, [timer]);

  return (
    <div
      className="bg-cover bg-center h-screen flex flex-col items-center"
      style={{
        backgroundImage: "url(../whiteboard_background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
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
          Time Remaining: {timer} Seconds
        </h2>
      </div>

      <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
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
      <div style={{marginTop: '20px'}}>
        {Object.values(drawings).map((imageData, index) => (
        <div key={index}>
          <h3>Drawing {index + 1}:</h3>
          <img src={imageData as string} alt={`Drawing ${index + 1}`} />
        </div>
        ))}
      </div>
    </div>
  );
};

export default Room;
