import React from "react"
import { Modal } from "react-bootstrap"
import EditTransaction from "./transaction-edit-form"

const CreateTransactionModal = (props) => {
	return (
		<>
			<Modal
				show={props.show}
				onHide={props.handleClose}
				centered
				fullscreen
			>
				<Modal.Header closeButton>
					<Modal.Title>
						Add new Transaction
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<EditTransaction />
				</Modal.Body>
			</Modal>
		</>
	)
}

export default CreateTransactionModal