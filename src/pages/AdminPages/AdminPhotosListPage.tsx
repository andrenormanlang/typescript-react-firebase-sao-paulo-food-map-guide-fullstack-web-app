import AdminPhotosSortableTable from '../../components/AdminPages/AdminPhotosSortableTable'
import useStreamPhotos from '../../hooks/useStreamPhotos'
import Alert from 'react-bootstrap/Alert'
import { ColumnDef } from '@tanstack/react-table'
import { Photo } from '../../types/Photo.types'

const columns: ColumnDef<Photo>[] = [
	{
		accessorKey: 'url',
		header: 'Photo'
	},
	{
		accessorKey: 'placeName',
		header: 'Place'
	},
	{
		accessorKey: 'uid',
		header: 'User'
	},
	{
		accessorKey: 'createdAt',
		header: 'Created'
	},
	{
		accessorKey: 'isApproved',
		header: 'Approved'
	}
]

const AdminPhotosListPage = () => {
	const { data, error, isError, isLoading } = useStreamPhotos()

	if (isLoading) return <div>Loading photos...</div>

	if (isError) return <Alert variant='danger'>{error}</Alert>

	if (data) return (
		<>
			<h3 className='mb-3 title-table'>Photos</h3>
			<AdminPhotosSortableTable
				columns={columns}
				data={data}
			/>
		</>
	)
}

export default AdminPhotosListPage
