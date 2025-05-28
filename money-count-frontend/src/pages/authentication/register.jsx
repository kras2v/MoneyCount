import { Fragment, useEffect, useState } from "react";
import { Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import CustomToast, { createToast, estimateHeight } from "../../components/toast";
import { validateEmail, validatePassword } from "../../components/auth/validators";

const Register = () => {
	document.title = "Register";
	const navigate = useNavigate();
	const [validated, setValidated] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [userInfo, setUserInfo] = useState({});

	const [toasts, setToasts] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const user = localStorage.getItem("user");
		if (user) {
			document.location = "/";
		}
	}, []);

	const handleFieldChange = (event) => {
		const { name, value } = event.target;
		setUserInfo((oldData) => {
			return {
				...oldData,
				[name]: value,
			};
		});
	};

	const wait = () => {
		setTimeout(() => {
			setLoading(false);
		}, 3000);
	}

	async function registerHandler(e) {
		let isError = false;
		setLoading(true);

		e.preventDefault();
		const form = e.currentTarget;
		if (form.checkValidity() === false) {
			e.stopPropagation();
			setValidated(true);
			createToast({ message: "A validation error occurred. Please try again.", setToasts: setToasts });
			wait();
			return;
		}

		const subbmitter = document.querySelector(".register-btn");
		const formData = new FormData(form, subbmitter);
		const dataToSend = {};

		for (const [key, value] of formData) {
			if (key != "confirmPassword") {
				dataToSend[key] = value;
			}
			if (key === "Email" && !validateEmail(dataToSend[key])) {
				createToast({ message : "Please enter a valid email", setToasts });
				isError = true;
			}
			if (key === "PasswordHash") {
				const errors = validatePassword(dataToSend[key]);
				if (errors) {
					let errMessages = "";
					errors.forEach((err) => { errMessages += err + " " });
					var res = errMessages.slice(0, -2);
					createToast({ message: res, setToasts });
					isError = true;
				}
			}
		}
		if (dataToSend.PasswordHash !== confirmPassword) {
			createToast({ message : "New passwords do not match!", setToasts });
			isError = true;
		}
		
		if (isError) {
			wait()
			return;
		}

		fetch(import.meta.env.VITE_REACT_APP_API_URL + "account/register", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify(dataToSend),
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			}
		})
			.then(response => response.json().then(data => ({ status: response.status, data })))
			.then(({ status, data }) => {
				if (status) {
					createToast({ message: "Registered successfully.", setToasts });
					setTimeout(() => {
						document.location = "/login";
					}, 3000)
				} else {
					let messageStr = "";
					if (data.message) {
						messageStr = data.message;
					} else {
						let errorMessages = "<div>Attention please:</div><div class='normal'>";
						data.errors.forEach(error => {
							errorMessages += error.description + " ";
						});
						errorMessages += "</div>";
						messageStr = errorMessages;
					}
					createToast({ message: messageStr, setToasts });
				}
			})
			.catch(error => {
				console.error("Registration failed:", error);
				createToast({ message: "An error occurred. Please try again.", setToasts });
			})
			.finally(wait());
	}

	return (
		<Fragment>
			<section className="register-page-wrapper page">
				<div className="register-page" style={{ marginTop: "10%" }} >
					<header>
						<h1>Register page</h1>
					</header>
					<div className="form-holder  d-flex w-100 justify-content-center">
							<Form
								noValidate
								validated={validated}
								onSubmit={registerHandler}
								className="w-75"
							>
								<Form.Group className="my-4" controlId="formRegisterName">
									<Form.Label className="fw-bold text-secondary">Name</Form.Label>
									<div className="input-group">
										<Form.Control
											name="Name"
											className="form-control-lg border-0 shadow-sm"
											required
											value={userInfo.Name ? userInfo.Name : ""}
											type="name"
											placeholder="Enter your name"
											onChange={handleFieldChange}
										/>
									</div>
									<Form.Control.Feedback type="invalid">Please enter a correct email</Form.Control.Feedback>
								</Form.Group>
								<Form.Group className="my-4" controlId="formRegisterEmail">
									<Form.Label className="fw-bold text-secondary">Email</Form.Label>
									<div className="input-group">
										<Form.Control
											name="Email"
											className="form-control-lg border-0 shadow-sm"
											required
											type="email"
											value={userInfo.Email ? userInfo.Email : ""}
											placeholder="Enter email address"
											onChange={handleFieldChange}
										/>
									</div>
									<Form.Control.Feedback type="invalid">Please enter a correct email</Form.Control.Feedback>
								</Form.Group>
								<Form.Group className="my-4" controlId="formRegisterPassword">
									<Form.Label className="fw-bold text-secondary">Password</Form.Label>
									<div className="input-group">
										<Form.Control
											name="PasswordHash"
											className="form-control-lg border-0 shadow-sm"
											required
											type="password"
											value={userInfo.PasswordHash ? userInfo.PasswordHash : ""}
											placeholder="**********"
											onChange={handleFieldChange}
										/>
									</div>
									<Form.Control.Feedback type="invalid">Please enter a correct password</Form.Control.Feedback>
								</Form.Group>
								<Form.Group className="my-4" controlId="formRegisterPassword">
									<Form.Label className="fw-bold text-secondary">Confitm password</Form.Label>
									<div className="input-group">
										<Form.Control
											name="confirmPassword"
											className="form-control-lg border-0 shadow-sm"
											required
											type="password"
											value={confirmPassword ? confirmPassword : ""}
											placeholder="**********"
											onChange={(e) => { setConfirmPassword(e.target.value); }}
										/>
									</div>
									<Form.Control.Feedback type="invalid">Please enter a correct password confirmation</Form.Control.Feedback>
								</Form.Group>
								<Form.Group className="d-flex flex-row justify-content-between">
									<button disabled={loading} className="login-btn btn btn-dark btn-lg px-5 py-2 shadow-sm" type="submit">
										Register
									</button>
									<button disabled={loading} className="login-btn btn btn-dark btn-lg px-5 py-2 shadow-sm" onClick={() => { navigate("/login") }}>
										Login
									</button>
								</Form.Group>
							</Form>
					</div>
				</div>
				<div style={{ position: "fixed", top: 50, right: 20, zIndex: 1050 }}>
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
								height={height}
							/>
						);

						return acc;
					}, { elements: [], prevHeight: 0 }).elements}
				</div>
			</section>
		</Fragment>
	);
}

export default Register