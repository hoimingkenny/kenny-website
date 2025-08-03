# SAML

### Definition
- Security Assertion Markup Lanaguage
- An XML-based standard for exchanging authentication and authorization data betweek IdPs and service providers to verify the user's identity and permission, then grant or deny their access to services.

### SAML Assertion
1. A XML document containing data that confirms to the service provider that the person who is signing in has been successfully authenticated

### Usage
- Commonly used to help enterprise users sign in to multiple applications using a single login (SSO).

### How SAML works?
1. User tries to access SP.
2. SP redirect the user to the IdP (e.g., ADFS).
3. IdP authenticates the user.
4. IdP sends a SAML Assertion back to SP.
5. SP validates the assertion and grants access based on the attributes.

### Scenario: Accessing Another SSO-Enabled SP
1. User tries to access to another SSO-enabled SP.
2. Second SP redirects the user to IdP
3. IdP checks for active session
    - If the IdP session has expired, you'll be prompted to authentication page again.
4. IdP sends a SAML assertion to the second SP
5. Second SP validates the assertion and grants access



