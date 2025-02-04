import React, { useEffect } from "react";
import moment from "moment";
import $, { data } from "jquery";
import "daterangepicker";
import "daterangepicker/daterangepicker.css";

const DateRangePicker = ({ onDateChange }) => {
	useEffect(() => {
		$('input[name="chart-input"]').daterangepicker({
			autoUpdateInput: false,
			locale: {
				cancelLabel: 'Clear'
			},
			"showWeekNumbers": true,
			ranges: {
				'Today': [moment(), moment()],
				'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
				'Over the Last 7 Days': [moment().subtract(6, 'days'), moment()],
				'Over the Last 30 Days': [moment().subtract(29, 'days'), moment()],
				'This Month': [moment().startOf('month'), moment().endOf('month')],
				'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
			},
			"startDate": "01/16/2025",
			"endDate": "01/22/2025"
		}, (start, end, label) => { onDateChange(start, end, label); });
	}, [onDateChange]);

	return (
		<div className="input-group w-75">
			<div className="input-group-prerend">
				<span className="input-group-text btn btn-dark">
					<i className="fa-regular fa-calendar"></i>
				</span>
			</div>
			<input
				className="form-control rounded-3 border-0 bg-dark text-white"
				type="text"
				id="chart-input"
				name="chart-input"
				placeholder="Select date range"
				value={"Select date range"}
				onChange={() => { }}
			/>
		</div>
	);
};

export default DateRangePicker;