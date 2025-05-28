import React, { useState } from "react"
import NoImage from "../../../public/icons/no-image.svg"

const CategoryItem = (props) => {
	const [imageSrc, setImageSrc] = useState(props?.data.icon || NoImage)
	return (
		<div className="custom-col" key={props.data.id}>
			<button className="btn btn-outline-dark custom-btn w-100 d-flex flex-column align-items-center p-3" type="button"
				onClick={() =>{ props.function(props); }}>
				<img 
					src={imageSrc}
					onError={() => { setImageSrc(NoImage) }}
					alt={props.data.name} 
					className="category-icon mb-2" 
				/>
				<span className="category-name">
					{props.data.name}
				</span>
			</button>
		</div>
	)
}


export default CategoryItem
