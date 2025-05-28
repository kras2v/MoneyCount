export const getTransactions = (url, setTransactions, setMessage, setShowMessage) => {
	fetch(url + "transactions/get-all-transactions", {
		method: "GET",
		credentials: "include"
	})
		.then(res => res.json())
		.then(res => {
			if (res.status === true) {
				setTransactions(res.data.transactions);
			}
		})
		.catch(err => showMessageWindow({ message: "Error getting transactions.", setMessage, setShowMessage }));
}

export const getCategories = (url, setCategories, setMessage, setShowMessage) => {
	fetch(url + "categories", {
		method: "GET",
		credentials: "include"
	})
		.then(res => res.json())
		.then(res => {
			if (res.status === true && res.data.categoriesCount > 0) {
				setCategories(res.data.categories);
			}
			if (res.data.categoriesCount === 0) {
				showMessageWindow({ message: "There is no category in a system.", setMessage, setShowMessage })
			}
		})
		.catch(err => showMessageWindow({ message: "Error getting categories.", setMessage, setShowMessage }));
}
