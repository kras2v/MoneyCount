import { Fragment, useEffect, useState } from "react";
import { Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import CustomToast, { showMessageWindow } from "../../components/toast";

const Register = () => {
	document.title = "Register";
	const [validated, setValidated] = useState(false);
	const navigate = useNavigate();

	const [message, setMessage] = useState("");
	const [showMessage, setShowMessage] = useState("");

	useEffect(() => {
		const user = localStorage.getItem("user");
		if (user) {
			document.location = "/";
		}
	}, []);

	async function registerHandler(e) {
		e.preventDefault();
		const form_ = e.target;
		const subbmitter = document.querySelector(".register-btn");
		const formData = new FormData(form_, subbmitter);
		const dataToSend = {};

		for (const [key, value] of formData) {
			dataToSend[key] = value;
		}

		const newUserName = dataToSend.Name.trim().split("");
		dataToSend.UserName = newUserName.join("");

		const response = await fetch(import.meta.env.VITE_REACT_APP_API_URL + "account/register", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify(dataToSend),
			headers: {
				"content-type": "Application/json",
				"Accept": "application/json"
			}
		});

		const data = await response.json();
		if (response.ok) {
			showMessageWindow({ message: "Registered successfully.", setMessage, setShowMessage })
			document.location = "/login";
		}
		const messageEl = document.querySelector(".message");
		if (data.message) {
			messageEl.innerHTML = data.message;
		} else {
			let errorMessages = "<div>Attention please:</div><div className='normal'>"
			data.errors.forEach(error => {
				errorMessages += error.description + " "
			});
			errorMessages += "</div>";
			messageEl.innerHTML = errorMessages;
		}

		console.log("Register error: ", messageEl.message);
	}

	return (
		<Fragment>
			<section className="register-page-wrapper page">
				<div className="register-page" style={{ marginTop: "10%" }} >
					<header>
						<h1>Register page</h1>
					</header>
					<p className="message"></p>
					<div className="form-holder  d-flex w-100 justify-content-center">
						<Form
							noValidate
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
										type="name"
										placeholder="Enter your name"
										onChange={(e) => { }}
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
										placeholder="Enter email address"
										onChange={(e) => { }}
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
										placeholder="**********"
										onChange={(e) => { }}
									/>
								</div>
								<Form.Control.Feedback type="invalid">Please enter a correct password</Form.Control.Feedback>
							</Form.Group>
							<Form.Group className="d-flex flex-row justify-content-between">
								<button className="login-btn btn btn-dark btn-lg px-5 py-2 shadow-sm" type="submit">
									Register
								</button>
								<button className="login-btn btn btn-dark btn-lg px-5 py-2 shadow-sm" onClick={() => { navigate("/login") }}>
									Login
								</button>
							</Form.Group>
						</Form>
					</div>
				</div>
			</section>
			<CustomToast message={message} setShow={setShowMessage} show={showMessage} />
		</Fragment>
	);
}

export default Register