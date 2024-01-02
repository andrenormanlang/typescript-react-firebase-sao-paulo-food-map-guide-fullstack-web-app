import { FirebaseError } from 'firebase/app'
import useAuth from '../../hooks/useAuth'
import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { UserSignIn } from '../../types/User.types'

const SignInPage = () => {
	const [errorMessage, setErrorMessage] = useState<string|null>(null)
	const [isError, setIsError] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const { signInUser } = useAuth()
	const { handleSubmit, register, formState: { errors } } = useForm<UserSignIn>()
	const navigate = useNavigate()

	const onSignIn: SubmitHandler<UserSignIn> = async (data) => {
		setIsError(false)
		setErrorMessage(null)

		try {
			setIsSubmitting(true)
			await signInUser(data.email, data.password)
			navigate('/')

		} catch (error) {
			if (error instanceof FirebaseError) {
				setErrorMessage(error.message)
			} else {
				setErrorMessage("Something went wrong when trying to sign in")
			}
			setIsError(true)
			setIsSubmitting(false)
		}
	}

	return (
		<Container className='py-3 center-y'>
			<Row>
				<Col md={{ span: 6, offset: 3 }}>
					<Card>
						<Card.Body>
							<Card.Title className='mb-3'>Sign In</Card.Title>

							{isError && <Alert variant='danger'>{errorMessage}</Alert>}

							<Form onSubmit={handleSubmit(onSignIn)}>
								<Form.Control
									className='mb-3'
									placeholder="Email"
									type='email'
									{...register('email', {
										required: "Email missing",
									})}
								/>
								{errors.email && <p className='invalid-value'>{errors.email.message ?? "Invalid value"}</p>}


								<Form.Group controlId='password' className='mb-3'>
									<Form.Control
										autoComplete='new-password'
										placeholder='Password'
										type='password'
										{...register('password', {
											required: "Password missing",
											minLength: {
												value: 6,
												message: "Enter at least 6 characters"
											},
										})}
									/>
									{errors.password && <p className='invalid-value'>{errors.password.message ?? "Invalid value"}</p>}
								</Form.Group>

								<Button
									disabled={isSubmitting}
									size='sm'
									type='submit'
									variant='primary'
								>
									{isSubmitting ? "Signing In..." : "Sign In"}
								</Button>
							</Form>

							<div className='text-center'>
								<Link className='forgot-password' to='/forgot-password'>Forgot Password?</Link>
							</div>
						</Card.Body>
					</Card>

					<div className='text-center mt-3'>
						<span className=' account sign-up'>
							Need an account?<br />
							<Link to='/sign-up' className='sign-up-link'>
								Sign Up
							</Link>
						</span>
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default SignInPage
