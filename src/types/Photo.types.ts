import { Timestamp } from 'firebase/firestore'

export type Photo = {
	_id: string
	createdAt: Timestamp
	ext: string
	isApproved: boolean
	name: string
	placeId: string
	placeName: string
	uid: string
	url: string
}

export type PhotoUpload = {
	photoFile: FileList
}
