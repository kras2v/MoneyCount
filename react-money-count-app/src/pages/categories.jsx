import React, { useState } from "react"
import CategoryList from "../components/category/category-list";
import CategoryCreateModal from "../components/category/category-create-modal"
import New from "../../public/icons/new.svg"

const Categories = () => {
	const [categoryId, setCategoryId] = useState(null);
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
							onClick={() => setShow(true)}>
							<img src={New} alt="NewItem" className="category-icon"></img>
							Create new
						</button>
					</div>
				</div>
				<div className="row">
					<CategoryList function={(props) => { setCategoryId(props.data.id); setShow(true); }}
						amountInRow={100000000} />
				</div>
			</div>
			<CategoryCreateModal show={show} handleClose={() => { setShow(false); setCategoryId(null); }} categoryId={categoryId} />
		</>
	)
}

export default Categories