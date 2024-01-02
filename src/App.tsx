import RequireAuth from './components/RequireAuth'
import RequireAuthAdmin from './components/RequireAuthAdmin'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import AdminEditPlaceForm from './pages/AdminPages/AdminEditPlaceForm'
import AdminUsersListPage from './pages/AdminPages/AdminUsersListPage'
import AdminPhotosListPage from './pages/AdminPages/AdminPhotosListPage'
import AdminPlacesListPage from './pages/AdminPages/AdminPlacesListPage'
import ForgotPasswordPage from './pages/GuestPages/ForgotPasswordPage'
import HomePage from './pages/GuestPages/HomePage'
import NotFoundPage from './pages/GuestPages/NotFoundPage'
import SignInPage from './pages/GuestPages/SignInPage'
import SignOutPage from './pages/GuestPages/SignOutPage'
import SignUpPage from './pages/GuestPages/SignUpPage'
import Navigation from './pages/Partials/Navigation'
import PlaceFormPage from './pages/UserPages/PlaceFormPage'
import UpdateProfilePage from './pages/UserPages/UpdateProfilePage'
import UploadPhotoPage from './pages/UserPages/UploadPhotoPage'
import Container from 'react-bootstrap/Container'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './assets/scss/App.scss'

const App = () => {
	return (
		<div id='App'>
			<Navigation />

			<Container fluid>
				<Routes>
					{/* Guest Routes */}
					<Route path='*' element={<NotFoundPage />} />
					<Route path='/forgot-password' element={<ForgotPasswordPage />} />
					<Route path='/sign-in' element={<SignInPage />} />
					<Route path='/sign-out' element={<SignOutPage />} />
					<Route path='/sign-up' element={<SignUpPage />} />
					<Route path='/' element={<HomePage />} />

					{/* Protected Routes: */}
					{/* Admin Routes */}
					<Route path='/admin-places-list' element={
						<RequireAuthAdmin>
							<AdminPlacesListPage />
						</RequireAuthAdmin>
					} />

					<Route path='/admin-users-list' element={
						<RequireAuthAdmin>
							<AdminUsersListPage />
						</RequireAuthAdmin>
					} />

					<Route path='/admin-photos-list' element={
						<RequireAuthAdmin>
							<AdminPhotosListPage />
						</RequireAuthAdmin>
					} />

					<Route path='/admin-edit-place/:placeId' element={
						<RequireAuthAdmin>
							<AdminEditPlaceForm />
						</RequireAuthAdmin>
					} />

					{/* User Routes */}
					<Route
						path='/update-profile'
						element={
							<RequireAuth>
								<UpdateProfilePage />
							</RequireAuth>
						}
					/>
					<Route
						path='/place-form'
						element={
							<RequireAuth>
								<PlaceFormPage />
							</RequireAuth>
						}
					/>

					<Route
						path='/upload-photo/:placeId'
						element={
							<RequireAuth>
								<UploadPhotoPage />
							</RequireAuth>
						}
					/>
				</Routes>

				<ToastContainer
					autoClose={3000}
					theme='colored'
					position='bottom-right'
				/>
			</Container>
		</div>
	)
}

export default App
