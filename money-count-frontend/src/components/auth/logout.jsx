import React, { useEffect } from "react";

function LogoutPage() {
	useEffect(() => {
		const logout = async () => {
			const response = await fetch(import.meta.env.VITE_REACT_APP_API_URL + "account/logout", {
				method: "POST",
				credentials: "include",
			});
			try {
				const data = await response.json();
				if (response.ok) {
					localStorage.removeItem("user");
					document.location = "/login";
				} else {
					console.log("Could not logout: ", response);
					throw exception;
				}
			} catch {
				console.log("Could not logout: ", response);
			}
		};

		logout();
	}, []);

	return <div>Logging out...</div>;
}

export default LogoutPage;