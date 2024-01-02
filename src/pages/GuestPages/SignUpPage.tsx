import { FirebaseError } from 'firebase/app'
import useAuth from '../../hooks/useAuth'
import { useRef, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { UserSignUp } from '../../types/User.types'

const SignUpPage = () => {
	const [errorMessage, setErrorMessage] = useState<string|null>(null)
	const [isError, setIsError] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const { signUpUser } = useAuth()
	const { handleSubmit, register, watch, formState: { errors } } = useForm<UserSignUp>()
	const navigate = useNavigate()

	const passwordRef = useRef('')
	passwordRef.current = watch('password')

	const onSignUp: SubmitHandler<UserSignUp> = async (data: UserSignUp) => {
		setIsError(false)
		setErrorMessage(null)

		try {
			setIsSubmitting(true)
			await signUpUser(data.email, data.displayName, data.password)
			navigate('/')

		} catch (error) {
			if (error instanceof FirebaseError) {
				setErrorMessage(error.message)
			} else {
				setErrorMessage("Something went wrong when trying to sign up")
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
							<Card.Title className='mb-3'>Sign Up</Card.Title>

							{isError && (<Alert variant='danger'>{errorMessage}</Alert>)}

							<Form onSubmit={handleSubmit(onSignUp)}>
								<Form.Group controlId='displayName' className='mb-3'>
									<Form.Control
										placeholder="Name"
										type='text'
										{...register('displayName', {
											required: "Name missing",
										})}
									/>
									{errors.displayName && <div className='invalid-value'>{errors.displayName.message ?? "Invalid value"}</div>}
								</Form.Group>

								<Form.Group controlId='email' className='mb-3'>
									<Form.Control
										placeholder="Email"
										type='email'
										{...register('email', {
											required: "Email missing",
										})}
									/>
									{errors.email && <div className='invalid-value'>{errors.email.message ?? "Invalid value"}</div>}
								</Form.Group>

								<Form.Group controlId='password' className='mb-3'>
									<Form.Control
										placeholder="Password"
										type='password'
										autoComplete='new-password'
										{...register('password', {
											required: "Password missing",
											minLength: {
												value: 6,
												message: "Enter at least 6 characters"
											},
										})}
									/>
									{errors.password && <div className='invalid-value'>{errors.password.message ?? "Invalid value"}</div>}
									<Form.Text>At least 6 characters</Form.Text>
								</Form.Group>

								<Form.Group controlId='confirmPassword' className='mb-3'>
									<Form.Control
										autoComplete='off'
										placeholder="Confirm Password"
										type='password'
										{...register('passwordConfirm', {
											required: "Confirm Password missing",
											minLength: {
												value: 6,
												message: "Enter at least 6 characters"
											},
											validate: (value) => {
												return value === passwordRef.current || "Passwords don't match"
											}
										})}
									/>
									{errors.passwordConfirm && <div className='invalid-value'>{errors.passwordConfirm.message ?? "Invalid value"}</div>}
								</Form.Group>

								<Button
									disabled={isSubmitting}
									size='sm'
									type='submit'
									variant='primary'
								>{isSubmitting ? "Signing Up..." : "Sign Up"}</Button>
							</Form>
						</Card.Body>
					</Card>

					<div className='text-center mt-3'>
					<span className=' account sign-in'>
						Already have an account?<br />
						<Link to='/sign-in' className='sign-in-link'>
							Sign In
						</Link>
					</span>
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default SignUpPage
