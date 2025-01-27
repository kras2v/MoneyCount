import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap"
import CategoryModal from "../category/category-payment-modal";
import NoImage from "../../../public/icons/no-image.svg"
import CustomToggle from "../custom-toggle";

const EditPayment = (props) => {
	const [payment, setPayment] = useState(null);
	const [category, setCategory] = useState({});
	const [validated, setValidated] = useState(false);
	const [isEligible, setIsEligible] = useState(false);
	const [showCategories, setShowCategories] = useState(false);
	const [isIncome, setIsIncome] = useState(false);
	const navigate = useNavigate();
	let params = useParams();

	const handleFieldChange = (event) => {
		const { name, value } = event.target;
		setPayment(oldData => {
			return {
				...oldData,
				[name]: value,
			}
		});
	};

	useEffect(() => {
		if (params.paymentid != undefined) {
			fetch(import.meta.env.VITE_REACT_APP_API_URL + "Payment/" + params.paymentid)
				.then(paym => paym.json())
				.then(paym => {
					if (paym.status === true && paym.data !== null) {
						setPayment(paym.data);
						setIsEligible(true);
					}
					setCategory({
						id: paym.data.category.id,
						name: paym.data.category.name,
						icon: paym.data.category.icon
					})
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

	const putPayment = (paymentToEdit) => {
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "Payment", {
			method: "PUT",
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(paymentToEdit)
		})
			.then(res => res.json())
			.then(res => {
				if (res.status === true && res.data !== null) {
					setPayment(res.data);
					alert('Updated succeslly');
					window.location.reload();
				}
				if (res.status === false)
					alert('Something went wrong');
			});
	}

	const postPayment = (paymentToEdit) => {
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "Payment", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(paymentToEdit)
		})
			.then(res => res.json())
			.then(res => {
				if (res.status === true && res.data !== null) {
					setPayment(res.data);
					alert('Created succeslly');
					window.location.reload();
				}
				if (res.status === false)
					alert('Something went wrong');
			});
	}

	const deletePayment = (id) => {
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "Payment?id=" + id, {
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
					setPayment({
						id: -1
					})
					navigate('/');
				}
				if (res.status === false)
					alert('Something went wrong');
			});
	}

	const handleSave = (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.stopPropagation();
			setValidated(true);
			return;
		}
		let paymentToEdit = payment;
		paymentToEdit.categoryId = category.id;
		paymentToEdit.amount = isIncome ? paymentToEdit.amount : -paymentToEdit.amount;
		if (payment && payment.id > 0) {
			putPayment(paymentToEdit);
		}
		else {
			postPayment(paymentToEdit)
		}
	}

	return (
		<>
			{
				isEligible ?
					<div
						className={
							(params.paymentid && payment ? "custom-container " : "") +
							"d-flex justify-content-center align-items-center h-100"
						}
					>
						<Form
							noValidate
							validated={validated}
							onSubmit={handleSave}
							className="w-75"
						>
							<Form.Group className="my-4" controlId="formpaymentAmount">
								<Form.Label className="fw-bold text-secondary">Amount</Form.Label>
								<Form.Control
									name="amount"
									value={payment?.amount ? (payment?.amount < 0 ? -payment?.amount : payment?.amount) : ""}
									className={`${isIncome ? "bg-success " : "bg-danger "
										}bg-opacity-10 form-control-lg border-0 shadow-sm`}
									required
									min="0.01"
									max="9007199254740991"
									step="0.01"
									type="number"
									placeholder="Enter a number"
									onChange={handleFieldChange}
								/>
								<Form.Control.Feedback type="invalid">Please enter a correct amount</Form.Control.Feedback>
							</Form.Group>
							<Form.Group>
								<CustomToggle isIncome={isIncome} setIsIncome={setIsIncome} />
							</Form.Group>
							<Form.Group className="my-4" controlId="formpaymentName">
								<Form.Label className="fw-bold text-secondary">Name</Form.Label>
								<Form.Control
									name="name"
									value={payment?.name || ''}
									required
									type="text"
									placeholder="e.g. Products"
									onChange={handleFieldChange}
									className="form-control-lg border-0 shadow-sm"
								/>
								<Form.Control.Feedback type="invalid">Please enter a correct name</Form.Control.Feedback>
							</Form.Group>
							<Form.Group className="my-4" controlId="formpaymentDescription">
								<Form.Label className="fw-bold text-secondary">Description</Form.Label>
								<Form.Control
									name="description"
									value={payment?.description || ''}
									as="textarea"
									rows={3}
									placeholder="Milk, bread..."
									onChange={handleFieldChange}
									className="form-control-lg border-0 shadow-sm"
								/>
								<Form.Control.Feedback type="invalid">Please enter a correct description</Form.Control.Feedback>
							</Form.Group>
							<Form.Group className="my-4" controlId="formpaymentCategoryId">
								<button
									value={category.id}
									className="btn btn-dark w-100 d-flex justify-content-center align-items-center gap-3 py-3 rounded-3 shadow-sm"
									type="button"
									onClick={() => { setShowCategories(true); }}
								>
									<img
										src={category?.icon ? category.icon : NoImage}
										alt={category.name}
										style={{ filter: 'invert(1)', marginRight: '2px' }}
										className="category-icon"
									/>
									{category?.name ? category.name : "Choose category"}
								</button>
							</Form.Group>
							<Form.Group className="my-4" controlId="formpaymentPaymentDate">
								<Form.Label className="fw-bold text-secondary">Date</Form.Label>
								<Form.Control
									name="paymentDate"
									value={payment?.paymentDate ? payment.paymentDate.slice(0, 10) : new Date().toISOString().split('T')[0]}
									type="date"
									max={new Date().toISOString().split('T')[0]}
									placeholder="Today"
									onChange={handleFieldChange}
									className="form-control-lg border-0 shadow-sm"
								/>
								<Form.Control.Feedback type="invalid">Please enter a date not earlier than today</Form.Control.Feedback>
							</Form.Group>
							<Form.Group className="d-flex mt-5 gap-5 justify-content-between">
								<button className="btn btn-dark btn-lg px-5 py-2 shadow-sm" type="submit">
									{params.paymentid === undefined ? "Create" :
										params.paymentid && payment && payment.id ? "Update" : ''}
								</button>
								{params.paymentid && payment && payment.id ? (
									<button
										className="btn btn-danger btn-lg px-5 py-2 shadow-sm"
										type="button"
										onClick={() => deletePayment(params.paymentid)}
									>
										Delete
									</button>
								) : ''}
							</Form.Group>
						</Form>
						<CategoryModal
							setCategoryToUpdate={setCategory}
							show={showCategories}
							handleClose={() => { setShowCategories(false); }}
						/>
					</div>
					: ""
			}
		</>
	)
}

export default EditPayment