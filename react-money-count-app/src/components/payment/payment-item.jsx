import React from "react"
import NoImage from "../../../no-image.png"
import { useNavigate } from 'react-router-dom';

const PaymentItem = (props) => {
	const navigate = useNavigate();
	return (
		<>
			<div className="row border border-secondary">
				<div className="col-1 my-2 d-flex justify-content-center align-items-center">
					<img
						src={"/../../public/icons/" + props.data.category.icon + ".svg" || NoImage}
						style={{ width: 30, height: 30 }}
						alt="Category Icon"
					/>
				</div>
				<div className="col-8 align-self-center">
					<button className="btn" onClick={() => navigate('/edit/' + props.data.id)}>
						{props.data.name}
					</button>
				</div>
				<div className="col-3 d-flex justify-content-center align-items-center">
					{props.data.amount}
				</div>
			</div>
		</>
	)
}

export default PaymentItem