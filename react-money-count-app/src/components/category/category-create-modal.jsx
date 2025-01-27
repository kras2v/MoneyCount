import React from "react";
import { Modal } from "react-bootstrap"
import CategoryEditForm from "./category-edit-form"

const CategoryCreateModal = (props) => {
	return (
		<>
			<Modal
				show={props.show}
				onHide={props.handleClose}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>
						{props?.categoryId ?
							"Update the category" : "Add new category"}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<CategoryEditForm categoryId={props.categoryId} />
				</Modal.Body>
			</Modal>
		</>
	)
}

export default CategoryCreateModal;