import { useEffect, useState } from "react";
import { Alert, Container, Table } from "react-bootstrap";

const AdminPage = () => {
	document.title = "Admin page";
	const [users, setUsers] = useState([]);

	const [message, setMessage] = useState("");
	const [showMessage, setShowMessage] = useState("");

	useEffect(() => {
		fetch(import.meta.env.VITE_REACT_APP_API_URL + "account/admin", {
			method: "GET",
			credentials: "include"
		}).then(response => response.json())
			.then(data => {
				setUsers(data.data.users);
				console.log("users: ", data.data);
			})
			.catch(error => {
				console.log("Error home page: ", error)
			});

	}, []);

	return (
		<Container className="mt-4">
			<h2 className="text-center mb-4">Admin Page</h2>
			{users ? (
				<Table striped bordered hover responsive className="text-center">
					<thead className="table-dark">
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Created Date</th>
						</tr>
					</thead>
					<tbody>
						{users.map((u, i) => (
							<tr key={i}>
								<td>{u.name}</td>
								<td>{u.email}</td>
								<td>{u.createdDate ? u.createdDate.split("T")[0] : ""}</td>
							</tr>
						))}
					</tbody>
				</Table>
			) : (
				<div className="alert alert-danger mt-4">
					<h1>Access Denied!!</h1>
				</div>
			)}
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
		</Container>
	);
};

export default AdminPage;