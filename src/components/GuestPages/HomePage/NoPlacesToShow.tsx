import React from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { Place } from '../../../types/Place.types'
import { Link } from 'react-router-dom'

type Props = {
	places: Place[]
}

const NoPlacesToShow: React.FC<Props> = ({ places }) => {
	return places && places.length <= 0 &&
		<Alert variant="warning"
			className='text-center'>
			No places to show with that filtering.{' '}
			<Link
				to={'/place-form'}
				className="">
				<Button
					className="reccomend-btn"
					variant="warning"
				>
					Recommend us a place
				</Button>
			</Link>
		</Alert>
}


export default NoPlacesToShow
