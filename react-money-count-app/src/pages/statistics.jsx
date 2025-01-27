import React, { useEffect, useState } from "react";
import $, { data } from "jquery";
import { Chart } from "chart.js";
import "daterangepicker";
import "daterangepicker/daterangepicker.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import moment from "moment";
import { formatNumber } from "chart.js/helpers";

const Statistics = () => {
	const [chartData, setChartData] = useState(null)
	const [periodLabel, setPeriodLabel] = useState(null);
	const [categories, setCategories] = useState(null);
	const [payments, setPayments] = useState(null);
	const [newPayments, setNewPayments] = useState(null);
	const [total, setTotal] = useState(0);
	const [myChart, setMyChart] = useState(null);
	const [isInit, setIsInit] = useState(null);

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

		function cb(start, end, label)
		{
			$('#chart-input input').html(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
			setTotal(getTotal(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')));
			setNewPayments(getNewData(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')));
			if (label === "Custom Range")
				setPeriodLabel(" from " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD'));
			else
				setPeriodLabel(label);
			getContent();
		}

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
		}, function(start, end, label) {cb(start, end, label)});
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
		if (newPayments){
			setIsInit(true);
			const data = categories.map(c => ({
				category: c.name,
				amount: newPayments.filter(p => p.category.id === c.id).reduce((x, y) => x + y.amount, 0)
			}));
			setChartData(data);
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
	}

	const getTotal = (start, end) => {
		if (payments) {
			return Math.round(payments
				.filter(p => (moment(p.paymentDate.split('T')[0]).isSameOrAfter(start) && moment(p.paymentDate.split('T')[0]).isSameOrBefore(end)))
				.filter(p => p.amount < 0)
				.reduce((x, y) => x + y.amount, 0) * 100) / 100;
		}
	};

	const getNewData = (start, end) => {
		if (payments) {
			return payments
			.filter(p => (moment(p.paymentDate.split('T')[0]).isSameOrAfter(start) && moment(p.paymentDate.split('T')[0]).isSameOrBefore(end)))
			.filter(p => p.amount < 0);
		}
	};

	const getContent = async () => {
		const dataJson = JSON.stringify(chartData);

		const genAI = new GoogleGenerativeAI("AIzaSyAH5-nJiYVADHFE7LFkY37HK2bzhZAYqrQ");
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const prompt = `My spendings are following: ${dataJson} during ${periodLabel},
			BRIEFLY give me 3 advise how to improve my budget`;

		const result = await model.generateContent(prompt);
		console.log(result.response.text());
	}

	useEffect(() => {
		const today = moment().format('YYYY-MM-DD');
		if (myChart)
			myChart.destroy();
		getPayments();
		getAllCategories();
		if (!newPayments)
			setNewPayments(getNewData(today, today));
		getDateRangePicker();
		if (!periodLabel)
			setPeriodLabel("Today");
		if (categories && newPayments)
		{
			if (total === 0 && !isInit)
				setTotal(getTotal(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')))
			setMyChart(getChart());
			setIsInit(true);
		}
	}, [payments, categories, newPayments, isInit]);

	return (
		<>
			<div className="custom-container p-4">
				<div className="summary-amount d-flex flex-row align-items-center justify-content-between mb-4">
					<div className="count-amount" id="count-amount">
						<h3 className="text-dark">{-total}{"₴ Spent "}
							{periodLabel && periodLabel ? periodLabel : "Select date range"}</h3>
					</div>
				</div>
				<div className="d-flex mt-5 flex-column align-items-center gap-4">
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
					<div className="chart-container mt-4" style={{maxWidth: "40%"}}>
						<canvas className="w-100 h-100" id="test-chart" />
					</div>
				</div>
			</div>
		</>
	)
}

export default Statistics;