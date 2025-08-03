# CyberArk

### Threat
1. Ransomware Attack
    - Attackers encrypted files and demanded a ransom, threatening to release sensitive customer data if not paid​.
2. Cloud and Hybrid Environment Exploits
    - As banks migrate to cloud platforms, threats like misconfigured IAM roles or API vulnerabilities enable unauthorized access to privileged sessions.
3. AI-Powered Phishing
    1. Attackers use generative AI to create hyper-realistic deepfakes, personalized phishing emails, or voice cloning to trick employees into revealing credentials or approving fraudulent transactions.
4. Third-Party Attacks:
    1. Vulnerabilities in vendors or software supply chains (e.g., via APIs or cloud services) allow attackers to infiltrate banks indirectly.
5. Insider Threads and Credential Theft
    1. Malicious insiders or compromised privileged account (e.g. admin credentials) remain a top risk, amplified by remote work.

### Vulnerabilities
1. Unmanaged Privileged Accounts
2. Misconfigurations and Patch Gaps
3. Weak Authentication
    - Reliance on single-factor auth for privileged access
4. Data Exposure
    - Unencrypted sensitive data or over-privileged third-party access in supply chain.

### Mitigation
1. Implement Zero Trust and Least Privilege
    - Use CyberArk to enforce just-in-time access, session isolation, and credential rotation, limiting what attackers can do even if they breach a system.
2. AI-Enhanced Detection and Response
    - Deploy AI tools for anomaly detection in privileged sessions (e.g., unusual login patterns) and automated threat hunting
3. Multi-Factor Authentication (MFA)
    - Mandate MFA for all privileged access, with regular audits via CyberArk's reporting features.
4. Employee Training and Incident Response

### Industry Best Practices
1. Adopt PAM Lifecycles
    - Discover, inventory, and manage all privileged accounts; enforce role-based access control (RBAC) and session monitoring

### What is CyberArk and PAM?



### How It Works In My Development Team Scenario
#### Production Health Checks
1. Logging into the CyberArk System (PVWA), with LAN ID and RSA token
2. Search for the instance/compoent you want to check, and click show password by inputting Task Number.
3. For just-in-time access, PVWA pulls credentials from the EPV system and show them to us.
4. We use this password to log into the system.

Task Number: i.e., TSK00000123456, is the electronic approval that need to be raised by the department head. In the task, need to specific when, which instance, who need to access the system. 

#### CyberArk client installed on the working machine
1. The agent communicates with CyberArk’s servers to authenticate your device and ensure it meets security requirements (e.g., up-to-date antivirus, no unapproved software).