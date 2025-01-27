import React from "react"
import NoImage from "../../../public/icons/no-image.svg"
import { useNavigate } from 'react-router-dom';

const PaymentItem = (props) => {
	const navigate = useNavigate();
	return (
		<>
			<div
				className="row border border-secondary btn d-flex"
				onClick={() => navigate('/edit/' + props.data.id)}
			>
				<div className="col-1 my-2 d-flex justify-content-center align-items-center">
					<img
						src={props.data.category ? props.data.category.icon ? props.data.category.icon : NoImage : NoImage}
						style={{ width: 30, height: 30 }}
						alt="Category Icon"
					/>
				</div>
				<div className="col-1 align-self-center">
					{props.data.name}
				</div>
				<div className="col-10 d-flex justify-content-end align-items-center">
					<div className="amount-container w-25">
						<div className={"btn btn-" + (props.data.amount < 0 ? "danger" : "success")}>
							{props.data.amount}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default PaymentItem