✨ **Beauty Bliss – Online Beauty Shopping Website**

Beauty Bliss is an e-commerce web application designed to provide customers with a simple and convenient online shopping experience for beauty and personal-care products.

The platform aims to provide a smooth shopping experience, allowing users to browse products, manage their accounts, add products to their shopping cart, place orders, and track their purchases.

The project uses a frontend built with HTML, CSS, and JavaScript, a Node.js and Express backend, and a MySQL database for data management.

**About the Project**

Beauty Bliss is a full-stack e-commerce web application developed to provide a convenient, engaging, and user-friendly online shopping experience for beauty and personal-care products.

Inspired by modern e-commerce platforms , Beauty Bliss brings together product discovery, user account management, shopping functionality, and order management in one platform.

The application combines a responsive frontend, a Node.js and Express.js backend, and a MySQL database to create an integrated shopping environment.

The primary goal is to build a complete shopping platform where customers can explore products, manage their accounts, and access their shopping and order information through a simple and intuitive interface.

**Project Highlights**

|Area |                  Description|

|🛍️ Shopping |Online beauty and personal-care shopping experience |

|👤 User Accounts | Registration, login, and profile management |

|🔐 Authentication | JWT-based authentication |

|🗄️ Database | MySQL database integration |

|⚙️ Backend | REST API development using Node.js and Express.js |

|📦 Orders | Order identification and order history functionality |

|💻 Interface | HTML, CSS, and JavaScript-based frontend |



🛠️ **Technology Stack**

Beauty Bliss uses a combination of frontend, backend, and database technologies.

**Frontend**

**HTML5** – Structures the website and its pages.

**CSS3** – Provides styling, layouts, and responsive design.

**JavaScript** – Handles client-side interactions and API communication.

**Backend**

**Node.js** – JavaScript runtime for server-side development.

**Express.js** – Framework for building backend APIs.

**JWT (JSON Web Token)** – Supports authentication and protected routes.

**Database**

**MySQL** – Relational database for storing and managing application data.

**SQL** – Used to define database structures and manage records.

**Development Tools**

Visual Studio Code

Git

GitHub

MySQL Workbench

Postman (for API testing)

🏗️ **System Architecture**

Beauty Bliss follows a three-layer application architecture.

              CUSTOMER
                  |
                  v
       +----------------------+
       |       FRONTEND       |
       |                      |
       |     HTML / CSS       |
       |     JavaScript       |
       +----------------------+
                  |
             HTTP / JSON
                  |
                  v
       +----------------------+
       |       BACKEND        |
       |                      |
       |       Node.js        |
       |       Express.js     |
       |                      |
       |   REST API Routes    |
       |   Authentication     |
       |   Business Logic     |
       +----------------------+
                  |
             SQL Queries
                  |
                  v
       +----------------------+
       |       DATABASE       |
       |                      |
       |        MySQL         |
       |                      |
       |   Persistent Data    |
       +----------------------+

**How it works:**

Customers interact with the website through the frontend.

The frontend sends HTTP requests to the backend.

The backend validates requests and processes application logic.

The backend communicates with MySQL to retrieve or store data.

The backend returns responses to the frontend.

The frontend displays the resulting information to the customer.

📂 **Project Structure**

The repository organizes the application into frontend, backend, and database components.

Beauty-Bliss/
│
├── Frontend/
│   │
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   │
│   ├── login.html
│   ├── register.html
│   ├── profile.html
│   ├── my-orders.html
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── other resources/
│
├── backend/
│   │
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── routes/
│   │
│   ├── controllers/
│   │
│   └── middleware/
│
├── database/
│   └── database.sql
│
├── .gitignore
├── .env.example
└── README.md

**Authentication & Security**

Security is an important part of the Beauty Bliss application.

The backend is designed with the following security practices:

> JWT-based authentication.

>Password hashing instead of plain-text password storage.

>Protected API endpoints.

>Environment-based configuration.

>Database credentials kept outside source control.

>Server-side request validation.

>Parameterized SQL queries.

**Database Setup**

The SQL schema is maintained separately so that the database structure can be recreated in another development environment.

**Example:**

mysql -u YOUR_USERNAME -p YOUR_DATABASE < database/database.sql

Replace the placeholders with your local MySQL configuration.

⚙️ **Installation & Setup**

Make sure the following are installed:

Node.js

npm

MySQL Server

Git

Visual Studio Code

**Step 1: Clone the Repository**

git clone YOUR_GITHUB_REPOSITORY_URL

Navigate to the project directory:

cd Beauty-Bliss

**Step 2: Install Backend Dependencies**

cd backend
npm install

**Step 3: Configure Environment Variables**

Create a .env file in the backend directory.

Example configuration:

PORT=5000

DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=beauty_bliss

JWT_SECRET=your_secure_random_secret

Use the exact environment variable names expected by the backend configuration.

**Step 4: Configure MySQL**

Create the development database and import the SQL schema.

Make sure the MySQL server is running before starting the backend.

**Step 5: Start the Backend Server**

npm start

If your project uses a development script, run:

npm run dev

**Step 6: Launch the Frontend**

Open the frontend using Visual Studio Code Live Server or another suitable local development server.

Ensure the frontend API configuration points to the backend server.

🔗 **API Documentation**

The backend exposes REST API endpoints for application functionality.

The following authentication and profile endpoints are currently documented:

|HTTP Method |  Endpoint |              Description|

|POST         |/api/auth/register | Register a new customer |

|POST | /api/auth/login |Authenticate a customer|

|POST | /api/auth/logout | Handle logout |

| GET  |/api/users/profile | Retrieve authenticated user profile |

Protected endpoints require valid authentication according to the backend's authentication configuration.

Additional endpoints should be documented as product, cart, checkout, and order APIs are implemented.

🔒 **Environment & GitHub Configuration**

The following files should be excluded from version control:

node_modules/
.env
.env.local

A .env.example file can be committed with placeholder values to help developers configure their local environments.


🖼️ **Screenshots**

### Home Page
![Home Page](screenshots/HomePage.png)

### Skincare Page
![Skincare Page](screenshots/SkincarePage.png)

### Makeup Page
![Makeup Page](screenshots/MakeupPage.png)

### Haircare Page
![Haircare Page](screenshots/HaircarePage.png)

### fragrance Page
![fragrance Page](screenshots/fragrancePage.png)

### Cart Page
![Cart Page](screenshots/CartPage.png)


🗺️ **Future Roadmap**

The following improvements can expand Beauty Bliss into a more comprehensive e-commerce platform.

Payment gateway integration.

Product reviews and ratings.

Email notifications.

Automated backend testing.

Production deployment.

👩‍💻 **Author**

**Developed by:**  Dayala Varshitha

**Project:** Beauty Bliss – Online Beauty Shopping Website

**Role:** Full-Stack Developer

This project was developed as part of my learning journey in full-stack web development, covering frontend development, backend API integration, database management, and authentication.