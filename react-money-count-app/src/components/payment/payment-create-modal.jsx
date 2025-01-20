import React from "react"
import { Modal } from "react-bootstrap"
import EditPayment from "./payment-edit"

const CreatePaymentModal = (props) => {
	return (
		<>
			<Modal show={props.show} onHide={props.handleClose} centered fullscreen>
				<Modal.Header closeButton>
					<Modal.Title>
						Add new payment
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<EditPayment />
				</Modal.Body>
			</Modal>
		</>
	)
}

export default CreatePaymentModal