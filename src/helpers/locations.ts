/**
 * A function for extracting the locality name from the getGeocode()-results
 *
 * @param results @type google.maps.GeocoderResult[]
 * @returns The name of the city searched for
 */
export const findAdressComponent = (results: google.maps.GeocoderResult[]) => {

	const component = results[0]?.address_components.find((component) => {
		if (component.types.includes("postal_town") ||
			(component.types.includes("locality"))) {
			return true
		} else {
			return false
		}
	})

	if (!component) return
	return component.long_name
}

