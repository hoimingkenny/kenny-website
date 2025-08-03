# Single Sign On

### Definition
- Allow user to log in one application and then automatically signed into other appplications, regardless of the platform, or domain.
- User do not need to remember separate sets of credentials for each application

### Component
#### Service Provider (SP)
#### Identity Provider (IdP)
1. Your own website that stores user email-password pair in a DB.
2. LDAP: For enterprises that handle employee database using LDAP
3. AD (Active Directory): For companies that handle users using Windows AD
4. Others: Auth, Okta

### Example
1. When a user wants to log into an SSO-enabled application (SP), the latter redirects the request to the company's IdP (i.e., ADFS)
2. The IdP confirms the user's identity and access level and sends a SAML response and assertion to the service provider, allowing the user to log in.


