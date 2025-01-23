import './App.css'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom'
import Landing from './pages/landing'
import Categories from './pages/categories'
import PaymentDetails from './components/payment/payment-details'
import EditPayment from './components/payment/payment-edit-form'
import Statistics from './pages/statistics'

function App() {
	return (
		<Container>
			<BrowserRouter>
				<Navbar className="p-3 w-100 fixed-top" bg="dark" variant="dark">
					<Navbar.Brand as={Link} to="/">Money Count</Navbar.Brand>
					<Nav className="mr-auto">
						<Nav.Link as={Link} to="/">Payments</Nav.Link>
						<Nav.Link as={Link} to="/Categories">Categories</Nav.Link>
						<Nav.Link as={Link} to="/Statistics">Statistics</Nav.Link>
					</Nav>
				</Navbar>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/categories" element={<Categories />} />
					<Route path="/statistics" element={<Statistics />} />
					<Route path="/details/:paymentid" element={<PaymentDetails />} />
					<Route path="/edit/:paymentid" element={<EditPayment />} />
				</Routes>
			</BrowserRouter>
		</Container>
	)
}

export default App
