interface IProps {
	date: Date
}

const DateCell: React.FC<IProps> = ({ date }) =>
	new Intl.DateTimeFormat('us', {
		year: '2-digit',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	}).format(date)

export default DateCell
