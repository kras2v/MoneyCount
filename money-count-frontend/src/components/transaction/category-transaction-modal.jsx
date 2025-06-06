import React from "react"
import { Modal } from "react-bootstrap"
import CategoryList from "../category/category-list";

const CategoryModal = (props) => {

	const updateValueAndClose = (param) => {
		if (props.setCategoryToUpdate) {
			props.setCategoryToUpdate({
				id: param.data.id,
				name: param.data.name,
				icon: param.data.icon
			});
		}
		console.log(param.data.id)
		props.handleClose();
	}
	return (
		<>
			<Modal
				show={props.show}
				onHide={props.handleClose}
				centered
				style={{ background: 'rgba(0,0,0,0.5)' }}>
				<Modal.Header closeButton>
					<Modal.Title>
						Choose your category
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className="d-flex flex-column mx-auto">
					<CategoryList showRedirectButton={true}
						function={updateValueAndClose}
						amountInRow={3} />
				</Modal.Body>
			</Modal>
		</>
	)
}

export default CategoryModal