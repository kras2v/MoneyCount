import { Fragment, useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import CustomToggle from "../../components/custom-toggle";
import CustomToast, { createToast, estimateHeight }  from "../../components/toast";
import { validateEmail, validatePassword } from "../../components/auth/validators";

const Login = () => {
	document.title = "Login";
	const [validated, setValidated] = useState(false);
	const [remember, setRemember] = useState(false);
	const [toasts, setToasts] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		const user = localStorage.getItem("user");
		if (user) {
			document.location = "/";
		}
	}, []);

	async function loginHandler(e) {
		e.preventDefault();
		const form = e.currentTarget;
		if (form.checkValidity() === false) {
			e.stopPropagation();
			setValidated(true);
			createToast({ message: "A validation error occurred. Please try again.", setToasts });
			return;
		}

		const subbmitter = document.querySelector(".login-btn");
		const formData = new FormData(form, subbmitter);
		const dataToSend = {};

		for (const [key, value] of formData) {
			dataToSend[key] = value;
			if (key === "Email" && !validateEmail(dataToSend[key])) {
				createToast({ message : "Please enter a valid email", setToasts });
				isError = true;
			}
			if (key === "Password") {
				const errors = validatePassword(dataToSend[key]);
				if (errors)
				{
					let errMessages = "";
					errors.forEach((err) => { errMessages += err + " "});
					createToast({ message: errMessages, setToasts });
					isError = true;
				}
			}
		}
		if (dataToSend.Remember === "on") {
			dataToSend.Remember = true;
		}

		fetch(import.meta.env.VITE_REACT_APP_API_URL + "account/login", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify(dataToSend),
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			}
		})
			.then(response => response.json())
			.then(data => {
				if (data.status === true) { 
					createToast({ message: "Logged in successfully.", setToasts });

					// Store user details in localStorage
					localStorage.setItem("user", JSON.stringify(data.data));

					document.location = "/";
					return;
				}

				let messageStr = data.message || "An unknown error occurred.";

				createToast({ message: messageStr, setToasts });
			})
			.catch(error => {
				console.error("Login failed:", error);
				createToast({ message: "An error occurred. Please try again.", setToasts });
			});
	}

	const handleToggle = () => {
		setRemember(!remember);
	}

	return (
		<Fragment>
			<section className="login-page-wrapper page">
				<div className="login-page w-100" style={{ marginTop: "10%" }}>
					<header>
						<h1>Login page</h1>
					</header>
					<div className="form-holder d-flex w-100 justify-content-center">
						<Form
							noValidate
							validated={validated}
							onSubmit={loginHandler}
							className="w-75"
						>
							<Form.Group className="my-4" controlId="formLoginEmail">
								<Form.Label className="fw-bold text-secondary">Email</Form.Label>
								<div className="input-group">
									<Form.Control
										name="Email"
										className="form-control-lg border-0 shadow-sm"
										required
										type="email"
										placeholder="Enter email address"
										onChange={(e) => { }}
									/>
								</div>
								<Form.Control.Feedback type="invalid">Please enter a correct email</Form.Control.Feedback>
							</Form.Group>
							<Form.Group className="my-4" controlId="formLoginPassword">
								<Form.Label className="fw-bold text-secondary">Password</Form.Label>
								<div className="input-group">
									<Form.Control
										name="Password"
										className="form-control-lg border-0 shadow-sm"
										required
										type="password"
										placeholder="**********"
										onChange={(e) => { }}
									/>
								</div>
								<Form.Control.Feedback type="invalid">Please enter a correct password</Form.Control.Feedback>
							</Form.Group>
							<Form.Group className="my-4 d-flex flex-column gap-1" controlId="formLogin">
								<Form.Label className="fw-bold text-secondary">Remember me</Form.Label>
								<CustomToggle
									handleToggle={handleToggle}
									marginLeft={"0px"}
									isActive={remember}
									offstyle={"light"}
									onstyle={"dark"}
									on={"Yes"}
									off={"No"} />
							</Form.Group>
							<Form.Group className="d-flex flex-row justify-content-between">
								<button className="login-btn btn btn-dark btn-lg px-5 py-2 shadow-sm" type="submit">
									Login
								</button>
								<button className="login-btn btn btn-dark btn-lg px-5 py-2 shadow-sm" onClick={() => { navigate("/register") }}>
									Register
								</button>
							</Form.Group>
						</Form>
					</div>
				</div>
				<div style={{ position: "fixed", top: 20, right: 20, zIndex: 1050 }}>
					{toasts.reduce((acc, toast, index) => {
						const height = estimateHeight(toast.message);
						const totalHeight = acc.prevHeight; // Get previous total height
						acc.prevHeight += height + 10; // Update for next toast

						acc.elements.push(
							<CustomToast
								key={toast.id}
								message={toast.message}
								setShow={() => {
									setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toast.id));
								}}
								show={toast.show}
								index={index}
								top={totalHeight} // Pass computed top position
							/>
						);

						return acc;
					}, { elements: [], prevHeight: 0 }).elements}
				</div>
			</section>
		</Fragment>
	);
}

export default Login