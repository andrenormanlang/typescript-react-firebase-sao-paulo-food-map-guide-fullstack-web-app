import DateCell from './DateCell'
import PhotoCell from './PhotoCell'
import { doc, updateDoc } from 'firebase/firestore'
import { usersCol } from '../../services/firebase'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Pagination from 'react-bootstrap/Pagination'
import Table from 'react-bootstrap/Table'
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table'
import { UserDoc } from '../../types/User.types'

interface IProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

const AdminUsersSortableTable = <TData, TValue>({
	columns,
	data,
}: IProps<TData, TValue>) => {
	const [search, setSearch] = useState('')
	const [sorting, setSorting] = useState<SortingState>([{ id: 'displayName', desc: false }])

	const table = useReactTable({
		columns,
		data,
		state: {
			globalFilter: search,
			sorting
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel()
	})

	const toggleAdmin = (userData: UserDoc) => {
		const docRef = doc(usersCol, userData.uid)
		updateDoc(docRef, {
			isAdmin: !userData.isAdmin
		})
	}

	const renderAdminCell = (userData: UserDoc) => (
		<Form.Check
			checked={userData.isAdmin}
			id='admin-switch'
			onChange={() => toggleAdmin(userData)}
			type='switch'
		/>
	)

	const cellRenderer = (cellType: string, user: UserDoc) => {
		switch (cellType) {
			case 'photoURL':
				return <PhotoCell alt={user.displayName} src={user.photoURL} />
			case 'createdAt':
				return <DateCell date={user.createdAt.toDate()} />
			case 'updatedAt':
				return <DateCell date={user.updatedAt.toDate()} />
			case 'isAdmin':
				return renderAdminCell(user)
			default:
				return
		}
	}

	const altRendering = ['photoURL', 'createdAt', 'updatedAt', 'isAdmin']

	return (
		<>
			<Form.Control
				className='mb-3'
				onChange={e => setSearch(e.target.value)}
				placeholder="Search"
				type='text'
				value={search}
			/>

			<Table striped bordered hover responsive>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id} colSpan={header.colSpan}>
									{header.isPlaceholder ? null : (
										<div
											{...{
												className:
													header.column.getCanSort()
														? 'cursor-pointer select-none'
														: '',
												onClick:
													header.column.getToggleSortingHandler()
											}}
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}

											{{
												asc: " ⬆",
												desc: " ⬇"
											}[
												header.column.getIsSorted() as string
											] ?? null}
										</div>
									)}
								</th>
							))}
						</tr>
					))}
				</thead>

				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id}>
									{altRendering.includes(cell.column.id)
									? cellRenderer(cell.column.id, row.original as UserDoc)
									: (
										flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										)
									)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</Table>

			<div className="d-flex justify-content-center">
				<Pagination>
					<Pagination.First onClick={() => table.setPageIndex(0)} />
					<Pagination.Prev
						disabled={!table.getCanPreviousPage()}
						onClick={() => table.previousPage()}
					/>
					<Pagination.Next
						disabled={!table.getCanNextPage()}
						onClick={() => table.nextPage()}
					/>
					<Pagination.Last onClick={() => table.setPageIndex(table.getPageCount() - 1)} />
				</Pagination>
			</div>
		</>
	)
}

export default AdminUsersSortableTable
