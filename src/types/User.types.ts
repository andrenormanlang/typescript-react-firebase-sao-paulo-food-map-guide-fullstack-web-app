import { Timestamp } from 'firebase/firestore'

export type UserDoc = {
	createdAt: Timestamp
	displayName: string
	email: string,
	isAdmin: boolean
	photoURL: string
	uid: string
	updatedAt: Timestamp
}

export type UserSignIn = {
	email: string
	password: string
}

export type UserSignUp = {
	displayName: string
	email: string
	password: string
	passwordConfirm: string
}

export type UserUpdate = {
	displayName: string
	email: string
	photoFile: FileList
	password: string
	passwordConfirm: string
}

export type ForgotPassword ={
	email: string
}
