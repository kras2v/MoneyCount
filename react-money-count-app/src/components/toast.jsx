import { Toast } from "react-bootstrap";

export const showMessageWindow = ({message, setMessage, setShowMessage}) => {
	setMessage(message);
	setShowMessage(true);
}

const CustomToast = ({message, setShow, show}) => {
	return (
		<div
			style={{
				position: 'fixed',
				top: '20px',
				right: '20px',
				zIndex: 1050,
			}}
		>
			<Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
				<Toast.Header>
					<img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
					<strong className="me-auto">MoneyCount</strong>
					<small>1 min ago</small>
				</Toast.Header>
				<Toast.Body>{message}</Toast.Body>
			</Toast>
		</div>
	);
};

export default CustomToast;