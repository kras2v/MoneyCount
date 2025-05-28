import React, { Fragment, useEffect, useState } from "react"
import CategoryItem from "./category-item"
import CustomToast, { createToast, estimateHeight } from "../../components/toast";
import { useNavigate } from "react-router-dom";
import NoImage from "../../../public/icons/no-image.svg"

const CategoryList = (props) => {
	const [categories, setCategories] = useState([]);
	const [toasts, setToasts] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "categories", {
			method: "GET",
			credentials: "include"
		})
			.then(res => res.json())
			.then(res => {
				if (res.status === true && res.data.categoriesCount > 0) {
					setCategories(res.data.categories);
				}
				if (res.data.categoriesCount === 0) {
					createToast({ message: "There is no category in a system.", setToasts });
				}
			})
			.catch(err => createToast({ message: "Error getting data.", setToasts }));
	}, []);

	return (
		<div className="modal-container p-4 d-flex flex-column">
			{
				categories.length > 0 ?
					Array.from({ length: Math.ceil(categories.length / props.amountInRow) }, (_, rowIndex) => (
						<div className="custom-row flex-row align-items-center" key={rowIndex}>
							{categories
								.slice(rowIndex * props.amountInRow, rowIndex * props.amountInRow + props.amountInRow)
								.map((category) => (
									<CategoryItem
										key={category.id}
										data={category}
										function={props.function}
									/>
								))}
						</div>
					)) :
					props.showRedirectButton ?
						<div className="custom-col" >
							<button className="btn btn-outline-dark custom-btn w-100 d-flex flex-column align-items-center p-2" type="button"
								onClick={() => { navigate("/categories") }}>
								<img
									src={NoImage}
									alt={"Create New Category"}
									className="category-icon mb-2"
								/>
								<span className="category-name">
									Add New Category
								</span>
							</button>
						</div>
						: <Fragment />
			}
			<div style={{ position: "fixed", top: 20, right: 20, zIndex: 1050 }}>
				{toasts.reduce((acc, toast, index) => {
					const height = estimateHeight(toast.message);
					const totalHeight = acc.prevHeight;
					acc.prevHeight += height + 10;

					acc.elements.push(
						<CustomToast
							key={toast.id}
							message={toast.message}
							setShow={() => {
								setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toast.id));
							}}
							show={toast.show}
							index={index}
							top={totalHeight}
						/>
					);

					return acc;
				}, { elements: [], prevHeight: 0 }).elements}
			</div>
		</div>
	)
}

export default CategoryList