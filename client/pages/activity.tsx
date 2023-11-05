import Link from 'next/link'
import Layout from '../components/Layout'
import UserList from '../components/UserList'

const defaultEndpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/allusernames`;

export async function getServerSideUsers({ query }) {
  const { id } = query;
  const res = await fetch(`${defaultEndpoint}/${id}`);
  const data = await res.json();
  return {
    props: {
      data,
    },
  }
}

const ActivityPage = () => (
  <Layout title="Activity">
    <UserList />
  </Layout>
)

export default ActivityPage
