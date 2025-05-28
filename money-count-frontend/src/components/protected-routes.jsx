import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isWaiting, setIsWaiting] = useState(true);

	useEffect(() => {
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "account/checkuser", {
			method: "GET",
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					setIsWaiting(false);
					setIsLoggedIn(false);
					return Promise.reject(new Error("HTTP error " + response.status));
				}
				return response.json();
			})
			.then(data => {
				if (data && data.data.user &&  data.data.user.email) {
					setIsLoggedIn(true);
					localStorage.setItem("user",  data.data.user.email);
				} else {
					console.error("Invalid server response:", data);
					setIsLoggedIn(false);
					throw new Error("Invalid server response");
				}
			})
			.catch(error => {
				console.error("Error protected routes: ", error);
				localStorage.removeItem("user");
				setIsLoggedIn(false);
			})
			.finally(() => setIsWaiting(false));
	}, []);

	return (
		isWaiting ?
			<div className="waiting-page">
				<h1> Waiting... </h1>
			</div>
			:
			isLoggedIn ? <Outlet /> : <Navigate to="/login" />

	)
}

export default ProtectedRoutes;