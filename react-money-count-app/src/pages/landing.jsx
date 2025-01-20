import React, { useState } from "react"
import PaymentsList from "../components/payment/payments-list"
import CreatePaymentModel from "../components/payment/payment-create-modal"

const Landing = () => {
	const [show, setShow] = useState(false);

	return (
		<>
			<div className="container my-5">
				<div className="row border border-dark justify-content-between">
					<div className="col-8 my-3 d-flex justify-content-center align-self-center">
						<h2>Payments</h2>
					</div>
					<div className="col-3 my-3 d-flex justify-content-center align-self-center">
						<button type="button" className="btn btn-info" onClick={() => { setShow(true); }}>
							Add new payment
						</button>
					</div>
				</div>
					<PaymentsList />
			</div>
			<CreatePaymentModel show={show} handleClose={() => {setShow(false); }}/>
		</>
	)
}

export default Landing