import Layout from '../../components/Layout'
import List from '../../components/List'
import UserList from '../../components/UserList'

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

const UsersPage = () => (
  <Layout title="Users List">
    <UserList />
  </Layout>
)

export default UsersPage
