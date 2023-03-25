// client/pages/[roomId].tsx
import { useRouter } from 'next/router';

const Room: React.FC = () => {
  const router = useRouter();
  const { roomId } = router.query;

  return (
    <div>
      <h1>Room {roomId}</h1>
      {/* Add your room content and components here */}
    </div>
  );
};

export default Room;
