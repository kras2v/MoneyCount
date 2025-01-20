import React, { useState } from "react"
import CategoryList from "../components/category/category-list";
import CategoryItem from "../components/category/category-item"

const Categories = () => {

	const putCategory = (paymentToEdit) => {
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "Category", {
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
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "Category", {
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
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "Category?id=" + id, {
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

	const [show, setShow] = useState(false);
	return (
		<>
			<div className="container my-5">
				<div className="row border border-dark justify-content-between align-items-center">
					<div className="col-10 my-3">
						<h2>Categories</h2>
					</div>
					<div className="col-2">
						<button className="btn btn-outline-dark custom-btn" type="button"
							onClick={() => console.log(2)}>
							<img src={"../../../../public/icons/New.svg"} alt="NewItem" className="category-icon"></img>
							Create new
						</button>
					</div>
				</div>
				<div className="row">
					<CategoryList updateValueAndClose={() => { console.log(1) }}
						amountInRow={100000000} />
				</div>
			</div>
		</>
	)
}

export default Categories