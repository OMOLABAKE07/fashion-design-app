# Fashion Design App Backend

This is the backend API for the Fashion Design App, built with Node.js, Express, and Sequelize ORM.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Usage](#usage)

## Tech Stack
- Node.js
- Express.js
- Sequelize ORM
- MySQL (default configuration)

## Database Schema

The application uses the following tables:

1. **Customers** - Stores customer information
2. **Measurements** - Stores measurement data for customers
3. **Designs** - Stores design project information
4. **Messages** - Handles internal messaging system
5. **Sync Queue** - Manages offline synchronization

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

## Installation

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Database Setup

1. Make sure you have MySQL installed and running on your system.

2. Create a database for the application:
   ```sql
   CREATE DATABASE fashion_design_db;
   ```

3. Update the `.env` file in the backend directory with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=fashion_design_db
   DB_PORT=3306
   PORT=3000
   ```

4. Run the database initialization script:
   ```
   npm run init-db
   ```

## Usage

1. Start the development server:
   ```
   npm run dev
   ```

2. The API will be available at `http://localhost:3000`

3. Health check endpoint: `http://localhost:3000/api/health`