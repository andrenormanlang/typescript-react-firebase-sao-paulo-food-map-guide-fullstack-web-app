import Image from 'react-bootstrap/Image'

interface IProps {
	alt: string
	src: string
}

const PhotoCell: React.FC<IProps> = ({ alt, src }) =>
	<Image
		alt={alt}
		className='img-square'
		rounded
		src={src}
		title={alt}
		width={50}
	/>

export default PhotoCell
