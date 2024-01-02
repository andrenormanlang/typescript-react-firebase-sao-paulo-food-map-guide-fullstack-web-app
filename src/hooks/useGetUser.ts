import useGetDocument from './useGetDocument'
import { usersCol } from '../services/firebase'
import { UserDoc } from '../types/User.types'

const useGetUser = (uid: string) => {
	return useGetDocument<UserDoc>(usersCol, uid)
}

export default useGetUser
