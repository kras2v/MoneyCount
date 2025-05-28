import moment from "moment";

export const getTotalOnDateRange = (transactions, start, end, isIncome) => {
	return Math.round(transactions
		?.filter(p => (moment(p.transactionDate.split('T')[0]).isSameOrAfter(start) && moment(p.transactionDate.split('T')[0]).isSameOrBefore(end)))
		.filter(isIncome ? p => p.amount > 0 : p => p.amount < 0)
		.reduce((x, y) => x + y.amount, 0) * 100) / 100;
};

export const getNewTransactionsListOnDateRange = (transactions, start, end, isIncome) => {
	return transactions
		?.filter(p => (moment(p.transactionDate.split('T')[0]).isSameOrAfter(start) && moment(p.transactionDate.split('T')[0]).isSameOrBefore(end)))
		.filter(isIncome ? p => p.amount > 0 : p => p.amount < 0);
};
