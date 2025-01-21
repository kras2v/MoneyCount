import React, { useEffect, useState } from "react"
import PaymentItem from "./payment-item";
import ReactPaginate from "react-paginate";

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

	return (
		<>
			{payments && payments.length > 0 ?
				(
					payments.map((p, i) => <PaymentItem key={i} data={p} />)
				) : ""
			}
			<div className="d-flex justify-content-center my-5">
				<ReactPaginate
					previousLabel={'previous'}
					nextLabel={'next'}
					breakLabel={'...'}
					breakClassName={'page-link'}
					pageCount={paymentsCount}
					marginPagesDisplayed={2}
					pageRangeDisplayed={5}
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