import './App.css';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import Transactions from './pages/landing';
import Categories from './pages/categories';
import EditTransaction from './components/transaction/transaction-edit-form';
import Statistics from './pages/statistics';
import ProtectedRoutes from './components/protected-routes';
import Home from './pages/users/home';
import Admin from './pages/users/admin';
import Login from './pages/authentication/login';
import Register from './pages/authentication/register';
import LogoutPage from "./components/auth/logout"

function App() {
	const isLogged = localStorage.getItem("user");

	return (
		<Router>
			<Container>
				<Navbar className="p-3 w-100 fixed-top shadow-lg" bg="dark" variant="dark" expand="lg">
					<Navbar.Brand as={Link} to="/" className="fw-bold text-light">
						💰 Money Count
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="navbar-nav" />
					<Navbar.Collapse id="navbar-nav">
						<Nav className="ms-auto">
							{isLogged ? (
								<>
									<Nav.Link as={Link} to="/transactions" className="mx-2 text-light hover-effect">
										📋 Transactions
									</Nav.Link>
									<Nav.Link as={Link} to="/categories" className="mx-2 text-light hover-effect">
										🗂️ Categories
									</Nav.Link>
									<Nav.Link as={Link} to="/statistics" className="mx-2 text-light hover-effect">
										📊 Statistics
									</Nav.Link>
									<Nav.Link as={Link} to="/logout" className="mx-2 text-light hover-effect">
										🚪 Logout
									</Nav.Link>
								</>
							) : (
								<>
									<Nav.Link as={Link} to="/login" className="mx-2 text-light hover-effect">
										🔑 Login
									</Nav.Link>
									<Nav.Link as={Link} to="/register" className="mx-2 text-light hover-effect">
										📝 Register
									</Nav.Link>
								</>
							)}
						</Nav>
					</Navbar.Collapse>
				</Navbar>

				<Routes>
					<Route element={<ProtectedRoutes />}>
						<Route path="/" element={<Home />} />
						<Route path="/admin" element={<Admin />} />
						<Route path="/transactions" element={<Transactions />} />
						<Route path="/categories" element={<Categories />} />
						<Route path="/statistics" element={<Statistics />} />
						<Route path="/edit/:Transactionid" element={<EditTransaction />} />
						<Route path="/logout" element={<LogoutPage />} />
					</Route>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route
						path="*"
						element={
							<div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
								<div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-lg w-full w-50 h-25 d-flex align-items-center flex-column justify-content-center">
									<header>
										<h1 className="text-3xl font-bold text-red-500 mb-4">Page Not Found</h1>
									</header>
									<p>
										<a
											href="/"
											className="text-blue-500 hover:text-blue-700 transition duration-300"
										>
											Back to Home
										</a>
									</p>
								</div>
							</div>
						}
					/>
				</Routes>
			</Container>
		</Router>
	);
}

export default App;
