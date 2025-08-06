# Security Architecture

### I. Network Security Architecture
1. Multi-tier application architecture (i.e., DMZ, FE, BE) topology has been established.
2. Strict access controls to restrict remote administractive access to selected network segments and from selected devices only (i.e., jump host device).
3. Seperate environments for development, testing, staging and production.
4. Intenet-facing systems are protected against DDoS attacks using appropriate anti-DDoS solutions.
5. Deploy firewall or access control across boundaries, tiers.

### II. Application Security Architecture
1. To identify potential security flaws at an early stage and mitigate them before starting the development stage.
2. Poor design of architecture may expose the application to many security loopholes.
#### Reduce the attack surface
1. AVA (Application Vulnerability Assessment)
2. Penetration Testing
3. Verify that incoming access is allowed only from a set of known trusted IP addresses
4. Outdated and unsupported hardware and software should not be used
5. Verify that the functionalities that are not in-use have been disabled and that unnecessary code removed
6. Log the user logins, access control failures, and server-side input validation failures are logged to identify suspicious or malicious accounts
#### Apply Principle of Least Privilege
1. Data access permission are granted with right level of data access in tandem with changes on job roles and data secutrity classification
2. Access permisions are reviewed regularly
3. Any user access is duly approved and monitored
4. User who is no longer entitled to an application should be revoked

### III. Data Security Architecture
1. Confidential or highly sensitive data in transit & at rest are encrypted using encryption protocols (i.e., TLS 1.2)
2. Access to confidential or highly sensitive data stored are protected by strong authentication mechanisms and access right is follow the priniciple of 'Need to know'
    - Privileged IDs are enabled with 2FA
    - All IDs using for application are managed and lodged in EPV
3. Cryptographic keys lifecycle are tracked and managed as per review cycle
4. Production data is masked

### IV. Security Configuration
- Security Threats: Malware, APT attacks, data leak, and corruption

#### 1. Authentication
    1. Integrate with LDAP/AD
    2. Enforce MFA
    3. Strong password policy (i.e., min. 12 characters)
    4. Session timeout (i.e., auto timeout 15-30 mins)
    5. Restrict user concurrent sessions
    6. Disable default admin accounts
#### 2. Authorization
    1. RBAC
    2. Least privilege
    3. Segregation of duties (SoD)
    4. Role change audits
#### 3. Transport Security
    1. Enable TLS 1.2
    2. Use of secure protocols (disable HTTP, FTP, and unused ports)
    3. API Security: tokens, IP whitelisting
    4. Network segmentation: Isolate FE, BC, DB.
#### 4. Data Protection
    1. DB encryption: SHA2
    2. File encryption: AES-256
    3. Data masking
    4. Back security: encrypt & restrict access of disk
    5. Data retention policy
#### 5. Logging
    1. Log users activities
    2. Log admin activities, i.e., system change
    3. Log retention
    4. Central logging
#### 6. Environment Hardening
    1. Run service as non-root users
    2. Only use DB users to access to DB
#### 7. Integration Security
    1. Secure interfaces, TLS
    2. Whitelisting/Firewall, restrict IPs for inbound and outbound interfaces
    3. Input validation, data sanitize
    4. Certificate Management, i.e. use trusted CAs, rotate SSL certs periodically