import useAuth from '../../hooks/useAuth'
import { useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { useNavigate } from 'react-router-dom'

const SignOutPage = () => {
	const { signOutUser } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		const signOut = async () => {
			await signOutUser()
			navigate('/')
		}

		signOut()
	}, [signOutUser, navigate])

	return (
		<Container className='py-3 center-y'>
			<Row>
				<Col md={{ span: 6, offset: 3 }}>
					<Card>
						<Card.Body>
							<Card.Title className='mb-3'>Sign Out</Card.Title>
							<Card.Text>Please wait while you're being signed out...</Card.Text>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default SignOutPage
