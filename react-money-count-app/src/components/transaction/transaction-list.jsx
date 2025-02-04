import React, { useEffect, useState } from "react";
import TransactionItem from "./transaction-item";
import ReactPaginate from "react-paginate";
import TransactionSearch from "./transaction-search"
import { Fragment } from "react";

const TransactionList = () => {
	const [Transactions, setTransactions] = useState(null);
	const [TransactionsCount, setTransactionsCount] = useState(0);
	const [page, setPage] = useState(0);
	const [filteredTransactions, setFilteredTransactions] = useState(null);

	useEffect(() => {
		getTransactions();
	}, [page]);

	const getTransactions = () => {
		fetch(
			import.meta.env.VITE_REACT_APP_API_URL +
			"transactions?pageIndex=" +
			page +
			"&pageSize=" +
			import.meta.env.VITE_REACT_APP_PAGING_SIZE
		)
			.then((res) => res.json())
			.then((res) => {
				if (res.status === true && res.data.count > 0) {
					setTransactions(res.data.transactions);
					setFilteredTransactions(res.data.transactions);
					setTransactionsCount(Math.ceil(res.data.count / import.meta.env.VITE_REACT_APP_PAGING_SIZE));
				}
				if (res.data.count === 0) {
					alert("There is no transaction in the system.");
				}
			})
			.catch(() => alert("Error getting data."));
	};

	const handlePageClick = (pageIndex) => {
		setPage(pageIndex.selected);
	};

	const getUnique = (Transactions) => {
		const uniqueArrayOfDates = [
			...new Set(
				Transactions.map((paym) => paym.paymentDate.split("T")[0])
			),
		];
		return uniqueArrayOfDates;
	};


	return (
		<>
			<TransactionSearch Transactions={Transactions} setFilteredTransactions={setFilteredTransactions} />

			{filteredTransactions && filteredTransactions.length > 0 ? (
				getUnique(filteredTransactions).map((date, i) => (
					<Fragment key={i}>
						<div className="row border border-dark justify-content-center bg-light rounded my-3 py-2">
							<h4 className="text-center text-secondary">{new Date(date).toUTCString().slice(4, 16)}</h4>
						</div>
						{filteredTransactions
							.filter((p) => p.paymentDate.split("T")[0] === date)
							.map((p) => (
								<TransactionItem key={p.id} data={p} />
							))}
					</Fragment>
				))
			) : (
				<div className="text-center mt-5">
					<h4>No Transactions found.</h4>
				</div>
			)}

			<div className="d-flex justify-content-center my-5 p-0">
				<ReactPaginate
					previousLabel={"<"}
					nextLabel={">"}
					breakLabel={"..."}
					breakClassName={"page-link"} 	
					pageCount={TransactionsCount}
					marginPagesDisplayed={2}
					pageRangeDisplayed={1}
					onPageChange={handlePageClick}
					containerClassName={"pagination"}
					pageClassName={"page-item"}
					pageLinkClassName={"page-link"}
					previousClassName={"page-item stylish-btn me-5"}
					nextClassName={"page-item stylish-btn ms-5"}
					activeClassName={"active"}
				/>
			</div>
		</>
	);
};

export default TransactionList;
