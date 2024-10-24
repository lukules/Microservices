Uber Eats-like Food Delivery Microservices Application
Project Overview

This project is a simplified version of a food delivery system like Uber Eats, where users can browse restaurants, add items to their basket, and place orders. The architecture follows a microservices-based approach, where each service handles a specific domain, ensuring scalability, modularity, and independent development. Data was scrapped from Wolt site.
Key Features

    User Authentication: Users can register, login, and authenticate using JSON Web Tokens (JWT).
    Restaurant Management: View restaurants, filter by categories and cities, and view detailed restaurant menus.
    Basket Management: Users can add items to their basket and view their current order.
    Order Processing: Once an order is placed, it is processed and passed to the payment service.
    Payment Processing: Simulated payment service to handle transactions.

Technologies

    Node.js with Express.js for the backend services.
    PostgreSQL for relational data storage.
    REST APIs for communication between services.
    CORS for secure cross-origin requests.

Microservices

The application is composed of the following microservices:
1. User Service

Handles user registration, login, and authentication. This service uses JWT tokens for secure session management.

    Technologies: Express.js, JSON Web Tokens, PostgreSQL
    Endpoints:
        /register: Register a new user.
        /login: Authenticate user and return a JWT.
        /verifyToken: Validate the JWT token for secure routes.
        /refreshToken: Refreshes the user's authentication token.

2. Basket Service

Manages the user's shopping basket. This service is responsible for storing items added by the user and calculating the total price.

    Technologies: Express.js, PostgreSQL, UUID for generating unique basket IDs.
    Endpoints:
        POST /basket: Add items to the user's basket.
        GET /get_orders_for_courier: Retrieve all orders placed by users for delivery.
        GET /get_restaurant_info_for_order: Fetch the restaurant details associated with a specific order.
        DELETE /basket/user/:user_id: Clear the basket for a given user.

3. Payment Service

Handles the payment processing once the user places an order. It updates the payment status and logs the transactions.

    Technologies: Express.js, PostgreSQL
    Endpoints:
        POST /payment_status: Updates the payment status for a specific user.
        POST /insert_payment: Inserts a new payment record when an order is placed.

4. Restaurants Service

Acts as an entry point for the application. It provides endpoints for querying restaurants, menus, categories, and cities. This server communicates with the microservices to gather information and present it to the user.

    Technologies: Express.js, PostgreSQL
    Endpoints:
        GET /cities: Fetch all available cities with restaurants.
        GET /categories: Retrieve restaurant categories within a city.
        GET /restaurants: Retrieve restaurant information filtered by city.
        GET /categoryrestaurants: Retrieve restaurants by category within a city.
        GET /menu: Retrieve the menu for a specific restaurant.
