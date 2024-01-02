import useGetDocument from './useGetDocument'
import { placesCol } from '../services/firebase'
import { Place } from '../types/Place.types'

const useGetPlace = (id = '') => {
	return useGetDocument<Place>(placesCol, id)
}

export default useGetPlace
