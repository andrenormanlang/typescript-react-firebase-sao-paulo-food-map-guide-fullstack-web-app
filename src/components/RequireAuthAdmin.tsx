import useAuth from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

interface IProps {
	children: React.ReactNode
	redirectTo?: string
}

const RequireAuthAdmin: React.FC<IProps> = ({
	children,
	redirectTo = '/'
}) => {
	const { signedInUser, signedInUserDoc } = useAuth()

	if (!signedInUserDoc) return <div>Checking admin rights...</div>

	return (
		signedInUser && signedInUserDoc.isAdmin
			? <>{children}</>
			: <Navigate to={redirectTo} />
	)
}

export default RequireAuthAdmin
