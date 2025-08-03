# Access AWS for Non-IAM users

### Flow
1. Setup
    1. Configure ADFS as a SAML provider in AWS IAM by uploading ADFS metadata and creating trusting IAM roles.
    2. In ADFS, add AWS as a relying party, define claim rules to map AD groups to AWS role ARNs.
2. Authentication
    1. A user authenticates via ADFS using AD credentials.
    2. ADFS retrieves group memberships and issues a SAML assertion
3. Role assumption
    1. The assertion is sent to AWS STS which grants temporary credentials for assuming a role in a target AWS account (e.g., a development account managed by Control Tower)
    - Non-IAM user access the AWS resource by assuming IAM Role attached with token
4. Access Management
    1. IAM Identity Center lists available roles/accounts.
    2. Control Tower's guardrails (e.g., SCPs) restrict actions across the organization while account-specific IAM policies control resource access
5. Multiple-Account Navigation
    1. Users can switch roles/accounts via the AWS Management Console, but only assume one role at a time.

### Least-Privilege Implementation
1. The user is authenticated via ADFS
2. A role is assigned based on your AD group.
3. This role has IAM policies attached with only necessary actions.
4. Temporary credentials expire, reducing risk if compromised

### Strategies for Least-Privilege
1. Group accounts by OU.
    - Create a boundaries with minimum permission.
2. Use federated roles over long-term keys.
    - Auto-expire reduces exposure.
3. Use SCPs for restriction, IAM policies for grants.
