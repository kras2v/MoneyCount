import React, { useState } from "react"
import TransactionsList from "../components/transaction/transaction-list"
import CreateTransactionModel from "../components/transaction/transaction-create-modal"

const Transactions = () => {
	const [show, setShow] = useState(false);

	return (
		<>
			<div className="custom-container">
				<div className="row border border-dark justify-content-between align-items-center bg-dark text-white py-3 px-4 rounded">
					<div className="col-8 d-flex justify-content-start align-items-center">
						<h2 className="m-0">💸 Transactions</h2>
					</div>
					<div className="col-3 d-flex justify-content-end">
						<button
							type="button"
							className="btn btn-outline-light btn-lg shadow-sm"
							onClick={() => { setShow(true); }}
						>
							➕ Add Transaction
						</button>
					</div>
				</div>
				<div className="mt-4 w-100">
					<TransactionsList />
				</div>
			</div>
			<CreateTransactionModel show={show} handleClose={() => { setShow(false); }} />
		</>
	)
}

export default Transactions