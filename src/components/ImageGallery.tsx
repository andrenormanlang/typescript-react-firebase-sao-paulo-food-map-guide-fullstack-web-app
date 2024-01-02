import { Image } from 'react-bootstrap'
import Slider from 'react-slick'
import { Photo } from '../types/Photo.types'

interface IProps {
	photos: Photo[]
}

const ImageGallery: React.FC<IProps> = ({ photos }) => {
	const imagesVisible = 3

	const settings = {
		autoplay: photos.length > imagesVisible,
		dots: true,
		infinite: true,
		slidesToScroll: 1,
		slidesToShow: imagesVisible,
		className: 'my-3'
	}

	const elements = []
	for (let i = photos.length; i < imagesVisible; i++) {
		elements.push(
			<Image
				className='img-square'
				fluid
				key={i}
				src={'https://firebasestorage.googleapis.com/v0/b/the-hangry-app.appspot.com/o/places%2Fplaceholder%2Fplaceholder.png?alt=media&token=ea01596b-de27-48e1-b761-59f6a03a03a9'}
			/>
		)
	}

	return (
		<div className='px-3 pb-2'>
			<Slider {...settings}>
				{photos.map(photo => (
					<Image
						className='img-square p-1'
						fluid
						key={photo._id}
						rounded
						src={photo.url}
					/>
				))}
				{elements}
			</Slider>
		</div>
	)
}

export default ImageGallery
