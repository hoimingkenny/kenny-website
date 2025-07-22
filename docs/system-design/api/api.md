# API

### RESTful API Design
- An architectural style for designing networked applications, relying on stateless, client-server communication, typically over HTTP.

1. Designing URL
    1. Use plural nouns to present resources collections, e.g., `/user` for the collection of users
    2. For a specific resource, include an identifier, e.g., `/users/{userId}` for a specific user
    3. Avoid: Using verbs in URIs, e.g., /getUser is not RESTful

2. Use HTTP Methods
    - Use appropriate HTTP methods to define operations on resources, ensuring the method’s semantics match the action:
        - GET: Retrieve a resource or collection.
        - POST: Create a new resource.
        - PUT: Update an existing resource (full update).
        - PATCH: Partially update a resource.

3. Using HTTP Status Codes
    - Use standard HTTP status codes to indicate the outcome of API requests:
        - 201 Created: Resource successfully created.
        - 400 Bad Request: Invalid request from the client.
        - 401 Unauthorized: Authentication required or failed.
        - 500 Internal Server Error: Server encountered an error.

4. API Versioning
    - Implement versioning to manage API changes without disrupting existing users. Common approaches:
        1. URL Versioning: Include the version in the URL, e.g., `/api/v1/users`.
        2. Header Versioning: Specify the version in an HTTP header, e.g., `X-API-Version: 1.0`.
        3. Query Parameter Versioning: Include the version in a query parameter, e.g., `/api/users?version=1.0`.
    - Goal: Enable smooth API upgrades without breaking existing client integrations.

5. Standardized Response Format
    - Use a consistent response structure for all API endpoints to improve predictability and usability:
        ```json
        {
            "status": "failed",
            "data": {    
            },
            "message": "Failed to retrieve user details",
            "errorCode": "WL-001"
        }
        ```

6. Ensuring Idempotence
    - Design APIs to support idempotence for safe retry mechanisms, preventing unintended duplicate submissions.
    - Idempotent Methods:
        1. PUT: Updating a resource with the same request multiple times produces the same result (e.g., setting a user’s data to the same values).
        2. PATCH: Partial updates should also be idempotent when designed to set specific fields to defined values.
        3. GET and DELETE are inherently idempotent.
    - Non-Idempotent Method:
        1. POST: Typically creates new resources, so repeated calls may create duplicates unless handled (e.g., using unique request IDs or checks).
    - Use mechanisms like unique request IDs or conditional checks to ensure idempotence for operations prone to duplication.