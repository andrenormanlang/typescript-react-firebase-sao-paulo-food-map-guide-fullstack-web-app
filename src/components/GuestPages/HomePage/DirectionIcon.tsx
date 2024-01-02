import React from 'react'
import Card from 'react-bootstrap/Card'
import { MdOutlineDirections } from "react-icons/md"
import useGetCurrentLocation from '../../../hooks/useGetCurrentLocation'

type Props = {
	placeId: string
}

const DirectionIcon: React.FC<Props> = ({ placeId }) => {
	const { position } = useGetCurrentLocation()

	return <Card.Link
		style={{
			fontSize: '1.4rem'
		}}
		target="_blank"
		href={`https://www.google.com/maps/dir/?api=1&origin=${position ? position?.lat + ',' + position?.lng : 'here'}&destination_place_id=${placeId}&destination=there`}>
		<MdOutlineDirections />
	</Card.Link>
}

export default DirectionIcon
