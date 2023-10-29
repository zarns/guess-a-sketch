import Link from 'next/link'
import Layout from '../components/Layout'
import UserList from '../components/UserList'

const defaultEndpoint = 'http://localhost:3001/allusernames';

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
