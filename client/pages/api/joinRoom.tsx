import type { NextApiRequest, NextApiResponse } from 'next';

export default async function joinRoom(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { roomId, userName } = req.body;

  // Check if the room exists, and if so, add the user to the room
  // Update room and game state data accordingly

  res.status(200).json({ success: true, message: 'Joined room' });
}
