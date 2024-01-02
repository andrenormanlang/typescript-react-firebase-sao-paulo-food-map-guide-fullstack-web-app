import React from 'react'
import { Place } from '../../../types/Place.types'
import PlaceCards from './PlaceCards'
import useGetCurrentLocation from '../../../hooks/useGetCurrentLocation'
import { getPlacesWithDistances } from '../../../helpers/distances'

type Props = {
	places: Place[]
}

const SortAndMapPlaces: React.FC<Props> = ({ places }) => {
	const { position } = useGetCurrentLocation()

	if (!position) {
		return places.map((place) =>
		(
			<PlaceCards
				key={place._id}
				place={place}
			/>
		)
		)
	}

	const placesWithDistance = getPlacesWithDistances(position, places)

	return placesWithDistance
		.map((place) =>
		(
			<PlaceCards
				key={place._id}
				place={place}
			/>
		)
		)
}

export default SortAndMapPlaces
