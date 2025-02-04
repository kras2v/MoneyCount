export const getTransactions = (url, setTransactions) => {
	fetch(url + "transactions/get-all-transactions")
		.then(res => res.json())
		.then(res => {
			if (res.status === true) {
				setTransactions(res.data.transactions);
				console.log("data received");
			}
		})
		.catch(err => alert("Error getting data."));
}

export const getCategories = (url, setCategories) => {
	fetch(url + "categories")
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
