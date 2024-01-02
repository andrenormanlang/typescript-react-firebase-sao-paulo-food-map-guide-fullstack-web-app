import React from 'react'
import { Place } from '../../../types/Place.types'
import NoPlacesToShow from './NoPlacesToShow'
import SortAndMapPlaces from './SortAndMapPlaces'

type Props = {
	places: Place[]
}

const SidebarContent: React.FC<Props> = ({ places }) => {
	return places &&
		<>
			<NoPlacesToShow
				places={places}
			/>

			<SortAndMapPlaces
				places={places} />
		</>
}

export default SidebarContent
