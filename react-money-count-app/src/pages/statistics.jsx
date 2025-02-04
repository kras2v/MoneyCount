import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-markdown";
import moment from "moment";
import { createOutcomeChart, createIncomeChart } from "../components/statistics/create-chart";
import DateRangePicker from "../components/statistics/date-range-picker"
import { getTransactions, getCategories } from "../components/statistics/Transaction-category-requests"
import { getTotalIncomes, getNewIncomes, getTotalOutcomes, getNewOutcomes, } from "../components/statistics/filter-utils"

const Statistics = () => {
	const [outcomeChartData, setOutcomeChartData] = useState(null)
	const [incomeChartData, setIncomeChartData] = useState(null)

	const [transactions, setTransactions] = useState(null);
	const [categories, setCategories] = useState(null);

	const [outcomes, setNewOutcomes] = useState(null);
	const [incomes, setNewIncomes] = useState(null);

	const [outcomesData, setNewOutcomesData] = useState(null);
	const [incomesData, setNewIncomesData] = useState(null);

	const [total, setTotal] = useState(0);
	const [isInit, setIsInit] = useState(null);
	const [outcomePeriodLabel, setOutcomePeriodLabel] = useState(null);

	const [loading, setLoading] = useState(false);
	const [answer, setAnswer] = useState(null);

	function handleDateChangeOutcome(start, end, label) {
		setTotal(getTotalOutcomes(transactions, start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')));
		setNewOutcomes(getNewOutcomes(transactions, start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')));
		if (label === "Custom Range")
			setOutcomePeriodLabel(" from " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD'));
		else
			setOutcomePeriodLabel(label);
		setAnswer(null);
	}

	const askAI = async () => {
		setLoading(true);
		setAnswer("");
		try {
			const outcomeDataJson = JSON.stringify(outcomesData);
			const incomeDataJson = JSON.stringify(incomesData);
			const genAI = new GoogleGenerativeAI("AIzaSyAH5-nJiYVADHFE7LFkY37HK2bzhZAYqrQ");
			const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
			const prompt = `My spendings are following: ${outcomeDataJson} during ${outcomePeriodLabel},
			BRIEFLY give me 3 advise how to improve my budget, please also keep in mind
			my monthly income over last 6 months ${incomeDataJson}`;
			const result = await model.generateContent(prompt);
			setAnswer(result.response.text());
		}
		catch (err) {
			setAnswer("Error fetching AI response. Please try again.");
		}
		finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		const url = import.meta.env.VITE_REACT_APP_API_URL;
		const today = moment().format('YYYY-MM-DD');
		if (outcomeChartData) outcomeChartData.destroy();
		if (incomeChartData) incomeChartData.destroy();

		if (!transactions) getTransactions(url, setTransactions);
		if (!categories) getCategories(url, setCategories);

		if (!outcomes) setNewOutcomes(getNewOutcomes(transactions, today, today));
		if (!outcomePeriodLabel) setOutcomePeriodLabel("Today");

		if (!incomes) setNewIncomes(getNewIncomes(transactions));

		if (categories && outcomes && incomes) {
			if (total === 0 && !isInit)
				setTotal(getTotalOutcomes(transactions, today, today))
			setOutcomeChartData(createOutcomeChart(categories, outcomes, setNewOutcomesData, 'outcome-chart'));
			setIncomeChartData(createIncomeChart(categories, incomes, setNewIncomesData, 'income-chart'));
			setIsInit(true);
		}
	}, [transactions, categories, outcomes, incomes, isInit]);

	return (
		<>
			<div className="custom-container p-4">
				<div className="d-flex flex-column align-items-center gap-4">
					<div className="outcome-statistiscs d-flex flex-column align-items-center w-100 p-4 border rounded-lg shadow-lg bg-gray-50 max-w-md mx-auto">
						<div className="summary-amount d-flex flex-row align-items-center justify-content-between mb-4">
							<div className="count-amount" id="count-amount">
								<h3 className="text-dark">{-total}{"₴ Spent "}
									{outcomePeriodLabel && outcomePeriodLabel ? outcomePeriodLabel : "Select date range"}</h3>
							</div>
						</div>
						<DateRangePicker onDateChange={handleDateChangeOutcome} />
						<div className="d-flex mt-4 justify-content-between gap-3 w-100">
							<div className="w-25 chart-container mt-4 d-flex align-items-center" style={{ minWidth: "30%", minHeight: "30%" }}>
								<canvas className="" id="outcome-chart" />
							</div>
							<div className="w-75 h-100 ai-container">
								<div className="text-center mb-4">
									<button
										onClick={askAI}
										className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
										disabled={loading}
									>
										{loading ? "Asking AI..." : "Ask AI"}
									</button>
								</div>
								<div className="text-block p-4 bg-white border rounded-lg shadow-md">
									{answer ? (
										<Markdown className="text-gray-800">{answer}</Markdown>
									) : (
										<p className="text-gray-400">The AI's answer will appear here.</p>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="income-statistics d-flex mb-5 flex-column p-4 justify-content-center align-items-center w-100 border rounded-lg shadow-lg bg-gray-50 max-w-md mx-auto">
						<h3> Income over last 6 months </h3>
						<div className="chart-container mt-4 w-100">
							<canvas className="" id="income-chart" />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Statistics;
