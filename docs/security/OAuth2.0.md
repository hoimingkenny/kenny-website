# OAuth2.0

## Key Component
- Client: Customer's broswer
- INB: Frontend application which interacts with back-end microservices
- Spring Cloud Gateway: Gateway for API
- Customer Security Server: Customer authentication
- Authorization Server: OAuth2.0 server to issue authorization codes and access tokens
- Access Token: JWT/Opaque token

## Detailed Flow
1. The customer initiates the login process with their credentials
2. The client sends the customer's credentials to the Customer Security Server for authentication
3. Customer Security Server calls Authorization Server to obtain authorization code
4. The authorization code is sent back to the client
5. The client (browser) is rediceted to the INB OAuth login with the authorization code
6. Client uses OAuth login with authorization code
7. INB calls Authorization Server to obtain access token
8. INB validate access info & create a session
    - Session allows the customer to interact with the application without having to login again
9. Cluient can now continue the journey

## Flow Summary
- Authentication: Customer Security Server
- Authorization: Authorization Server
- Access: The access token (JWT/opaque token) allows the application to access the protected resources on behalf of the customer
- Session: A server-side session maintain the customer's state during their session

