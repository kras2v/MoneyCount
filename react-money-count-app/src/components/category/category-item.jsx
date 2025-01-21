import React from "react"
import NoImage from "../../../public/icons/no-image.svg"

const CategoryItem = (props) => {
	return (
		<div className="custom-col" key={props.data.id}>
			<button className="btn btn-outline-dark custom-btn" type="button"
				onClick={() =>{ props.function(props);}}>
				<img src={props?.data.icon ? props.data.icon : NoImage} alt={props.data.name} className="category-icon"></img>
				{props.data.name}
			</button>
		</div>
	)
}


export default CategoryItem
