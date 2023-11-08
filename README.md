# Node-Express Boilarplate

This is a Node.js Express application with a basic setup.

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js installed on your machine
- npm (Node Package Manager) installed on your machine

### Installation

1. Clone the repository:

```bash
git clone https://github.com/imtuhinkhan/node-express-boilarplate.git
```
```bash
cd node-express-boilarplate
```
```bash
npm install
```
### Environment Variables

- Create a .env file in the root directory and add the following environment variables:
```bash
MONGO_URI=your_mongo_uri
DATA_BASE=your_database_name
JWT_SECRET=your_jwt_secret
PORT=your_port_number
```
Replace your_mongo_uri, your_database_name, your_jwt_secret, and your_port_number with your actual MongoDB URI, database name, JWT secret, and desired port number.

### Run the Server
To start the server, run the following command:
```bash
npm run server
```