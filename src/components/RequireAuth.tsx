import useAuth from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

interface IProps {
	children: React.ReactNode
	redirectTo?: string
}

const RequireAuth: React.FC<IProps> = ({
	children,
	redirectTo = '/sign-in'
}) => {
	const { signedInUser } = useAuth()

	return (
		signedInUser
			? <>{children}</>
			: <Navigate to={redirectTo} />
	)
}

export default RequireAuth
