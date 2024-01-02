import { where } from 'firebase/firestore'
import useStreamCollection from './useStreamCollection'
import { photosCol } from '../services/firebase'
import { Photo } from '../types/Photo.types'

const useStreamPhotosByPlace = (placeId = '') => {
	return useStreamCollection<Photo>(
		photosCol,
		where('placeId', '==', placeId)
	)
}

export default useStreamPhotosByPlace
