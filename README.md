# API Mock JSON

This is a simple command-line tool for creating a mock API server based on a JSON configuration file. It uses [Express](https://expressjs.com/) to set up the server and allows you to define routes, HTTP methods, request parameters, request bodies, request headers, and response bodies through a JSON configuration file.

## Installation

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

```bash
npm install -g @afonso.oliveiragomes/api-mock-json
```

## Usage

```bash
api-mock-json -r <path-to-routes-json> -p <port>
```

- **`-r, --routes`**: Path to the JSON file containing the route configurations.
- **`-p, --port`**: Port number for the mock server. (Default is 9000)

## JSON Configuration

The JSON file should contain an object where each key represents a route, and the corresponding value is an object specifying the configuration for that route.

Example:

```json
{
  "/api/users": {
    "method": "GET",
    "response": { "users": [] },
    "headers": { "Content-Type": "application/json" }
  },
  "/api/users/:id": {
    "method": "GET",
    "params": { "id": "1" },
    "response": { "id": 1, "name": "John Doe" }
  },
  "/api/posts": {
    "method": "POST",
    "body": { "title": "Mock Post", "content": "This is a mock post." },
    "response": { "status": "success", "message": "Post created successfully." }
  }
}
```

- **`method`**: HTTP method for the route (GET, POST, PUT, PATCH, DELETE).
- **`response`**: The response body for the route.
- **`headers`**: (Optional) The expected request headers.
- **`body`**: (Optional) The expected request body.
- **`params`**: (Optional) The expected request parameters.

## Example


```bash
api-mock-json -r mock-config.json -p 3000
```

This command will start the mock server on http://localhost:3000 using the configurations specified in the mock-config.json file.

Visit the specified routes on your browser or use tools like curl or Postman to make requests to the mock API.
