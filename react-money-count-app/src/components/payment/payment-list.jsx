import React, { useEffect, useState } from "react"
import PaymentItem from "./payment-item";
import ReactPaginate from "react-paginate";
import { Fragment } from "react";

const PaymentsList = () => {
	const [payments, setPayments] = useState(null);
	const [paymentsCount, setPaymentsCount] = useState(0);
	const [page, setPage] = useState(0);

	useEffect(() => {
		getPayments();
	}, [page]);

	const getPayments = () => {
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "Payment?pageIndex=" + page + "&pageSize=" + import.meta.env.VITE_REACT_APP_PAGING_SIZE)
			.then(res => res.json())
			.then(res => {
				if (res.status === true && res.data.count > 0) {
					setPayments(res.data.payments);
					setPaymentsCount(Math.ceil(res.data.count / import.meta.env.VITE_REACT_APP_PAGING_SIZE))
				}
				if (res.data.count === 0) {
					alert("There is no payment in a system.");
				}
			})
			.catch(err => alert("Error getting data."));
	}

	const handlePageCLick = (pageIndex) => {
		setPage(pageIndex.selected);
	}

	const getUnique = (payments) => {
		const uniqueArrayOfDates = [...new Set(payments.map((paym) => {
			return (paym.paymentDate.split("T")[0]);
		}))];
		return uniqueArrayOfDates;
	}

	return (
		<>
			{
				payments && payments.length > 0 ?
					(getUnique(payments).map((date, i) =>
					(
						<Fragment key={i}>
							<div className="row border border-dark justify-content-center">
								{new Date(date).toUTCString().slice(4, 16)}
							</div>
							{
								payments.filter(p => p.paymentDate.split("T")[0] === date)
									.map((p, j) =>
										<PaymentItem key={p.id} data={p} />
									)
							}
						</Fragment>
					)))
					: ""
			}
			<div className="d-flex justify-content-center my-5 p-0">
			<hr/>
				<ReactPaginate
					previousLabel={'previous'}
					nextLabel={'next'}
					breakLabel={'...'}
					breakClassName={'page-link'}
					pageCount={paymentsCount}
					marginPagesDisplayed={2}
					pageRangeDisplayed={3}
					onPageChange={handlePageCLick}
					containerClassName={'pagination'}
					pageClassName={'page-item'}
					pageLinkClassName={'page-link'}
					previousClassName={'page-link'}
					nextClassName={'page-link'}
					activeClassName={'page-link'}
				/>
			</div>
		</>
	)
}

export default PaymentsList