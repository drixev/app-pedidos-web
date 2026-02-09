## Pedidos Web – Order Management Dashboard

**Pedidos Web** is a small React + TypeScript dashboard that helps you manage customer orders in a simple and friendly way.  
It includes **secure login** and a full **CRUD** (create, read, update, delete) flow for orders.

### What you can do

- **Login**:  
  - Sign in with your credentials to access the dashboard.  
  - All order actions are protected and only available for authenticated users.

- **Create orders**:  
  - Open a dialog to register a new order with its main details (for example: client, description, status, etc.).  
  - Save the order so it immediately appears in the list.

- **View orders**:  
  - See a table with all existing orders.  
  - Quickly understand the status of each order from a single screen.

- **Update orders**:  
  - Open an existing order, adjust its information, and save the changes.  
  - Keep orders always up to date as they move through your process.

- **Delete orders**:  
  - Remove orders that are no longer needed.  
  - Keep your list clean and focused on active work.

### Tech stack

- **Frontend**: React + TypeScript (Vite)  
- **API integration**: Axios-based services for authentication and orders  
- **State & context**: React hooks and an auth context to handle the user session

### Running the app

From the project root:

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser to use the login and start managing orders.

