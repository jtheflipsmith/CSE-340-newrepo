# Copilot Instructions for CSE-340-newrepo

## Project Overview

This project is a backend-driven Node.js application that uses Express.js for server-side logic and PostgreSQL for data storage. The application serves dynamic pages using the EJS templating engine and organizes its codebase into distinct directories for controllers, models, routes, utilities, and views.

### Key Components

- **Controllers**: Handle business logic for different modules (e.g., `accountController.js`, `invController.js`).
- **Models**: Define data structures and interact with the database (e.g., `account-model.js`, `inventory-model.js`).
- **Routes**: Define API endpoints and map them to controller functions (e.g., `accountRoute.js`, `inventoryRoute.js`).
- **Views**: Contain EJS templates for rendering dynamic HTML pages.
- **Utilities**: Include helper functions for validation and other shared logic.
- **Public**: Static assets like CSS, JavaScript, and images.

## Developer Workflows

### Installing Dependencies

This project uses PNPM for package management. To install dependencies, run:

```bash
pnpm install
```

### Starting the Development Server

To start the Express server in development mode:

```bash
pnpm run dev
```

This will launch the server on `http://localhost:5500`.

### Testing in the Browser

1. Navigate to `http://localhost:5500`.
2. Add specific routes or filenames (e.g., `/filename.html`) to test functionality.

### Database Setup

- SQL scripts for initializing the database are located in the `database/` directory (e.g., `assignment2.sql`, `sql-db-code.sql`).
- Ensure PostgreSQL is installed and running locally.

## Project-Specific Conventions

### File Naming

- Controllers, models, and routes follow a clear naming convention based on their functionality (e.g., `accountController.js` for account-related logic).
- Views are organized into subdirectories (e.g., `views/account/` for account-related pages).

### Code Structure

- Each route file imports its corresponding controller.
- Controllers interact with models to fetch or manipulate data.
- Views use EJS to dynamically render data passed from controllers.

### Environment Variables

- The server port and host are configured via `.env` variables. Ensure a `.env` file exists with the required variables.

## Integration Points

- **Database**: PostgreSQL is used for data storage. SQL scripts are provided for schema setup.
- **Static Assets**: Static files are served from the `public/` directory.
- **Templating Engine**: EJS is used for rendering dynamic HTML pages.

## Examples

### Adding a New Route

1. Create a new route file in `routes/` (e.g., `newRoute.js`).
2. Define endpoints and map them to controller functions.
3. Import the route in `server.js` and use it with `app.use()`.

### Adding a New View

1. Create an EJS file in the appropriate `views/` subdirectory.
2. Use `<%= variable %>` to render dynamic data.
3. Pass data to the view from the corresponding controller.

---

For additional details, refer to the `README.md` file or explore the codebase. If you encounter any issues, ensure dependencies are installed and the database is correctly configured.
