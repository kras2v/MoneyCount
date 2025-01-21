import React, { useEffect, useState } from "react"
import CategoryItem from "./category-item"

const CategoryList = (props) => {
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "Category")
			.then(res => res.json())
			.then(res => {
				if (res.status === true && res.data.count > 0) {
					setCategories(res.data.categories);
				}
				if (res.data.count === 0) {
					alert("There is no category in a system.");
				}
			})
			.catch(err => alert("Error getting data."));
	}, []);

	return (
		<div className="modal-container d-flex flex-column">
			{Array.from({ length: Math.ceil(categories.length / props.amountInRow) }, (_, rowIndex) => (
				<div className="row custom-row flex-row align-items-center" key={rowIndex}>
					{categories
						.slice(rowIndex * props.amountInRow, rowIndex * props.amountInRow + props.amountInRow)
						.map((category) => (
							<CategoryItem
								key={category.id}
								data={category}
								function={props.function} />
						))}
				</div>
			))}
		</div>
	)
}

export default CategoryList