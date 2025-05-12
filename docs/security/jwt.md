# JWT

## How is JWT Used for Authorization?
- Particularly in stateless, token-based authentication

- Authorization
    - The client stores the JWT and includes it in subsequent requests to the server
        - Usually the `Authorization` header as Bearer token
            ```text
            Authorization: Bearer <JWT>
            ```
    - The server receives the request, extracts the JWT, and verifies its integrity by checking the signature using the secret key (or public key for asymmetric signing)
    - If the JWT is valid and not expired, the server trusts the claims in the payload (e.g., user ID, roles) and uses them to determine access permissions


## API-Level Access Control
### Key Concept
- JWT Claims: Payload contains claims like `sub` (user Id), `roles` (e.g."customer", "admin"), `scopes` (e.g. `read:accounts write:transactions`)
- Authorization: The process of deciding whether a user has permission to call a specific API endpoint based on their claims
- API Endpoint

### Steps
1. Include JWT in API Request
    - Header: `Authorization: Bearer <JWT>`
2. Validate the JWT
    - Signature Verification: Use server's public key
    - Claims Verification: Check claims like `exp`, `iss` and `aud`
3. Extract claims from JWT
    - roles: e.g.  "customer", "admin"
    - scopes: e.g. `read:accounts`, `write:transactions`
    - sub: User ID for resource ownership checks
4. Enforce Authorization at API Level
    - Role-Based Access Control (RBAC)
        - Spring Security: Use `@PreAuthorize` annotation
        - e.g. `@PreAuthorize("hasRole('ADMIN')")`
    - Scope-Based Access Control (SBC)
        - e.g. `@PreAuthorize("hasAuthority('SCOPE_read:accounts')")`
    - Attibute-Based Access Control (ABAC)
        - Use custom logic to check claims or external data (e.g., user ID, resource ownership)
        - e.g. `@PreAuthorize("#accountId == authentication.principal.sub")`
    - URL-Based Security
        ```java
            @Configuration
            @EnableWebSecurity
            public class SecurityConfig extends WebSecurityConfigurerAdapter {
                @Override
                protected void configure(HttpSecurity http) throws Exception {
                    http.authorizeRequests()
                        .antMatchers("/api/accounts/**").hasRole("CUSTOMER")
                        .antMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                        .and()
                        .addFilterBefore(new JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
                }
            }
        ```