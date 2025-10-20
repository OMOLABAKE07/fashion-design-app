# Fashion Design App

A modern web application for fashion designers and tailors to manage customer data, designs, and measurements.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)

## Features

- Customer management (CRUD operations)
- Measurement recording with category-based organization
- Design project tracking
- Message center for communication
- Responsive UI built with Vue 3
- Offline synchronization capabilities

## Tech Stack

### Frontend
- Vue 3 with Composition API
- Vite (bundler and dev server)
- Pinia (state management)
- Vue Router (client-side routing)

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL database

## Prerequisites

- Node.js version ^20.19.0 || >=22.12.0
- MySQL database server
- npm (comes with Node.js)

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the backend directory with your database configuration:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=fashion_design_db
   DB_PORT=3306
   PORT=3000
   ```

### Frontend Setup

1. Install frontend dependencies:
   ```bash
   npm install
   ```

## Database Setup

1. Create a MySQL database:
   ```sql
   CREATE DATABASE fashion_design_db;
   ```

2. Initialize the database tables:
   ```bash
   cd backend
   npm run init-db
   ```

## Running the Application

### Start the Backend Server

```bash
cd backend
npm start
```

Or for development with auto-restart:
```bash
cd backend
npm run dev
```

### Start the Frontend Development Server

```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Health Check: http://localhost:3000/api/health

## API Endpoints

### Customers
- `GET /api/customers` - Get all customers (with optional search query parameter)
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Measurements
- `GET /api/measurements` - Get all measurements
- `GET /api/measurements/customer/:customerId` - Get measurements by customer ID
- `GET /api/measurements/:id` - Get measurement by ID
- `POST /api/measurements` - Create a new measurement
- `PUT /api/measurements/:id` - Update measurement
- `DELETE /api/measurements/:id` - Delete measurement

### Designs
- `GET /api/designs` - Get all designs
- `GET /api/designs/customer/:customerId` - Get designs by customer ID
- `GET /api/designs/:id` - Get design by ID
- `POST /api/designs` - Create a new design
- `PUT /api/designs/:id` - Update design
- `DELETE /api/designs/:id` - Delete design

### Messages
- `GET /api/messages` - Get all messages
- `GET /api/messages/customer/:customerId` - Get messages by customer ID
- `GET /api/messages/:id` - Get message by ID
- `POST /api/messages` - Create a new message
- `PUT /api/messages/:id` - Update message
- `DELETE /api/messages/:id` - Delete message