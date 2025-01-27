import React, { Component, useState } from 'react';
import Toggle from 'react-bootstrap-toggle';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-toggle/dist/bootstrap2-toggle.css";

const CustomToggle = (props) => {
	const handleToggle = () => {
		props.setIsIncome(!props.isIncome);
	};

	return (
		<Toggle
			onClick={handleToggle}
			on={<span style={{ marginLeft: '5px' }}>income</span>}
			off={<span style={{ margin: 0 }}>outcome</span>}
			size="xs"
			offstyle="danger"
			onstyle="success"
			active={props.isIncome}
		/>
	);
};

export default CustomToggle;
