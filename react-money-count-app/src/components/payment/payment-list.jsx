import React, { useEffect, useState } from "react";
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
		fetch(
			import.meta.env.VITE_REACT_APP_API_URL +
			"Payment?pageIndex=" +
			page +
			"&pageSize=" +
			import.meta.env.VITE_REACT_APP_PAGING_SIZE
		)
			.then((res) => res.json())
			.then((res) => {
				if (res.status === true && res.data.count > 0) {
					setPayments(res.data.payments);
					setPaymentsCount(Math.ceil(res.data.count / import.meta.env.VITE_REACT_APP_PAGING_SIZE));
				}
				if (res.data.count === 0) {
					alert("There is no payment in the system.");
				}
			})
			.catch((err) => alert("Error getting data."));
	};

	const handlePageClick = (pageIndex) => {
		setPage(pageIndex.selected);
	};

	const getUnique = (payments) => {
		const uniqueArrayOfDates = [
			...new Set(
				payments.map((paym) => {
					return paym.paymentDate.split("T")[0];
				})
			),
		];
		return uniqueArrayOfDates;
	};

	return (
		<>
			{payments && payments.length > 0 ? (
				getUnique(payments).map((date, i) => (
					<Fragment key={i}>
						<div className="row border border-dark justify-content-center bg-light rounded my-3 py-2">
							<h4 className="text-center text-secondary">{new Date(date).toUTCString().slice(4, 16)}</h4>
						</div>
						{payments
							.filter((p) => p.paymentDate.split("T")[0] === date)
							.map((p) => (
								<PaymentItem key={p.id} data={p} />
							))}
					</Fragment>
				))
			) : (
				<div className="text-center mt-5">
					<h4>No payments found.</h4>
				</div>
			)}

			<div className="d-flex justify-content-center my-5 p-0">
				<ReactPaginate
					previousLabel={"<"}
					nextLabel={">"}
					breakLabel={"..."}
					breakClassName={"page-link"}
					pageCount={paymentsCount}
					marginPagesDisplayed={2}
					pageRangeDisplayed={1}
					onPageChange={handlePageClick}
					containerClassName={"pagination"}
					pageClassName={"page-item"}
					pageLinkClassName={"page-link"}
					previousClassName={
						"page-item stylish-btn me-5"
					}
					nextClassName={
						"page-item stylish-btn ms-5"
					}
					activeClassName={"active"}
				/>
			</div>
		</>
	);
};

export default PaymentsList;
