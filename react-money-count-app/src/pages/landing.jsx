import React, { useState } from "react"
import PaymentsList from "../components/payment/payment-list"
import CreatePaymentModel from "../components/payment/payment-create-modal"

const Landing = () => {
	const [show, setShow] = useState(false);

	return (
		<>
			<div className="custom-container">
				<div className="row border border-dark justify-content-between align-items-center bg-dark text-white py-3 px-4 rounded">
					<div className="col-8 d-flex justify-content-start align-items-center">
						<h2 className="m-0">💸 Payments</h2>
					</div>
					<div className="col-3 d-flex justify-content-end">
						<button
							type="button"
							className="btn btn-outline-light btn-lg shadow-sm"
							onClick={() => { setShow(true); }}
						>
							➕ Add Payment
						</button>
					</div>
				</div>
				<div className="mt-4">
					<PaymentsList />
				</div>
			</div>
			<CreatePaymentModel show={show} handleClose={() => {setShow(false); }}/>
		</>
	)
}

export default Landing