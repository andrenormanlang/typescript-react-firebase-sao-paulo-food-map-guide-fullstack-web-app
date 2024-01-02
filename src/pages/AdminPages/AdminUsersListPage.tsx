import AdminUsersSortableTable from '../../components/AdminPages/AdminUsersSortableTable'
import useStreamUsers from '../../hooks/useStreamUsers'
import Alert from 'react-bootstrap/Alert'
import { ColumnDef } from '@tanstack/react-table'
import { UserDoc } from '../../types/User.types'

const columns: ColumnDef<UserDoc>[] = [
	{
		accessorKey: 'photoURL',
		header: 'Photo'
	},
	{
		accessorKey: 'displayName',
		header: 'Name'
	},
	{
		accessorKey: 'email',
		header: 'Email'
	},
	{
		accessorKey: 'createdAt',
		header: 'Created'
	},
	{
		accessorKey: 'updatedAt',
		header: 'Updated'
	},
	{
		accessorKey: 'isAdmin',
		header: 'Admin'
	}
]

const AdminUsersListPage = () => {
	const { data, error, isError, isLoading } = useStreamUsers()

	if (isLoading) return <div>Loading users...</div>

	if (isError) return <Alert variant='danger'>{error}</Alert>

	if (data) return (
		<>
			<h3 className='mb-3 title-table'>Users</h3>
			<AdminUsersSortableTable
				columns={columns}
				data={data}
			/>
		</>
	)
}

export default AdminUsersListPage
