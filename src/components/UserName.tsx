import { doc, getDoc } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'
import { usersCol } from '../services/firebase'

interface IProps {
	uid: string
}

const UserName: React.FC<IProps> = ({ uid }) => {
	const [name, setName] = useState('')

	const getName = useCallback(async () => {
		const docRef = doc(usersCol, uid)
		const user = await getDoc(docRef)
		if (user.exists()) {
			setName(user.data().displayName)
		}
	}, [uid])

	useEffect(() => {
		getName()
	}, [getName])

	return <span>{name}</span>
}

export default UserName
