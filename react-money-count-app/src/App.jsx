import './App.css'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom'
import Landing from './pages/landing'
import Categories from './pages/categories'
import PaymentDetails from './components/payment/payment-details'
import EditPayment from './components/payment/edit-payment'

function App() {
	return (
		<Container>
			<BrowserRouter>
				<Navbar bg="dark" variant="dark" style={{ padding: 15, borderRadius: 5 }}>
					<Navbar.Brand as={Link} to="/">Money Count</Navbar.Brand>
					<Nav className="mr-auto">
						<Nav.Link as={Link} to="/">Payments</Nav.Link>
						<Nav.Link as={Link} to="/Categories">Categories</Nav.Link>
					</Nav>
				</Navbar>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/categories" element={<Categories />} />
					<Route path="/details/:paymentid" element={<PaymentDetails />} />
					<Route path="/edit/:paymentid" element={<EditPayment />} />
				</Routes>
			</BrowserRouter>
		</Container>
	)
}

export default App
