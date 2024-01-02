import DateCell from './DateCell'
import UserName from '../UserName'
import { doc, updateDoc } from 'firebase/firestore'
import { placesCol } from '../../services/firebase'
import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Pagination from 'react-bootstrap/Pagination'
import Table from 'react-bootstrap/Table'
import { BiEditAlt } from 'react-icons/bi'
import { Link } from 'react-router-dom'
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
import { Place } from '../../types/Place.types'

interface IProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

const AdminPlacesSortableTable = <TData, TValue>({
	columns,
	data,
}: IProps<TData, TValue>) => {
	const [search, setSearch] = useState('')
	const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }])

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

	const toggleApproval = (place: Place) => {
		const docRef = doc(placesCol, place._id)
		updateDoc(docRef, {
			isApproved: !place.isApproved
		})
	}

	const renderApprovalCell = (place: Place) => (
		<Form.Check
			checked={place.isApproved}
			id='approval-switch'
			onChange={() => toggleApproval(place)}
			type='switch'
		/>
	)

	const renderEditCell = (_id: string) => (
		<Link to={'/admin-edit-place/' + _id}>
			<Button
				size='sm'
				variant='warning'
			><BiEditAlt /></Button>
		</Link>
	)

	const cellRenderer = (cellType: string, place: Place) => {
		switch (cellType) {
			case 'uid':
				return <UserName uid={place.uid} />
			case 'createdAt':
				return <DateCell date={place.createdAt.toDate()} />
			case 'isApproved':
				return renderApprovalCell(place)
			case '_id':
				return renderEditCell(place._id)
			default:
				return
		}
	}

	const altRendering = ['uid', 'createdAt', 'isApproved', '_id']

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
									? cellRenderer(cell.column.id, row.original as Place)
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

export default AdminPlacesSortableTable
