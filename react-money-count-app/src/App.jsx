import './App.css'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom'
import Landing from './pages/landing'
import Categories from './pages/categories'
import EditPayment from './components/payment/payment-edit-form'
import Statistics from './pages/statistics'

function App() {
	return (
		<Container>
			<BrowserRouter>
				<Navbar className="p-3 w-100 fixed-top shadow-lg" bg="dark" variant="dark" expand="lg">
					<Navbar.Brand as={Link} to="/" className="fw-bold text-light">
						💰 Money Count
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="navbar-nav" />
					<Navbar.Collapse id="navbar-nav">
						<Nav className="ms-auto">
							<Nav.Link as={Link} to="/" className="mx-2 text-light hover-effect">
								📋 Payments
							</Nav.Link>
							<Nav.Link as={Link} to="/Categories" className="mx-2 text-light hover-effect">
								🗂️ Categories
							</Nav.Link>
							<Nav.Link as={Link} to="/Statistics" className="mx-2 text-light hover-effect">
								📊 Statistics
							</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/categories" element={<Categories />} />
					<Route path="/statistics" element={<Statistics />} />
					<Route path="/edit/:paymentid" element={<EditPayment />} />
				</Routes>
			</BrowserRouter>
		</Container>
	)
}

export default App
