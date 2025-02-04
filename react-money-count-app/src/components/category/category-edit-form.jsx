import React, { useEffect, useState } from "react"
import { Form, Image } from "react-bootstrap"
import NoImage from "../../../public/icons/no-image.svg"

const CategoryEditForm = (props) => {
	const [category, setCategory] = useState({});
	const [isEligible, setIsEligible] = useState(false);
	const [validated, setValidated] = useState(false);

	const handleFieldChange = (event) => {
		const { name, value } = event.target;
		setCategory(oldData => {
			return {
				...oldData,
				[name]: value,
			}
		});
	};

	useEffect(() => {
		if (props.categoryId != null || props.categoryId != undefined) {
			fetch(import.meta.env.VITE_REACT_APP_API_URL + "categories/" + props.categoryId)
				.then(cat => cat.json())
				.then(cat => {
					if (cat.status === true && cat.data !== null) {
						setCategory(cat.data);
						setIsEligible(true);
					}
				})
				.catch(err => {
					alert("Error getting data" + isEligible);
					setIsEligible(false);
					navigate('/');
				});
		}
		else {
			setIsEligible(true);
		}
	}, [])

	const putCategory = (categoryToEdit) => {
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "categories", {
			method: "PUT",
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(categoryToEdit)
		})
			.then(res => res.json())
			.then(res => {
				if (res.status === true && res.data !== null) {
					setCategory(res.data);
					alert('Updated succeslly');
					window.location.reload();
				}
				if (res.status === false)
					alert('Something went wrong');
			});
	}

	const postCategory = (categoryToEdit) => {
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "categories", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(categoryToEdit)
		})
			.then(res => res.json())
			.then(res => {
				if (res.status === true && res.data !== null) {
					setCategory(res.data);
					alert('Created succeslly');
					window.location.reload();
				}
				if (res.status === false)
					alert('Something went wrong');
			});
	}

	const handleIconUpload = (event) => {
		event.preventDefault();
		var file = event.target.files[0];
		const form = new FormData();
		form.append("iconFileName", file);
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "categories/upload-category-icon", {
			method: "POST",
			body: form
		})
			.then(res => res.json())
			.then(res => {
				var data = category;
				data.icon = res.iconFileName;
				setCategory(oldData => {
					return {
						...oldData,
						...data
					}
				})
			}).catch(err => alert("Something went wrong.."));
	}

	const handleSave = (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.stopPropagation();
			setValidated(true);
			return;
		}
		let categoryToEdit = category;
		if (categoryToEdit && categoryToEdit.id > 0) {
			categoryToEdit.id = props.categoryId;
			putCategory(categoryToEdit);
		}
		else {
			postCategory(categoryToEdit)
		}
	}

	const deleteCategory = (id) => {
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "categories?id=" + id, {
			method: "DELETE",
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			}
		})
			.then(res => res.json())
			.then(res => {
				if (res.status === true) {
					alert('Deleted succeslly');
					setIsEligible(false);
					setCategory({
						id: -1
					})
					window.location.reload()
				}
				if (res.status === false)
					alert('Something went wrong');
			});
	}

	return (
		<>
			{
				isEligible ?
					(<Form
						noValidate
						validated={validated}
						onSubmit={handleSave}
						className="d-flex flex-column h-100">
						<Form.Group className="d-flex flex-column align-items-center my-2 gap-3">
							<Image
								width="50"
								height="50"
								src={category?.icon ? category.icon : NoImage}
							/>
							<Form.Label
								className="btn btn-dark w-100"
								htmlFor="file-upload">
								Choose an image
							</Form.Label>
							<input
								type="file"
								id="file-upload"
								className="d-none"
								onChange={handleIconUpload}
							/>
						</Form.Group>
						<Form.Group className="my-2">
							<Form.Label> Name </Form.Label>
							<Form.Control
								name="name"
								value={category?.name || ''}
								required
								type="text"
								placeholder="e.g. Food"
								onChange={handleFieldChange}
							/>
							<Form.Control.Feedback type="invalid">
								Please enter correct name
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="mt-5 gap-5 d-flex align-self-center">
							<button className="button btn-dark">
								{props.categoryId && category && category.id ?
									"Update" : "Create"}
							</button>
							{props.categoryId && category && category.id ?
								(
									<button
										className="button btn-danger"
										type="button"
										onClick={() => deleteCategory(props.categoryId)}>
										Delete
									</button>
								) : ''
							}
						</Form.Group>
					</Form>)
					: ""
			}
		</>
	)
}

export default CategoryEditForm