import { FirebaseError } from 'firebase/app'
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import useGetPlace from '../../hooks/useGetPlace'
import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { placesCol } from '../../services/firebase'
import { Category, City, Place, Supply } from '../../types/Place.types'

const cities: City[] = ["Sao Paulo", "Malmö", "Copenhagen"];

const categories: Category[] = [
	'Café',
	'Pub',
	'Restaurant',
	'Fast Food',
	'Kiosk/grill',
	'Food Truck'
]

const supplyOptions: Supply[] = [
	'General Menu',
	'Lunch',
	'After Work',
	'Dinner',
	'Breakfast/Brunch'
]

const AdminEditPlaceForm = () => {
	const [isError, setIsError] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const { placeId } = useParams()
	const place = useGetPlace(placeId)

	const {
		handleSubmit,
		register,
		setValue,
		formState: { errors }
	} = useForm<Place>()

	const navigate = useNavigate()

	useEffect(() => {
		if (place.data) {
			setValue('description', place.data.description)
			setValue('city', place.data.city)
			setValue('category', place.data.category)
			setValue('supply', place.data.supply)
			setValue('email', place.data.email)
			setValue('telephone', place.data.telephone)
			setValue('website', place.data.website)
			setValue('facebook', place.data.facebook)
			setValue('instagram', place.data.instagram)
		}
	}, [place.data, setValue])

	const onSubmit = async (data: Place) => {
		try {
			setIsError(false)
			setErrorMessage(null)
			setIsSubmitting(true)

			if (!placeId) {
				setIsError(true)
				setErrorMessage("No place connected")
				setIsSubmitting(false)
				return
			}

			const docRef = doc(placesCol, placeId)
			const checkDoc = await getDoc(docRef)
			if (!checkDoc.exists()) {
				setIsError(true)
				setErrorMessage("Place doesn't exist")
				setIsSubmitting(false)
				return
			}

			await updateDoc(docRef, {
				...place.data,
				...data
			})

			toast.dark("Place updated")

			setIsSubmitting(false)

		} catch (error) {
			if (error instanceof FirebaseError) {
				setErrorMessage(error.message)
			} else {
				setErrorMessage("An error occurred while adding the place")
			}
			setIsError(true)
			setIsSubmitting(false)
		}
	}

	const handleDeletePlace = () => {
		const docRef = doc(placesCol, placeId)
		deleteDoc(docRef)

		toast.dark("Place deleted")

		navigate('/admin-places-list')
	}

	return (
		<Container className='py-3 center-y'>
			<Row>
				<Col md={{ span: 6, offset: 3 }}>
					<Card>
						<Card.Body>
							<Card.Title className='mb-3'>
								Edit {place.data?.name}
							</Card.Title>

							{isError && <Alert variant='danger'>{errorMessage}</Alert>}

							<Form onSubmit={handleSubmit(onSubmit)}>
								<Form.Group
									className='mb-3'
									controlId='description'
								>
									<Form.Control
										as='textarea'
										placeholder="Description*"
										rows={5}
										{...register('description', {
											required: "Description missing",
											minLength: {
												value: 10,
												message: "Enter at least 10 characters",
											},
											maxLength: {
												value: 300,
												message: "Maximum character limit exceeded (300 characters)",
											},
										})}
										className='roboto'
									/>
									{errors.description && (
										<Form.Text className='invalid-value'>
											{errors.description.message}
										</Form.Text>
									)}
									<Form.Text>Min: 10 characters, Max: 300 characters</Form.Text>
								</Form.Group>

								<Form.Group className="mb-3" controlId="city">
									<Form.Select
										aria-label="Select city of the place"
										className="form-select"
										id="city"
										{...register("city", {
											required: "City missing",
										})}
									>
										<option value="" defaultChecked>
											Select City*
										</option>
										{cities.map((city) => (
											<option key={city} value={city}>
												{city}
											</option>
										))}
									</Form.Select>
									{errors.city && (
										<Form.Text className="invalid-value">
											{errors.city.message}
										</Form.Text>
									)}
								</Form.Group>

								<Form.Group
									className='mb-3'
									controlId='category'
								>
									<Form.Select
										className='form-select'
										id='category'
										{...register('category', {
											required: "Category missing"
										})}
									>
										<option value='' defaultChecked>Select Category*</option>
										{categories.map((category) => (
											<option key={category} value={category}>
												{category}
											</option>
										))}
									</Form.Select>
									{errors.category && (
										<Form.Text className='invalid-value'>
											{errors.category.message}
										</Form.Text>
									)}
								</Form.Group>

								<Form.Group
									className='mb-3'
									controlId='supply'
								>
									<Form.Select
										className='form-select'
										id='supply'
										{...register('supply', {
											required: "Supply missing"
										})}
									>
										<option value='' defaultChecked>Select Supply*</option>
										{supplyOptions.map((supply) => (
											<option key={supply} value={supply}>
												{supply}
											</option>
										))}
									</Form.Select>
									{errors.supply && (
										<Form.Text className='invalid-value'>
											{errors.supply.message}
										</Form.Text>
									)}
								</Form.Group>

								<Form.Group
									className='mb-3'
									controlId='email'
								>
									<Form.Control
										placeholder="Email"
										type='email'
										{...register('email')}
									/>
									{errors.email && (
										<Form.Text className='invalid-value'>
											{errors.email.message}
										</Form.Text>
									)}
								</Form.Group>

								<Form.Group
									className='mb-3'
									controlId='telephone'
								>
									<Form.Control
										placeholder="Telephone"
										type='tel'
										{...register('telephone')}
									/>
								</Form.Group>

								<Form.Group
									className='mb-3'
									controlId='website'
								>
									<Form.Control
										placeholder="Website"
										type='url'
										{...register('website')}
									/>
								</Form.Group>

								<Form.Group
									className='mb-3'
									controlId='facebook'
								>
									<Form.Control
										placeholder="Facebook"
										type='url'
										{...register('facebook')}
									/>
								</Form.Group>

								<Form.Group
									className='mb-3'
									controlId='instagram'
								>
									<Form.Control
										placeholder="Instagram"
										type='url'
										{...register('instagram')}
									/>
								</Form.Group>

								<div className='d-flex justify-content-between'>
									<Button
										disabled={isSubmitting}
										size='sm'
										type='submit'
										variant='primary'
									>{isSubmitting ? "Submitting..." : "Submit"}</Button>

									<Button
										onClick={() => setShowDeleteModal(true)}
										size='sm'
										variant='danger'
									>Delete Place</Button>
								</div>

								<Modal
									centered
									onHide={() => setShowDeleteModal(false)}
									show={showDeleteModal}
								>
									<Modal.Header closeButton>
										<Modal.Title>
											Deleting {place.data?.name}
										</Modal.Title>
									</Modal.Header>
									<Modal.Body>
										Are you sure about this?
									</Modal.Body>
									<Modal.Footer>
										<Button
											onClick={() => setShowDeleteModal(false)}
											size='sm'
											variant='success'
										>No</Button>

										<Button
											onClick={handleDeletePlace}
											size='sm'
											variant='danger'
										>Yes, Delete forever</Button>
									</Modal.Footer>
								</Modal>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default AdminEditPlaceForm
