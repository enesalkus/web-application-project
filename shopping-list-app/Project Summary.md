# Shopping List App - Project Overview

## Project Description
A simple web-based shopping list management system. It's an application where users can add items to a list, specify quantities or weights, mark items as completed, and remove them. The application also features a contact form for users to send messages and a dedicated page to view these messages.

## Technologies Used
*   **Backend**: Node.js, Express.js
*   **Frontend**: HTML, CSS, Vanilla JavaScript
*   **Data Storage**: JSON files (`items.json`, `contacts.json`)
*   **Other**: CORS, body-parser, AlertifyJS (for frontend notifications)

## Functional Requirements
*   **Shopping List Management**: Users can add, delete, and update the status of items on the list.
*   **Item Details**: Items can be added with an optional quantity (in pieces) or weight (in kilograms).
*   **Contact Form**: A form allows users to send their name, email, and a message.
*   **Message Viewing**: A separate "Message Box" page displays all received messages.
*   **Single Page Application (SPA)**: The application uses a single HTML page with JavaScript to show and hide different sections (Home, Shopping List, Contact, Messages).

## Technical Features
*   **REST API**: The backend is built as a RESTful API to handle data operations.
*   **JSON Database**: The application uses the file system (`fs` module) to interact with JSON files as a simple database.
*   **Dynamic Frontend**: The frontend uses asynchronous JavaScript (`fetch`) to communicate with the backend API without page reloads.
*   **Modular Views**: The UI is split into different "pages" (divs) that are dynamically displayed.

## Data Structure
*   **items.json**: Stores an array of shopping list item objects.
    *   `id`: Unique identifier (timestamp).
    *   `name`: Name of the item.
    *   `quantity`: Number of pieces (optional).
    *   `weight`: Weight in kilograms (optional).
    *   `completed`: Boolean status.
*   **contacts.json**: Stores an array of contact message objects.
    *   `id`: Unique identifier (timestamp).
    *   `name`: Sender's name.
    *   `email`: Sender's email.
    *   `message`: The message content.
    *   `date`: ISO string of the submission time.

## Project Layers
*   **View Layer**: A single `public/index.html` file containing the structure for all pages. Inline and external CSS (`public/style.css`) is used for styling.
*   **Functional Layer**: `public/app.js` handles all client-side logic, including DOM manipulation and API communication.
*   **Data Layer**: The Node.js backend (`server.js`) which defines the API endpoints and interacts directly with the JSON data files in the `data/` directory.

## Current Status & Suggestions
*   The project successfully implements all the basic required functionalities.
*   There is no user authentication system; the shopping list and messages are public and shared among all users.
*   For a more robust and scalable application, replacing the JSON file storage with a proper database system (e.g., SQLite, PostgreSQL, or MongoDB) is highly recommended.
*   Error handling could be improved to provide more specific feedback to the user.
*   Security could be enhanced (e.g., by validating and sanitizing all user inputs on the server-side).

## Potential Users
*   Individuals or small groups needing a straightforward, shared shopping list.
*   Developers looking for a simple example of a full-stack JavaScript application.

## Project Goals
*   To simplify the process of managing a shopping list.
*   To demonstrate a clean implementation of a full-stack application using Node.js, Express, and Vanilla JS.
*   To create a user-friendly and intuitive interface for the defined functionalities.
