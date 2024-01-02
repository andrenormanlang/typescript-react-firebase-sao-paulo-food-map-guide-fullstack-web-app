import React, { useEffect, useState } from 'react'
import { Form, ListGroup, ListGroupItem } from 'react-bootstrap'
import useOnclickOutside from 'react-cool-onclickoutside'
import { useSearchParams } from 'react-router-dom'
import usePlacesAutoComplete, { getGeocode } from 'use-places-autocomplete'

type Props = {
	onClickedPlace: (results: google.maps.GeocoderResult[], placeName: string) => void
	searchPlacesOfTypes?: string[] | undefined
	placeHolderText: string
	showInitialPlace?: boolean
}

const PlacesAutoComplete: React.FC<Props> = ({ onClickedPlace, searchPlacesOfTypes, placeHolderText, showInitialPlace }) => {
	const [showUl, setShowUl] = useState<boolean>(false)
	const [searchParams] = useSearchParams()
	const locality = searchParams.get("locality") ?? "São Paulo	"
	const {
		ready,
		value,
		setValue,
		suggestions: { status, data },
		clearSuggestions,
	} = usePlacesAutoComplete({
		requestOptions: {
			componentRestrictions: {
				country: 'BR'
			},
			types: searchPlacesOfTypes ?? undefined
		}
	})
	const ref = useOnclickOutside(() => {
		// When the user clicks outside of the component, we can dismiss
		// the searched suggestions by calling this method
		clearSuggestions()
		setShowUl(false)
		if (!showInitialPlace) {
			return setValue(locality + ', Brazil')
		} else {
			return
		}

	})

	const handleInputClick = () => {
		setValue('')
		setShowUl(true)
	}

	const handleSelect = ({ description, structured_formatting }: google.maps.places.AutocompletePrediction) => (
		async () => {
			// When the user selects a place, we can replace the keyword without request data from API
			// by setting the second parameter to 'false'
			setValue(description, false)
			clearSuggestions()

			// Get the google.maps.GeocoderResult[] response
			const results = await getGeocode({
				address: description,
				componentRestrictions: { country: 'BR' } //(supposed to be) giving only results in Sweden
			})
			const placeName = structured_formatting.main_text
			onClickedPlace(results, placeName)
		}
	)

	useEffect(() => {
		setShowUl(false)
		if (!showInitialPlace) {
			return setValue(locality + ', Brazil')
		} else {
			return
		}
	}, [setValue, locality, showInitialPlace])

	return (
		<div ref={ref}>
			<Form.Control
				role='combobox'
				onClick={handleInputClick}
				value={value}
				onChange={e => setValue(e.target.value)}
				disabled={!ready}
				placeholder={placeHolderText}
			/>
			{status === 'OK' && showUl &&
				<ListGroup
					style={{
						position: 'absolute',
					}}
				>
					{data.map((suggestion) => {
						const {
							place_id,
							structured_formatting: { main_text, secondary_text }
						} = suggestion

						return (
							<ListGroupItem

								key={place_id}
								onClick={handleSelect(suggestion)}>
								<strong>{main_text}</strong> <small>{secondary_text}</small>
							</ListGroupItem>
						)
					})}
				</ListGroup>
			}
		</div >
	)
}

export default PlacesAutoComplete
