import { Fragment, useEffect, useState } from "react";
import CustomToast, { createToast, estimateHeight } from "../../components/toast";
import { validateEmail, validateName } from "../../components/auth/validators";
import { useNavigate } from "react-router-dom";

const Home = () => {
	document.title = "Welcome";
	const [userInfo, setUserInfo] = useState({});
	const [editField, setEditField] = useState(null);
	const [inputValue, setInputValue] = useState("");
	const [loading, setLoading] = useState(false);

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
	const [isPasswordFormVisible, setPasswordFormVisible] = useState(false);

	const [toasts, setToasts] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		const user = localStorage.getItem("user");
		setLoading(true);
		setTimeout(() => {
			fetch(import.meta.env.VITE_REACT_APP_API_URL + "account/home/" + user, {
				method: "GET",
				credentials: "include"
			}).then(response => response.json())
				.then(data => {
					setUserInfo(data.data.userInfo);
				})
				.catch(error => {
					console.log("Error home page: ", error)
				})
				.finally(() => {
					setLoading(false);
				});
		}, 1000);
	}, []);

	const handleFieldChange = (e) => {
		setInputValue(e.target.value);
	};

	const handlePasswordChange = (e) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			createToast({ message: "New passwords do not match!", setToasts })
			console.log(newPassword, confirmPassword);
		}
		if (oldPassword != newPassword) {
			setLoading(true);
			setTimeout(() => {
				fetch(import.meta.env.VITE_REACT_APP_API_URL + "account/update-password", {
					method: "PUT",
					headers: {
						'Accept': 'application/json',
						'Content-type': 'application/json'
					},
					body: JSON.stringify({ oldPassword, newPassword }),
					credentials: "include"
				}).then(response => response.json())
					.then(data => {
						if (data.status === true) {
							setOldPassword("");
							setNewPassword("");
							setConfirmPassword("");
							createToast({ message: data.message || "Password has been successfuly updated!", setToasts })
						} else {
							createToast({ message: data.message || "Failed to change password.", setToasts })
						}
					})
					.catch(error => {
						console.log("Error home page: ", error)
						createToast({ message: "An error occurred. Please try again later.", setToasts })
					})
					.finally(() => {
						setLoading(false);
						setPasswordFormVisible(false);	
					});
			}, 1000);
		}
	};

	const handleSave = (e) => {
		let isError = false;
		if (editField === "email" && !validateEmail(inputValue)) {
			createToast({ message: "Please enter a valid email", setToasts })
			isError = true;
		}
		if (editField === "name" && !validateName(inputValue)) {
			createToast({ message: "Name can contain only letters", setToasts })
			isError = true;
		}
		if ((editField === "name" && inputValue != userInfo.name)
			|| (editField === "email" && inputValue != userInfo.email)) {
			setLoading(true);
			setTimeout(() => {
				fetch(import.meta.env.VITE_REACT_APP_API_URL + "account/update-user", {
					method: "PUT",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ ...userInfo, [editField]: e.target.value }),
				})
					.then((response) => response.json())
					.then(({ status, message, data }) => {
						if (status === false) {
							createToast({ message: message, setToasts })
						} else {
							setUserInfo(data);
							createToast({ message: "User information has been successfuly changed!", setToasts })
						}
					})
					.catch((error) => console.error("Error updating:", error))
					.finally(() => setLoading(false));
			}, 1000);
		}
		setEditField(null);
	};


	const handleDelete = () => {
		setLoading(true);
		setTimeout(() => {
			fetch(import.meta.env.VITE_REACT_APP_API_URL + "account/delete-user/" + userInfo.id, {
				method: "DELETE",
				headers: {
					'Accept': 'application/json',
					'Content-type': 'application/json'
				},
				credentials: "include"
			}).then(response => response.json())
				.then(data => {
					if (data.status === true) {
						setOldPassword("");
						setNewPassword("");
						setConfirmPassword("");
						createToast({ message: data.message || "We hope to see you again!", setToasts })
						navigate("/logout");
					} else {
						createToast({ message: data.message || "Failed to change password.", setToasts })
					}
				})
				.catch(error => {
					console.log("Error home page: ", error)
					createToast({ message: "An error occurred. Please try again later.", setToasts })
				})
				.finally(() => {
					setLoading(false);
					setPasswordFormVisible(false);
				});
		}, 3000);
	};

	const handleDeleteClick = () => {
		setIsDeleteModalVisible(true);
	};

	const handleConfirmDelete = () => {
		setIsDeleteModalVisible(false);
		handleDelete();
	};

	const handleCancelDelete = () => {
		setIsDeleteModalVisible(false);
	};

	return (
		<Fragment>
			<div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
				<header className="mb-4">
					<h2>Welcome to Your home page, {userInfo.name}!</h2>
				</header>

				{userInfo ? (
					<div className="card shadow-lg p-4 bg-light w-50">
						{loading ? (
							(<h1> Loading... </h1>)
						) : (
							<Fragment>
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
								<hr />
								<button
									className="btn btn-outline-primary"
									onClick={() => setPasswordFormVisible(!isPasswordFormVisible)}
								>
									Change Password
								</button>
								{isPasswordFormVisible && (
									<div className="mt-4">
										<h4>Change Password</h4>
										<form onSubmit={(e) => e.preventDefault()}>
											<div className="mb-3">
												<label htmlFor="oldPassword" className="form-label">
													Old Password
												</label>
												<input
													type="password"
													className="form-control"
													id="oldPassword"
													value={oldPassword}
													onChange={(e) => setOldPassword(e.target.value)}
													required
												/>
											</div>
											<div className="mb-3">
												<label htmlFor="newPassword" className="form-label">
													New Password
												</label>
												<input
													type="password"
													className="form-control"
													id="newPassword"
													value={newPassword}
													onChange={(e) => setNewPassword(e.target.value)}
													required
												/>
											</div>
											<div className="mb-3">
												<label htmlFor="confirmPassword" className="form-label">
													Confirm New Password
												</label>
												<input
													type="password"
													className="form-control"
													id="confirmPassword"
													value={confirmPassword}
													onChange={(e) => setConfirmPassword(e.target.value)}
													required
												/>
											</div>
											<button
												type="button"
												className="btn btn-primary"
												onClick={handlePasswordChange}
											>
												Change Password
											</button>
										</form>
									</div>
								)}
								<hr />
								<button
									className="btn btn-danger"
									onClick={handleDeleteClick}
								>
									Delete Account
								</button>
							</Fragment>
						)}
					</div>
				) : (
					<div className="alert alert-danger mt-4">
						<h1>Access Denied!!</h1>
					</div>
				)}
			</div>

			{isDeleteModalVisible && (
				<div className="modal show d-block" tabIndex="-1" role="dialog">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Are you sure you want to delete your account?</h5>
								<button
									type="button"
									className="btn"
									onClick={handleCancelDelete}
									aria-label="Close"
								>
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<p>This action cannot be undone.</p>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={handleCancelDelete}
								>
									Cancel
								</button>
								<button
									type="button"
									className="btn btn-danger"
									onClick={handleConfirmDelete}
								>
									Yes, Delete
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			<div style={{ position: "fixed", top: 20, right: 20, zIndex: 1050 }}>
				{toasts.reduce((acc, toast, index) => {
					const height = estimateHeight(toast.message);
					const totalHeight = acc.prevHeight;
					acc.prevHeight += height + 10;

					acc.elements.push(
						<CustomToast
							key={toast.id}
							message={toast.message}
							setShow={() => {
								setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toast.id));
							}}
							show={toast.show}
							index={index}
							top={totalHeight}
						/>
					);

					return acc;
				}, { elements: [], prevHeight: 0 }).elements}
			</div>
		</Fragment>
	);
};

export default Home