# E-Commerce Project

## Description

A full-stack e-commerce web application with a modern frontend and a robust backend API.

## Features

* User authentication
* Product listing
* Add to cart functionality
* Admin dashboard for managing products and orders

## Tech Stack

* Frontend: React (Vite)
* Backend: Java Spring Boot
* Database: PostgreSQL

## Project Structure

* ecommerce-frontend/ → Frontend built with React (Vite)
* ecommerce-backend/ → Backend built with Spring Boot

## How to Run

### Backend

1. Navigate to the backend folder:

   ```
   cd ecommerce-backend
   ```
2. Run the Spring Boot application:

   ```
   mvn spring-boot:run
   ```

   or run it from your IDE

### Frontend

1. Navigate to the frontend folder:

   ```
   cd ecommerce-frontend
   ```
2. Install dependencies:

   ```
   npm install
   ```
3. Start the development server:

   ```
   npm run dev
   ```
4.Database Setup

 . Install PostgreSQL

 . Create a database:
   createdb ecommerce_db

 . Run the schema file:
   psql -U your_username -d ecommerce_db -f database/schema.sql

This will create all required tables (users, products, cart_items, orders, etc.)
## Notes

*Mock user 
	\ for admin role 
			=admin@gmail.com password=123456
			
        \ for customer role
			=user@gmail.com  passsword=111111

* Make sure PostgreSQL is running and properly configured in the backend.
* Update application properties if needed (DB username, password, port).
