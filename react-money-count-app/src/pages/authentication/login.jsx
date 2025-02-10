import { Fragment, useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import CustomToggle from "../../components/custom-toggle";

const Login = () => {
	document.title = "Login";
	const [validated, setValidated] = useState(false);
	const [remember, setRemember] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const user = localStorage.getItem("user");
		if (user) {
			document.location = "/";
		}
	}, []);

	async function loginHandler(e) {
		e.preventDefault();
		const form_ = e.target;
		const subbmitter = document.querySelector(".login-btn");
		const formData = new FormData(form_, subbmitter);
		const dataToSend = {};

		for (const [key, value] of formData) {
			dataToSend[key] = value;
		}
		if (dataToSend.Remember === "on") {
			dataToSend.Remember = true;
		}

		const response = await fetch(import.meta.env.VITE_REACT_APP_API_URL + "account/login", {
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
			localStorage.setItem("user", dataToSend.Email);
			document.location = "/transactions"; // Directly redirect without any ReturnUrl
		}
		const messageEl = document.querySelector(".message");
		if (data.message) {
			messageEl.innerHTML = data.message;
		} else {
			messageEl.innerHTML = "Something went wrong.";
		}

		console.log("Login error: ", messageEl.message);
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
					<p className="message"></p>
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
			</section>
		</Fragment>
	);
}

export default Login