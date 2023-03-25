import Link from 'next/link';
import Layout from '../components/Layout';
import Game from '../components/Game';

const IndexPage = () => (
  <Layout title="Welcome">
    <div
      className="bg-cover bg-center h-screen"
      style={{
        backgroundImage: 'url("/background-image.jpg")',
      }}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-white text-4xl font-bold mb-4">Welcome to Telestrations</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Game />
        </div>
        <p className="mt-6 text-white">
          <Link href="/about" passHref={true}>
            About
          </Link>
        </p>
      </div>
    </div>
  </Layout>
);

export default IndexPage;
