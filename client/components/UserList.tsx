import React, { useEffect, useState } from 'react';

// client/api/usernames.ts
export async function getUsernames(): Promise<string[][]> {
  const response = await fetch('http://localhost:3001/usernames');
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
    <div className="max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-black font-permanent-marker">
        User List:
      </h1>
      <div className="flex flex-col space-y-8">
        {<ul className="grid">

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
        </ul>}
      </div>
    </div>
  );
};

export default UserList;
