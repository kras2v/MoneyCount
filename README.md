# 💰 MoneyCount

A full-stack personal finance management application that helps you track your income and expenses, categorize transactions, and visualize your spending patterns.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **User Authentication & Authorization**
  - Secure user registration and login
  - Cookie-based authentication
  - Role-based access control (Admin/User)
  - Password requirements enforcement

- **Transaction Management**
  - Add, edit, view, and delete financial transactions
  - Track transaction date, amount, description
  - Categorize transactions for better organization
  - Soft delete functionality

- **Category Management**
  - Create custom categories for transactions
  - Upload and manage category icons
  - Edit and delete categories
  - User-specific categories

- **Statistics & Visualization**
  - View spending patterns with charts
  - Date range filtering for analytics
  - Visual insights into financial data

- **Admin Panel**
  - User management dashboard
  - View all registered users
  - Monitor user activity

## 🛠 Tech Stack

### Backend
- **Framework**: ASP.NET Core 8.0
- **Database**: SQL Server (LocalDB)
- **ORM**: Entity Framework Core 9.0
- **Authentication**: ASP.NET Core Identity with Cookie Authentication
- **API Documentation**: Swagger/OpenAPI
- **Mapping**: AutoMapper

### Frontend
- **Framework**: React 18.3
- **Build Tool**: Vite 6.0
- **UI Framework**: Bootstrap 5.3 + React Bootstrap
- **Routing**: React Router DOM 6.28
- **Charts**: Chart.js 4.4
- **Date Handling**: Moment.js + DateRangePicker
- **HTTP Client**: Fetch API

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Backend**:
  - [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
  - [SQL Server LocalDB](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb) or SQL Server

- **Frontend**:
  - [Node.js](https://nodejs.org/) (v16 or higher)
  - npm or yarn package manager

- **Tools**:
  - Git
  - Visual Studio 2022, VS Code, or any preferred IDE

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kras2v/MoneyCount.git
cd MoneyCount
```

### 2. Backend Setup

```bash
cd money-count-backend

# Restore NuGet packages
dotnet restore

# Update database with migrations
dotnet ef database update
```

### 3. Frontend Setup

```bash
cd money-count-frontend

# Install dependencies
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. **Database Connection**

   Update `appsettings.json` or `appsettings.Development.json` in the `money-count-backend` directory:

   ```json
   {
     "ConnectionStrings": {
       "SqlServerConnection": "Server=(localdb)\\MSSQLLocalDB;Database=aspnet-PaymentAPI;Trusted_Connection=True;MultipleActiveResultSets=True"
     }
   }
   ```

2. **CORS Settings**

   The backend is configured to allow requests from `http://localhost:5173` (default Vite dev server). Modify in `Program.cs` if needed:

   ```csharp
   builder.Services.AddCors(opt => opt.AddPolicy("AllowFrontend",
       p => p.WithOrigins("http://localhost:5173")
           .AllowAnyMethod()
           .AllowAnyHeader()
           .AllowCredentials()));
   ```

3. **Identity Configuration**

   Password requirements and lockout settings are configured in `Program.cs`. Adjust as needed:
   - Minimum password length: 6 characters
   - Requires digit, non-alphanumeric, and uppercase
   - Lockout: 5 failed attempts = 5-minute lockout

### Frontend Configuration

Create a `.env` file in the `money-count-frontend` directory:

```env
VITE_REACT_APP_API_URL=http://localhost:5000/api/
```

Update the URL to match your backend server address.

## 🏃 Running the Application

### Start the Backend

```bash
cd money-count-backend
dotnet run
```

The API will be available at `http://localhost:5000` (or the port specified in `launchSettings.json`).

Access Swagger documentation at: `http://localhost:5000/swagger` (in development mode)

### Start the Frontend

```bash
cd money-count-frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

**Backend:**
```bash
cd money-count-backend
dotnet publish -c Release
```

**Frontend:**
```bash
cd money-count-frontend
npm run build
```

The production build will be in the `dist` folder.

## 📁 Project Structure

```
MoneyCount/
├── money-count-backend/          # ASP.NET Core API
│   ├── Controllers/              # API Controllers
│   │   ├── AccountController.cs  # Authentication & user management
│   │   ├── CategoryController.cs # Category CRUD operations
│   │   └── TransactionController.cs # Transaction CRUD operations
│   ├── Data/                     # Database context and migrations
│   │   └── MoneyCountDbContext.cs
│   ├── Entities/                 # Database models
│   │   ├── User.cs
│   │   ├── Category.cs
│   │   └── Transaction.cs
│   ├── Models/                   # DTOs and view models
│   ├── MappingProfiles.cs        # AutoMapper configuration
│   └── Program.cs                # Application entry point
│
├── money-count-frontend/         # React application
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   │   ├── auth/             # Authentication components
│   │   │   ├── category/         # Category components
│   │   │   ├── transaction/      # Transaction components
│   │   │   └── protected-routes.jsx # Route protection
│   │   ├── pages/                # Page components
│   │   │   ├── authentication/   # Login & register pages
│   │   │   ├── users/            # User & admin pages
│   │   │   ├── categories.jsx    # Category management
│   │   │   ├── transactions.jsx  # Transaction management
│   │   │   └── statistics.jsx    # Analytics dashboard
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Application entry point
│   ├── public/                   # Static assets
│   ├── index.html                # HTML template
│   ├── vite.config.js            # Vite configuration
│   └── package.json              # Dependencies
│
└── README.md                     # This file
```

## 📖 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/account/register` | Register a new user | No |
| POST | `/api/account/login` | Login user | No |
| POST | `/api/account/logout` | Logout user | Yes |
| GET | `/api/account/checkuser` | Check if user is authenticated | Yes |
| GET | `/api/account/admin` | Access admin panel | Yes (Admin) |

### Transaction Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/transactions` | Get paginated transactions | Yes |
| GET | `/api/transactions/get-all-transactions` | Get all transactions | Yes |
| GET | `/api/transactions/{id}` | Get specific transaction | Yes |
| POST | `/api/transactions` | Create new transaction | Yes |
| POST | `/api/transactions/post-transactions` | Bulk create transactions | Yes |
| PUT | `/api/transactions` | Update transaction | Yes |
| DELETE | `/api/transactions` | Delete transaction | Yes |

### Category Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | Get all categories | Yes |
| GET | `/api/categories/{id}` | Get specific category | Yes |
| POST | `/api/categories` | Create new category | Yes |
| POST | `/api/categories/upload-category-icon` | Upload category icon | Yes |
| PUT | `/api/categories` | Update category | Yes |
| DELETE | `/api/categories` | Delete category | Yes |

### Request/Response Examples

#### Register User
```json
POST /api/account/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Create Transaction
```json
POST /api/transactions
{
  "name": "Grocery Shopping",
  "description": "Weekly groceries",
  "amount": 150.50,
  "categoryId": 1,
  "transactionDate": "2024-01-15T10:30:00"
}
```

#### Create Category
```json
POST /api/categories
{
  "name": "Food & Dining",
  "icon": "🍔"
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Update documentation as needed
- Test your changes thoroughly before submitting

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**kras2v**

- GitHub: [@kras2v](https://github.com/kras2v)

## 🙏 Acknowledgments

- [Chart.js](https://www.chartjs.org/) for data visualization
- [React Bootstrap](https://react-bootstrap.github.io/) for UI components
- [ASP.NET Core Identity](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity) for authentication

---

**Note**: This application is designed for personal use. Always keep your database credentials and sensitive configuration secure. Never commit `appsettings.Development.json` or `.env` files with sensitive data to version control.
