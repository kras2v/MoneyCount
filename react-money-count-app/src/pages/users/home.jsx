import { Fragment, useEffect, useState } from "react";
import CustomToast, { showMessageWindow } from "../../components/toast";

const Home = () => {
	document.title = "Welcome";
	const [userInfo, setUserInfo] = useState({});
	const [editField, setEditField] = useState(null);
	const [inputValue, setInputValue] = useState("");
	const [loading, setLoading] = useState(false);

	const [message, setMessage] = useState("");
	const [showMessage, setShowMessage] = useState("");

	useEffect(() => {
		const user = localStorage.getItem("user");
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "account/home/" + user, {
			method: "GET",
			credentials: "include"
		}).then(response => response.json())
			.then(data => {
				setUserInfo(data.data.userInfo);
				console.log("user info: ", data.data.userInfo);
			})
			.catch(error => {
				console.log("Error home page: ", error)
			});

	}, []);

	const handleFieldChange = (e) => {
		setInputValue(e.target.value);
	};
	
	const validateEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	const handleSave = (e) => {
		if (e.target.id === "email" && !validateEmail(e.target.value)) {
			showMessageWindow({ message: "Please enter a valid email", setMessage, setShowMessage })
			return;
		}
		setLoading(true);
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "account/update-user", {
			method: "PUT",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({...userInfo, [editField]: e.target.value}),
		})
			.then((response) => response.json())
			.then(({status, message, data}) => {
				if (status === false) {
					showMessageWindow({ message: message, setMessage, setShowMessage })
				} else {
					setUserInfo(data);
					console.log("gsdghsfg", data);
					setEditField(null);
				}
			})
			.catch((error) => console.error("Error updating:", error))
			.finally(() => setLoading(false));
	};

	return (
		<Fragment>
			<div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
				<header className="mb-4">
					<h2>Welcome to Your Page!</h2>
				</header>

				{userInfo ? (
					<div className="card shadow-lg p-4 bg-light">
						<div className="row fw-bold mb-2">
							<div className="col">Name</div>
							<div className="col">Email</div>
							<div className="col">Created Date</div>
						</div>
						<div className="row">
							<div className="col">
								{editField === "name" ? (
									<input
										type="text"
										className="form-control"
										id="name"
										value={inputValue}
										onChange={handleFieldChange}
										onBlur={handleSave}
										autoFocus
									/>
								) : (
									<button
										className="btn btn-outline-primary"
										onClick={() => {
											setEditField("name");
											setInputValue(userInfo.name);
										}}
									>
										{userInfo.name}
									</button>
								)}
							</div>

							<div className="col">
								{editField === "email" ? (
									<input
										type="text"
										className="form-control"
										id="email"
										value={inputValue}
										onChange={handleFieldChange}
										onBlur={handleSave}
										autoFocus
									/>
								) : (
									<button
										className="btn btn-outline-primary"
										onClick={() => {
											setEditField("email");
											setInputValue(userInfo.email);
										}}
									>
										{userInfo.email}
									</button>
								)}
							</div>

							<div className="col">
								{userInfo.createdDate ? userInfo.createdDate.split("T")[0] : ""}
							</div>
						</div>
					</div>
				) : (
					<div className="alert alert-danger mt-4">
						<h1>Access Denied!!</h1>
					</div>
				)}
			</div>
			<CustomToast message={message} setShow={setShowMessage} show={showMessage} />
		</Fragment>
	);
}

export default Home