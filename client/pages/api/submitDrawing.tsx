import type { NextApiRequest, NextApiResponse } from 'next';

export default async function submitDrawing(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { roomId, userName, drawing } = req.body;

  // Save the drawing to the room data and update the game state

  res.status(200).json({ success: true, message: 'Drawing submitted' });
}
