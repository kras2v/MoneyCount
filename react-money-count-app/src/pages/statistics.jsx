import React, { useEffect, useState } from "react";
import $ from "jquery";
import { Chart } from "chart.js";
import "daterangepicker";
import "daterangepicker/daterangepicker.css";
import moment from "moment";

const Statistics = () => {
	const [periodLabel, setPeriodLabel] = useState(null);
	const [categories, setCategories] = useState(null);
	const [payments, setPayments] = useState(null);
	const [newPayments, setNewPayments] = useState(null);
	const [total, setTotal] = useState(0);
	const [myChart, setMyChart] = useState(null);

	const getPayments = () => {
		if (payments === null) {
			fetch(import.meta.env.VITE_REACT_APP_API_URL + "Payment/get-all-payments")
			.then(res => res.json())
			.then(res => {
				if (res.status === true) {
					setPayments(res.data.payments);
					console.log("data received");
				}
			})
			.catch(err => alert("Error getting data."));
		}
	}

	const getDateRangePicker = () => {
		$('input[name="demo"]').daterangepicker({
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
		}, function (start, end, label) {
			setTotal(getTotal(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')));
			setNewPayments(getNewData(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')));
			if (label === "Custom Range")
				setPeriodLabel(" from " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD'));
			else
				setPeriodLabel(label);
		});
	}

	const getAllCategories = () => {
		if (categories === null) {
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
		}
	}

	const getChart = () => {
		const data = categories.map(c => ({ 
			category: c.name,
			amount: newPayments.filter(p => p.category.id === c.id).reduce((x, y) => x + y.amount, 0)
		}));
		return (
			new Chart(
				document.getElementById('test-chart'),
				{
					type: 'doughnut',
					data: {
						labels: data.map(row => row.category),
						datasets: [
							{
								label: 'Amount',
								data: data.map(row => row.amount)
							}
						]
					}
				}
			)
		)
	}

	const getTotal = (start, end) => {
		if (payments) {
			return Math.round(payments.filter(p => (moment(p.paymentDate.split('T')[0]).isSameOrAfter(start) && moment(p.paymentDate.split('T')[0]).isSameOrBefore(end)))
				.reduce((x, y) => x + y.amount, 0) * 100) / 100;
		}
	};

	const getNewData = (start, end) => {
		if (payments) {
			return payments.filter(p => (moment(p.paymentDate.split('T')[0]).isSameOrAfter(start) && moment(p.paymentDate.split('T')[0]).isSameOrBefore(end)));
		}
	};

	useEffect(() => {
		if (myChart)
			myChart.destroy();
		getPayments();
		getAllCategories();
		getDateRangePicker();
		if (categories && newPayments)
			setMyChart(getChart());
	}, [payments, newPayments, categories]);

	return (
		<>
			<div className="statistics-container mt-5">
				<div className="summary-amount d-flex flex-row">
					<div className="count-amount" id="count-amount">
						<h3>{total + " "}
							{periodLabel && periodLabel
								? periodLabel
								: " Select date range"}</h3>
					</div>
				</div>
				<div className="d-flex mt-5 flex-column align-items-center gap-3">
					<div className="input-group h-25 w-100 d-flex">
						<div className="input-group-prerend">
							<span className="input-group-text btn-dark">
								<i className="fa-regular fa-calendar"></i>
							</span>
						</div>
						<input className="btn-dark border-0 ml-1" 
							type="text" id="demo" name="demo" placeholder="Select date range" value={"Select date range"} onChange={() => {}} />
					</div>
					<canvas className="w-50 h-50" id="test-chart" />
				</div>
			</div>
		</>
	)
}

export default Statistics;