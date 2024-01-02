import useStreamCollection from './useStreamCollection'
import { photosCol } from '../services/firebase'
import { Photo } from '../types/Photo.types'

const useStreamPhotos = () => {
	return useStreamCollection<Photo>(
		photosCol
	)
}

export default useStreamPhotos
