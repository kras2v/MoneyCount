import moment from "moment";

export const getTotalOutcomes = (transactions, start, end) => {
	return Math.round(transactions
		?.filter(p => (moment(p.paymentDate.split('T')[0]).isSameOrAfter(start) && moment(p.paymentDate.split('T')[0]).isSameOrBefore(end)))
		.filter(p => p.amount < 0)
		.reduce((x, y) => x + y.amount, 0) * 100) / 100;
};

export const getNewOutcomes = (transactions, start, end) => {
	return transactions
		?.filter(p => (moment(p.paymentDate.split('T')[0]).isSameOrAfter(start) && moment(p.paymentDate.split('T')[0]).isSameOrBefore(end)))
		.filter(p => p.amount < 0);
};

export const getTotalIncomes = (Transactions) => {
	const start = moment().endOf('month');
	const end = moment(start).subtract(6, 'month').startOf('month');
	return Math.round(Transactions
		?.filter(p => (moment(p.paymentDate.split('T')[0]).isSameOrAfter(end) && moment(p.paymentDate.split('T')[0]).isSameOrBefore(start)))
		.filter(p => p.amount > 0)
		.reduce((x, y) => x + y.amount, 0) * 100) / 100;
};

export const getNewIncomes = (Transactions) => {
	const start = moment().endOf('month');
	const end = moment(start).subtract(6, 'month').startOf('month');
	return Transactions
		?.filter(p => (moment(p.paymentDate.split('T')[0]).isSameOrAfter(end) && moment(p.paymentDate.split('T')[0]).isSameOrBefore(start)))
		.filter(p => p.amount > 0);
};