import { Chart } from "chart.js";

export const createOutcomeChart = (categories, newTransactions, setChartData, chartName) => {
	if (newTransactions) {
		const data = categories.map(c => ({
			category: c.name,
			amount: newTransactions
				.filter(p => p.category.id === c.id)
				.reduce((x, y) => x + y.amount, 0)
		}));
		setChartData(data);
		return new Chart(
			document.getElementById(chartName),
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
	}
}

export const createIncomeChart = (categories, newTransactions, setChartData, chartName) => {
	if (newTransactions) {
		const months = [moment().format("MMMM"),
		moment().subtract(1, "month").format("MMMM"),
		moment().subtract(2, "month").format("MMMM"),
		moment().subtract(3, "month").format("MMMM"),
		moment().subtract(4, "month").format("MMMM"),
		moment().subtract(5, "month").format("MMMM"),
		moment().subtract(6, "month").format("MMMM"),
		];
		console.log(months);
		const data = months.map(m => ({
			month: m,
			amount: newTransactions
				.filter(p => moment(p.paymentDate.split("T")[0]).format("MMMM") === m)
				.reduce((x, y) => x + y.amount, 0)
		}));
		setChartData(data);
		return new Chart(
			document.getElementById(chartName),
			{
				type: 'bar',
				data: {
					labels: data.map(row => row.month),
					datasets: [
						{
							label: 'Amount',
							data: data.map(row => row.amount)
						}
					]
				}
			}
		)
	}
}
