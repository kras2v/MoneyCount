
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
		const months = [
			moment().format("MMMM"),
			moment().subtract(1, "month").format("MMMM"),
			moment().subtract(2, "month").format("MMMM"),
			moment().subtract(3, "month").format("MMMM"),
			moment().subtract(4, "month").format("MMMM"),
			moment().subtract(5, "month").format("MMMM"),
			moment().subtract(6, "month").format("MMMM"), 
		];
		const data = months.map(m => ({
			month: m,
			amount: newTransactions
				.filter(p => moment(p.transactionDate.split("T")[0]).format("MMMM") === m)
				.reduce((x, y) => x + y.amount, 0)
		}));
		setChartData(data);
		return new Chart(
			document.getElementById(chartName),
			{
				type: 'bar',
				data: {
					labels: data.reverse().map(row => row.month),
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

export const createIncomeOutcomeChart = (newIncomes, newOutcomes, chartName) => {
	if (newIncomes && newOutcomes) {
		const months = [
			moment().format("MMMM"),
			moment().subtract(1, "month").format("MMMM"),
			moment().subtract(2, "month").format("MMMM"),
			moment().subtract(3, "month").format("MMMM"),
			moment().subtract(4, "month").format("MMMM"),
			moment().subtract(5, "month").format("MMMM"),
			moment().subtract(6, "month").format("MMMM"),
		];
		const income = months.map(m => ({
			month: m,
			amount: newIncomes
				.filter(p => moment(p.transactionDate.split("T")[0]).format("MMMM") === m)
				.reduce((x, y) => x + y.amount, 0)
		}));
		const outcome = months.map(m => ({
			month: m,
			amount: newOutcomes
				.filter(p => moment(p.transactionDate.split("T")[0]).format("MMMM") === m)
				.reduce((x, y) => x + y.amount, 0)
		}));
		return new Chart(
			document.getElementById(chartName),
			{
				type: 'bar',
				data: {
					labels: income.reverse().map(row => row.month),
					datasets: [
						{
							label: 'Income',
							data: income.map(row => row.amount)
						},
						{
							label: 'Outcome',
							data: outcome.reverse().map(row => row.amount)
						}
					]
				}
			}
		)
	}
}
