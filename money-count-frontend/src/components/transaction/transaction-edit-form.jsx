import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Spinner } from "react-bootstrap";
import CategoryModal from "./category-transaction-modal";
import NoImage from "../../../public/icons/no-image.svg";
import CustomToggle from "../custom-toggle";
import CustomToast, { createToast, estimateHeight } from "../../components/toast";

const EditTransaction = (props) => {
	const [Transaction, setTransaction] = useState(null);
	const [category, setCategory] = useState({});

	const [validated, setValidated] = useState(false);
	const [isEligible, setIsEligible] = useState(false);
	const [loading, setLoading] = useState(true); // Added loading state

	const [showCategories, setShowCategories] = useState(false);
	const [isIncome, setIsIncome] = useState(false);

	const [toasts, setToasts] = useState([]);

	const navigate = useNavigate();
	let params = useParams();

	const handleFieldChange = (event) => {
		const { name, value } = event.target;
		setTransaction((oldData) => {
			return {
				...oldData,
				[name]: value,
			};
		});
	};

	useEffect(() => {
		if (params.Transactionid != undefined) {
			fetch(import.meta.env.VITE_REACT_APP_API_URL + "Transactions/" + params.Transactionid, {
				method: "GET",
				credentials: "include",
			})
				.then((paym) => paym.json())
				.then((paym) => {
					if (paym.status === true && paym.data.transaction !== null) {
						setIsIncome(paym.data.transaction.amount > 0);
						if (paym.data.transaction.amount < 0)
							paym.data.transaction.amount = -paym.data.transaction.amount;
						setTransaction(paym.data.transaction);
						setIsEligible(true);
					}
					setCategory({
						id: paym.data.transaction.category.id,
						name: paym.data.transaction.category.name,
						icon: paym.data.transaction.category.icon,
					});
					setLoading(false);
				})
				.catch((err) => {
					createToast({ message: "Could not find a transaction with id: " + params.Transactionid, setToasts })
					setIsEligible(false);
					setLoading(false);
					navigate("/");
				});
		} else {
			setIsEligible(true);
			setLoading(false);
		}
	}, []);

	const putTransaction = (TransactionToEdit) => {
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "Transactions", {
			method: "PUT",
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
			},
			body: JSON.stringify(TransactionToEdit),
			credentials: "include",
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.status === true && res.data !== null) {
					setTransaction(res.data);
					createToast({ message: "Transaction updated successfully", setToasts })
					window.location.reload();
				}
				if (res.status === false) createToast({ message: "Error while updating transaction.", setToasts })
			}).catch(err => { createToast({ message: "Error while updating transaction.", setToasts }); });
	};

	const postTransaction = (TransactionToEdit) => {
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "transactions", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
			},
			body: JSON.stringify(TransactionToEdit),
			credentials: "include",
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.status === true && res.data !== null) {
					setTransaction(res.data);
					createToast({ message: "Transaction created successfully", setToasts })
					window.location.reload();
				}
				if (res.status === false) createToast({ message: res.message ? res.message : "Error while creating transaction.", setToasts })
			}).catch(err => { createToast({ message: "Error while creating transaction.", setToasts }); });
		;
	};

	const deleteTransaction = (id) => {
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "transactions?id=" + id, {
			method: "DELETE",
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
			},
			credentials: "include",
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.status === true) {
					createToast({ message: "Transaction deleted successfully", setToasts })
					setTransaction({
						id: -1,
					});
					navigate("/transactions");
				}
				if (res.status === false) createToast({ message: "Error while deleting transaction.", setToasts })
			}).catch(err => { createToast({ message: "Error while deleting transaction.", setToasts }); });
	};

	const handleSave = (event) => {
		let isError = false;
		event.preventDefault();
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.stopPropagation();
			createToast({ message: "A validation error occurred. Please try again.", setToasts: setToasts });
			setValidated(true);
			isError = true;
		}
		let TransactionToEdit = Transaction;
		TransactionToEdit.categoryId = category.id;
		TransactionToEdit.amount = isIncome ? Transaction.amount : -Transaction.amount;
		if (Transaction && Transaction.id > 0) {
			putTransaction(TransactionToEdit);
		} else {
			postTransaction(TransactionToEdit);
		}
	};

	const handleToggle = () => {
		setIsIncome(!isIncome);
	};

	return (
		<>
			{loading ? (
				<div className="d-flex justify-content-center align-items-center h-100">
					<Spinner animation="border" variant="primary" />
				</div>
			) : isEligible ? (
				<div
					className={
						(params.Transactionid && Transaction ? "custom-container " : "") +
						"d-flex justify-content-center align-items-center h-100"
					}
				>
					<Form noValidate validated={validated} onSubmit={handleSave} className="w-75">
						<Form.Group className="my-4" controlId="formTransactionAmount">
							<Form.Label className="fw-bold text-secondary">Amount</Form.Label>
							<div className="input-group">
								<span className="input-group-text">₴</span>
								<Form.Control
									name="amount"
									value={
										Transaction?.amount
											? Math.abs(Transaction.amount) : ""
									}
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
							</div>
							<Form.Control.Feedback type="invalid">
								Please enter a correct amount
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group>
							<CustomToggle
								offstyle={"danger"}
								onstyle={"success"}
								on={"income"}
								off={"outcome"}
								isActive={isIncome}
								marginLeft={"5px"}
								handleToggle={handleToggle}
							/>
						</Form.Group>
						<Form.Group className="my-4" controlId="formTransactionName">
							<Form.Label className="fw-bold text-secondary">Name</Form.Label>
							<Form.Control
								name="name"
								value={Transaction?.name || ""}
								required
								type="text"
								placeholder="e.g. Products"
								onChange={handleFieldChange}
								className="form-control-lg border-0 shadow-sm"
							/>
							<Form.Control.Feedback type="invalid">
								Please enter a correct name
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="my-4" controlId="formTransactionDescription">
							<Form.Label className="fw-bold text-secondary">Description</Form.Label>
							<Form.Control
								name="description"
								value={Transaction?.description || ""}
								as="textarea"
								rows={3}
								placeholder="Milk, bread..."
								onChange={handleFieldChange}
								className="form-control-lg border-0 shadow-sm"
							/>
							<Form.Control.Feedback type="invalid">
								Please enter a correct description
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="my-4" controlId="formTransactionCategoryId">
							<button
								value={category.id}
								className="btn btn-dark w-100 d-flex justify-content-center align-items-center gap-3 py-3 rounded-3 shadow-sm"
								type="button"
								onClick={() => {
									setShowCategories(true);
								}}
							>
								<img
									src={category?.icon ? category.icon : NoImage}
									alt={category.name}
									style={{ filter: "invert(1)", marginRight: "2px" }}
									className="category-icon"
								/>
								{category?.name ? category.name : "Choose category"}
							</button>
						</Form.Group>
						<Form.Group className="my-4" controlId="formTransactionTransactionDate">
							<Form.Label className="fw-bold text-secondary">Date</Form.Label>
							<Form.Control
								name="transactionDate"
								value={
									Transaction?.transactionDate
										? Transaction.transactionDate.split("T")[0]
										: new Date().toISOString().split("T")[0]
								}
								type="date"
								max={new Date().toISOString().split("T")[0]}
								placeholder="Today"
								onChange={handleFieldChange}
								className="form-control-lg border-0 shadow-sm"
							/>
							<Form.Control.Feedback type="invalid">
								Please enter a date not earlier than today
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="d-flex mt-5 gap-5 justify-content-between">
							<button className="btn btn-dark btn-lg px-5 py-2 shadow-sm" type="submit">
								{params.Transactionid === undefined
									? "Create"
									: params.Transactionid && Transaction && Transaction.id
										? "Update"
										: ""}
							</button>
							{params.Transactionid && Transaction && Transaction.id ? (
								<button
									className="btn btn-danger btn-lg px-5 py-2 shadow-sm"
									type="button"
									onClick={() => deleteTransaction(params.Transactionid)}
								>
									Delete
								</button>
							) : (
								""
							)}
						</Form.Group>
					</Form>
					<CategoryModal
						setCategoryToUpdate={setCategory}
						show={showCategories}
						handleClose={() => {
							setShowCategories(false);
						}}
					/>
					<div style={{ position: "fixed", top: 20, right: 20, zIndex: 1050 }}>
						{toasts.reduce((acc, toast, index) => {
							const height = estimateHeight(toast.message);
							const totalHeight = acc.prevHeight;
							acc.prevHeight += height + 10;

							acc.elements.push(
								<CustomToast
									key={toast.id}
									message={toast.message}
									setShow={() => {
										setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toast.id));
									}}
									show={toast.show}
									index={index}
									top={totalHeight}
								/>
							);

							return acc;
						}, { elements: [], prevHeight: 0 }).elements}
					</div>
				</div>
			) : (
				""
			)}
		</>
	);
};

export default EditTransaction;