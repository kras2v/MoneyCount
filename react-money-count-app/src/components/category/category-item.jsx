import React from "react"

const CategoryItem = (props) => {
	return (
		<div className="custom-col" key={props.data.id}>
			<button className="btn btn btn-outline-dark custom-btn" type="button"
				onClick={() => props.function(props)}>
				<img src={"../../../../public/icons/" + props.data.icon + ".svg"} alt={props.data.name} className="category-icon"></img>
				{props.data.name}
			</button>
		</div>
	)
}


export default CategoryItem
