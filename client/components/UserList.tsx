import React, { useEffect, useState } from 'react';

// client/api/allusernames.ts
export async function getUsernames(): Promise<string[][]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/allUsernames`);
  const data = await response.json();
  const allUsernames: string[][] = data.allUsernames;
  return allUsernames;
}

const UserList: React.FC = () => {
  const [usernames, setUsernames] = useState<string[][]>([]);

  useEffect(() => {
    async function fetchUsernames() {
      const data = await getUsernames();
      setUsernames(data);
    };
    fetchUsernames();
  }, []);

  return (
    <div className="about-container">
      <h1 className="about-title">Active Rooms:</h1>
      <div className="flex flex-col space-y-8">
        <div className="about-text-box">
          {usernames.length === 0 ? (
            <p>No active rooms at the moment.</p>
          ) : (
            <ul className="grid">
              {usernames.map((room, index) => (
                <li key={index}>
                  <ul>
                    {room.map((username, index) => (
                      <li
                      key={index}
                      className={index === 0 ? 'font-bold text-lg' : ''}
                      >
                      {index === 0 ? `Room ${username}:` : username}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
