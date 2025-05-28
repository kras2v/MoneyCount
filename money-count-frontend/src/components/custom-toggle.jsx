import React from 'react';
import Toggle from 'react-bootstrap-toggle';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-toggle/dist/bootstrap2-toggle.css";

const CustomToggle = (props) => {
	return (
		<Toggle
			onClick={props.handleToggle}
			on={<span style={{ marginLeft: props.marginLeft }}>{props.on}</span>}
			off={<span style={{ margin: 0 }}>{props.off}</span>}
			size="xs"
			offstyle={props.offstyle}
			onstyle={props.onstyle}
			active={props.isActive}
		/>
	);
};

export default CustomToggle;
