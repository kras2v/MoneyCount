import { useRef } from "react";
import { Toast } from "react-bootstrap";

export const createToast = ({ message, setToasts }) => {
	const newToast = {
		id: Date.now(),
		message: message,
		show: true,
	};
	setToasts((prevToasts) => [...prevToasts, newToast]);

	setTimeout(() => {
		setToasts((prevToasts) =>
			prevToasts.filter((toast) => toast.id !== newToast.id)
		);
	}, 3000);
};

export const estimateHeight = (message) => {
	const baseHeight = 50;
	const charsPerLine = 25;
	const lineHeight = 15;
	const extraLines = Math.ceil(message.length / charsPerLine);
	return baseHeight + extraLines * lineHeight;
};

const CustomToast = ({ message, setShow, show, index, top, height }) => {
	const toastRef = useRef(null);

	return (
		<div
			ref={toastRef}
			style={{
				position: "absolute",
				top: `${top}px`,
				right: "20px",
				zIndex: 1050 + index,
			}}
		>
			<Toast position="top-end" onClose={setShow} show={show} delay={3000} autohide>
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