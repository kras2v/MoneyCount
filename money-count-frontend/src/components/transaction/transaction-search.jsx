import { useState } from 'react';

const TransactionSearch = (props) => {
	const [advancedSearchData, setAdvancedSearchData] = useState({ dateFrom: "", dateTo: "" });
	const [advancedSearchAmount, setAdvancedSearchAmount] = useState({ minAmount: 0, maxAmount: 0 });
	const [searchTerm, setSearchTerm] = useState("");
	const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleAdvancedSearchDateChange = (event) => {
		const { name, value } = event.target;
		setAdvancedSearchData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleAdvancedSearchAmountChange = (event) => {
		const { name, value } = event.target;
		setAdvancedSearchAmount((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const applySearch = () => {
		let filteredTransactions = [...props.Transactions];

		if (searchTerm) {
			filteredTransactions = filteredTransactions.filter((Transaction) =>
				Transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		const { dateFrom, dateTo } = advancedSearchData;
		const { minAmount, maxAmount } = advancedSearchAmount;

		if (dateFrom) {
			filteredTransactions = filteredTransactions.filter((Transaction) => Transaction.TransactionDate >= dateFrom);
		}

		if (dateTo) {
			filteredTransactions = filteredTransactions.filter((Transaction) => Transaction.TransactionDate <= dateTo);
		}

		if (minAmount) {
			filteredTransactions = filteredTransactions.filter((Transaction) => Math.abs(Transaction.amount) >= minAmount);
		}

		if (maxAmount) {
			filteredTransactions = filteredTransactions.filter((Transaction) => Math.abs(Transaction.amount) <= maxAmount);
		}

		props.setFilteredTransactions(filteredTransactions);
	};

	const handleAdvancedSearchOpen = () => {
		setIsAdvancedSearchOpen(!isAdvancedSearchOpen);
	};

	return (
		<div className="search-container">
			<div className="mb-3">
				<div className="input-group">
					<input
						type="text"
						className="form-control search-input"
						placeholder="Search Transactions..."
						value={searchTerm}
						onChange={handleSearchChange}
					/>
					<button
						className="btn btn-outline-primary"
						onClick={applySearch}
					>
						Search
					</button>
				</div>
			</div>

			<button
				className="btn btn-outline-primary mb-3 w-100 advanced-search-toggle"
				onClick={handleAdvancedSearchOpen}
			>
				Advanced Search
			</button>

			{isAdvancedSearchOpen && (
				<div className="advanced-search-card shadow-lg p-4 rounded">
					<div className="row mb-3">
						<div className="col-md-6">
							<input
								type="date"
								className="form-control"
								name="dateFrom"
								value={advancedSearchData.dateFrom}
								onChange={handleAdvancedSearchDateChange}
								placeholder="From date"
							/>
						</div>
						<div className="col-md-6">
							<input
								type="date"
								className="form-control"
								name="dateTo"
								value={advancedSearchData.dateTo}
								onChange={handleAdvancedSearchDateChange}
								placeholder="To date"
							/>
						</div>
					</div>

					<div className="row mb-3">
						<div className="col-md-6">
							<div className="input-group">
								<span className="input-group-text">₴</span>
								<input
									type="number"
									className="form-control"
									name="minAmount"
									value={advancedSearchAmount.minAmount}
									onChange={handleAdvancedSearchAmountChange}
									placeholder="Min amount"
								/>
							</div>
						</div>
						<div className="col-md-6">
							<div className="input-group">
								<span className="input-group-text">₴</span>

								<input
									type="number"
									className="form-control"
									name="maxAmount"
									value={advancedSearchAmount.maxAmount}
									onChange={handleAdvancedSearchAmountChange}
									placeholder="Max amount"
								/>
							</div>
						</div>
					</div>

					<div className="text-center">
						<button className="btn btn-success w-100" onClick={applySearch}>
							Apply Advanced Search
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default TransactionSearch;
