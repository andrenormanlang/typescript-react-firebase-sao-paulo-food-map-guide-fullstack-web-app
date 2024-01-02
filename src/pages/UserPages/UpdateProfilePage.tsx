import { FirebaseError } from 'firebase/app'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import useAuth from '../../hooks/useAuth'
import { useRef, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from "react-bootstrap/Container"
import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'
import { storage, usersCol } from '../../services/firebase'
import { UserUpdate } from '../../types/User.types'


const UpdateProfile = () => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [isError, setIsError] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [uploadProgress, setUploadProgress] = useState<number|null>(null)

	const {
		reloadUser,
		setDisplayName,
		setEmail,
		setPassword,
		setPhotoUrl,
		signedInUser,
		signedInUserName,
		signedInUserEmail,
		signedInUserPhotoUrl
	} = useAuth()

	const {
		handleSubmit,
		register,
		resetField,
		setValue,
		watch,
		formState: { errors }
	} = useForm<UserUpdate>({
		defaultValues: {
			displayName: signedInUserName ?? '',
			email: signedInUserEmail ?? ''
		}
	})

	const passwordRef = useRef('')
	passwordRef.current = watch('password') ?? ''

	const photoRef = useRef<FileList|null>(null)
	photoRef.current = watch('photoFile')

	if (!signedInUser) return

	const onUpdateProfile: SubmitHandler<UserUpdate> = async (data) => {
		setErrorMessage(null)
		setIsError(false)

		try {
			setIsSubmitting(true)

			if (data.displayName && data.displayName !== signedInUserName) {
				await setDisplayName(data.displayName)
				toast.dark("Name updated")
			}

			if (data.photoFile.length) {
				const photo = data.photoFile[0]

				const fileRef = ref(storage, `users/${signedInUser.uid}/${photo.name}`)

				const uploadTask = uploadBytesResumable(fileRef, photo)

				uploadTask.on('state_changed', snapshot => {
					setUploadProgress(Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 1000) / 10)

				}, (error) => {
					setIsError(true)
					setErrorMessage(error.message)

				}, async () => {
					setUploadProgress(null)
					resetField('photoFile')

					const photoUrl = await getDownloadURL(fileRef)
					await setPhotoUrl(photoUrl)
					await reloadUser()
					if (photoRef.current) photoRef.current = null
				})
			}

			if (data.email && data.email !== signedInUserEmail) {
				await setEmail(data.email)
				toast.dark("Email updated")
			}

			if (data.password) {
				try {
					await setPassword(data.password)

					const docRef = doc(usersCol, signedInUser.uid)
					updateDoc(docRef, {
						updatedAt: serverTimestamp()
					})

					toast.dark("Password updated")

				} catch (error) {
					setIsError(true)
					setErrorMessage("Please sign out and in again before changing password")
				}

				setValue('password', '')
				setValue('passwordConfirm', '')
			}

			await reloadUser()

			setIsSubmitting(false)

		} catch (error) {
			if (error instanceof FirebaseError) {
				setErrorMessage(error.message)
			} else {
				setErrorMessage("Something went wrong when trying to update profile")
			}
			setIsSubmitting(false)
		}
	}

	const handleUpdatePhoto = async (photoUrl: string) => {
		await setPhotoUrl(photoUrl)
		await reloadUser()
	}

	return (
		<Container className='py-3 center-y'>
			<Row>
				<Col md={{ span: 6, offset: 3 }}>
					<Card>
						<Card.Body>
							<Card.Title className='mb-3'>Update Profile</Card.Title>

							{isError && (<Alert variant='danger'>{errorMessage}</Alert>)}

							<Form onSubmit={handleSubmit(onUpdateProfile)}>
								<Form.Group controlId='displayName' className='mb-3'>
									<Form.Label>Name</Form.Label>
									<Form.Control
										type='text'
										{...register('displayName')}
									/>
								</Form.Group>

								<div className='d-flex justify-content-center my-3'>
									<Image
										className='img-square w-50'
										src={signedInUserPhotoUrl || 'https://via.placeholder.com/225'}
										width={100}
										fluid
										roundedCircle
									/>
								</div>

								<div className='d-flex justify-content-evenly mb-3'>
									<Button
										disabled={signedInUserPhotoUrl === null}
										onClick={() => handleUpdatePhoto('')}
										size='sm'
										variant='danger'
									>Delete photo</Button>

									<Button
										disabled={signedInUserPhotoUrl === 'https://picsum.photos/200'}
										onClick={() => handleUpdatePhoto('https://picsum.photos/200')}
										size='sm'
										variant='primary'
									>Random photo</Button>
								</div>

								<Form.Group controlId='photo' className='mb-3'>
									<Form.Label>Photo</Form.Label>
									<Form.Control
										accept='image/jpeg, image/png, image/webp, image/gif'
										type='file'
										{...register('photoFile')}
									/>
									{errors.photoFile && <p className='invalid-value'>{errors.photoFile.message ?? "Invalid value"}</p>}
									<Form.Text>
										{uploadProgress !== null
											? (
												<ProgressBar
													now={uploadProgress}
													label={`${uploadProgress}%`}
													animated
													className='mt-1'
													variant='primary'
												/>
											)
											: photoRef.current && photoRef.current.length > 0 && (
												<span>
													{photoRef.current[0].name}
													{' '}
													({Math.round(photoRef.current[0].size / 1024)} kB)
												</span>
											)
										}
									</Form.Text>
								</Form.Group>

								<Form.Group controlId='email' className='mb-3'>
									<Form.Label>Email</Form.Label>
									<Form.Control
										disabled
										type='email'
										{...register('email')}
									/>
								</Form.Group>

								<Form.Group controlId='password' className='mb-3'>
									<Form.Label>Password</Form.Label>
									<Form.Control
										autoComplete='new-password'
										type='password'
										{...register('password', {
											minLength: {
												value: 6,
												message: "Enter at least 6 characters"
											},
										})}
									/>
									{errors.password && <p className='invalid-value'>{errors.password.message ?? "Invalid value"}</p>}
									<Form.Text>At least 6 characters</Form.Text>
								</Form.Group>

								<Form.Group controlId="confirmPassword" className="mb-3">
									<Form.Label>Confirm Password</Form.Label>
									<Form.Control
										autoComplete='off'
										type='password'
										{...register('passwordConfirm', {
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
								>
									{isSubmitting ? "Updating Profile..." : "Update Profile"}
								</Button>
							</Form>
						</Card.Body>
					</Card>

				</Col>
			</Row>
		</Container>
	)
}

export default UpdateProfile
