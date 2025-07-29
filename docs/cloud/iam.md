# IAM

## What is IAM?
1. IAM: Identity and Access Management 
2. Enable secure control of access to AWS resources

### IAM Terms
#### IAM User
An entity in your AWS account representing a person or workload (e.g., an application) that interacts with AWS resources.

#### IAM Group
IAM groups are collections of IAM users, designed to simplify permission management by applying policies to multiple users at once.

#### IAM Role
An IAM identity with permissions that can be assumed by entities like users, services, or applications, providing temporary security credentials without long-term passwords or keys.

#### IAM Policies
IAM policies are JSON documents (or similar) attached to identities or resources to define permissions, evaluated by AWS to allow or deny requests.

### IAM Policy and IAM Role
IAM Policy is a JSON file.
Four elements include: effect, action, resource, conditions, policy variables.

1. IAM Role
- Definition: An IAM role is a type of AWS identity, similar to an IAM user, but it is not bound to a specific person. It is used to grant permissions to entities (such as AWS services, applications, or other accounts). The role itself does not contain credentials (username or password), but instead accesses AWS services through temporary security credentials.

- Usage Scenarios:
    1. Authorize AWS services (such as EC2, Lambda) to access other services.
    2. Provide permissions for cross-account access (such as resources in account A being accessed by roles in account B).
    3. Provide temporary access permissions to external users or applications.
- Key Points:
    1. IAM roles themselves have no permissions; they must define their permission scope through attached strategies (Policy).
    2. Can be assumed by multiple entities (Assume Role).

2. IAM Policy
- Definition: An IAM policy is an object in JSON format used to define what actions (Actions) can be performed, which resources (Resources) can be accessed, and attached conditions (Conditions).
- Function: Control access permissions to resources through policies.
- It can be attached to IAM users, groups, roles, or AWS resources (such as S3 buckets).
- Types:
    1. Managed Policy: Independent policies created by users as required by AWS and that can be reused.
        - AWS managed policies (such as 'AdministratorAccess', 'PowerUserAccess').
        - User-defined policies.
    2. Inline Policy: Policies directly embedded in a single IAM user, group, or role. Usually used for permissions that require tight integration.
- Key Points:
    - The priority of policy permissions truly determines which operations can be performed.
    - Can be created based on JSON documents, supporting detailed condition checks.

#### Summary
- IAM Role: It is an identity used to grant temporary access permissions to other services or users.
- IAM Policy: It is a set of permission rules that control who can perform which operations on what resources.
- They complement each other, with the role (Role) responsible for "who can access", and the policy (Policy) responsible for "how to access" as well as "access scope".

### IAM Permission Boundaries
#### Example:
Suppose an IAM user is allowed to create EC2 instances and create S3 buckets. At the same time, the IAM permission boundary is set to only allow creating IAM Users. In this case, the IAM user cannot complete the operations specified in their permissions, because the effective permissions are the intersection of the two (i.e., the overlapping part).

#### How to Attach the PowerUserAccess Policy to a User, Group, or Role
The following are the steps to attach this policy to a user, group, or role:
Through the AWS Management Console:
1. Log in to the AWS Management Console.
2. Go to the IAM service page.
3. In the left navigation pane, select Users, Groups, or Roles.
4. Select the target user, group, or role, and click Attach permissions.
5. Select Attach policy.
6. Search for PowerUserAccess.
7. Select the checkbox next to the policy, then click Next.
8. After reviewing the permissions, click Add permissions.
Or through the AWS CLI

#### Best Practices
Use custom policies regularly: Based on needs, assign custom policies to users/roles to meet specific requirements.
Principle of least privilege: Ensure that users are granted only the minimum permissions required to complete their work, to enhance security.
Monitoring and auditing: Use AWS CloudTrail and IAM Access Analyzer to review the actual usage of permissions.

PowerUserAccess is a good starting point for permissions, but it should be combined with custom requirements for grouping and supplementation to ensure security and flexibility.

### AWS STS
AWS STS (Security Token Service) is a service provided by AWS that allows users to access AWS resources through temporary security credentials. Through STS, users can perform operations with temporary authorization without needing long-term access keys. Temporary issuance of time-limited Tokens is sufficient.

In essence, AWS STS's usage has the following points:
1. Temporary Credentials: Through AWS STS, users can generate temporary access credentials (including Access Key ID, Secret Access Key, and Session Token). These credentials have an expiration period, and they automatically become invalid after expiration, which can effectively shorten the time window of risk exposure.
2. Cross-account access: STS supports cross-account access. For example, a user from one AWS account can obtain temporary access keys for another AWS account through STS, thereby accessing resources in the other AWS account.
3. Federated identity: Users can use AWS STS to integrate external identity providers (such as Google, Facebook, Microsoft, etc.) with AWS. This allows external identity providers to access AWS resources.
4. Security: The temporary credentials provided by STS are more secure and granular, enabling dynamic generation of credentials when needed, while limiting their permissions and validity period.

Common STS Operations:
1. AssumeRole: Assume a role color comes with temporary credentials.
2. AssumeRoleWithSAML: Use SAML assertion to perform role assumption. Used for enterprise identity providers to provide federated access, such as with enterprise accounts like Google or Facebook, to assume an AWS role.
3. AssumeRoleWithWebIdentity (Deprecated): Use Web identity (such as Google or Facebook) to perform role assumption
4. GetSessionToken: Used to obtain an IAM user's (not a root account) temporary credentials. Generated session security credentials API. Commonly, this credential information is used to enable security for multi-factor authentication (MFA) validation.
5. GetFederationToken: Used to obtain external accounts (e.g., enterprise users, third-party users, etc.) to generate temporary credentials API. It is commonly used for low-trust roles (Federated Identity) to access AWS resources, suitable for SSO (single sign-on) integration scenarios.

### SAML
SAML (Security Assertion Markup Language) is a type of open standard based on XML, used for exchanging authentication and authorization data between an Identity Provider (IdP) and a Service Provider (SP).

It is mainly used in Web Single Sign-On (SSO) scenarios, allowing users to log in once to access multiple applications (such as various internal company services) or resources from external providers, without needing to re-login for each application.

SAML's working principle:
1. Identity Provider (IdP): Responsible for verifying the user's identity and generating SAML assertions. Users first log in to the identity provider.
2. Service Provider (SP): The application or service that the user wants to access. It relies on the security assertions provided by the IdP to verify the user's identity.
3. SAML Assertion: This is a secure XML document generated by the identity provider, containing user identity information such as username, permissions, etc. The service provider uses this assertion to confirm whether the user has access to its resources.

How to use it in cloud platforms: SAML is commonly used for integrating enterprise users with cloud platforms, such as AWS, Azure, etc., to achieve single sign-on and other permissions.

SAML Process:
Step-by-step explanation of the key steps in this process. The following is a typical user access to "resources" process.
1. The user accesses the resources of the Service Provider (SP).
2. The Service Provider redirects the user to the Identity Provider (IdP) for authentication.
3. After the user successfully logs in at the Identity Provider, the IdP generates a SAML response (including user identity and permission information), and sends it back to the Service Provider.
4. The Service Provider verifies the validity of the SAML response, ensuring it comes from a trusted Identity Provider, and then allows the user to access the resources.

SAML's Main Features:
- Single Sign-On (SSO): SAML enables users to perform single sign-on across multiple applications. That is, they only need to log in once to access all related applications.
- Decentralized Authentication: The authentication process is handled by the identity provider, rather than each application performing authentication independently.
- Cross-Domain Identity Verification: SAML is applicable to identity verification and authorization between different organizations, enabling enterprises to achieve cross-domain SSO.

SAML's Advantages:
- Enhanced Security: By centralizing the management of user identity verification, it reduces the risk of password leaks.
- User Experience: Users only need to log in once to access multiple applications.
- Scalability: Suitable for large-scale enterprise environments, supporting cross-organizational identity authentication.
Standard Openness: Based on open standards, facilitating integration with other systems.

Overall, SAML is a popular protocol used for sharing identity information between Web applications and services, achieving cross-domain single sign-on requirements.

### ARN
ARN (Amazon Resource Name) is a unique identifier for AWS resources. It is a string that contains a name and is fully qualified with a format. It is used to uniquely identify AWS resources without ambiguity, such as IAM users, S3 buckets, EC2 instances, and other services or resources.

The basic format of ARN is as follows:
`arn:aws:service:region:account-id:resource`

ARN is divided into parts:
`:arn`: Indicates that this is an ARN.
`:aws`: Indicates that this is an AWS resource, commonly fixed as "aws".
`:service`: The AWS service name, for example, s3 (S3 storage), ec2 (EC2 instance), iam (IAM user).
`:region`: The region code (such as us-east-1, us-west-2, etc.). Not all resources require a region code (for example, IAM resources do not require a region code).
`:account-id`: AWS account ID. This is used to identify the AWS account to which the resource belongs.
`:resource`: The specific resource identifier, usually the name or ID of the resource, with different formats for different services.

Examples:
S3 bucket ARN:
`arn:aws:s3:::my-bucket-name`
This is an S3 bucket's ARN, where my-bucket-name is the bucket name.

IAM role ARN:
`arn:aws:iam::123456789012:role/my-role`
This is an IAM role's ARN, where 123456789012 is the AWS account ID, and my-role is the role name.

EC2 instance ARN:
`arn:aws:ec2:us-west-2:123456789012:instance/i-0abcd1234efgh5678`
This is an EC2 instance's ARN, where us-west-2 is the region, 123456789012 is the AWS account ID, and i-0abcd1234efgh5678 is the EC2 instance ID.

Lambda function ARN:
`arn:aws:lambda:us-east-1:123456789012:function:my-function`
This is a Lambda function's ARN, where us-east-1 is the region, 123456789012 is the AWS account ID, and my-function is the Lambda function name.

ARN usage:
1. `Access Control`: ARN is used in IAM policies to define which users, roles, or services can access which resources. For example, in IAM policies, you can use ARN to specify permissions that allow access to S3 buckets or EC2 instances.
2. `API Calls`: Many AWS services' API requests require referencing specific resources through ARN. For example, when calling the sts:AssumeRole operation, you need to provide the role's ARN.
3. `Cross-Account Access`: When configuring multiple AWS accounts, ARN can help ensure the correct resources are specified. In summary, ARN is the unique identifier for AWS resources, used for access control, API calls, and inter-account operations.


### Identity Federation
#### SAML 2.0 IdP
Example: User -> Logs into IdP (Portal/Identity Provider) -> Retrieves login information from LDAP, confirms it's correct, and returns a SAML Assertion to the User -> The User uses this information to generate a temporary Token through the AssumeRoleWithSAML API by requesting AWS STS, and passes it to the User -> The User uses this temporary Token to access services on AWS.

Commonly used within enterprises, supports Microsoft Active Directory, Okta, OneLogin, etc. — Users log into AWS through SAML assertions.

#### OIDC (OpenID Connect) IdP
For user mobile or web applications, supports third-party providers like Google, Facebook, etc.
#### Cognito User Pool 
An identity service provided by AWS, suitable for scenarios where identity management for application users is required.
#### Web Federated Identity 
Users integrate external identity providers through Amazon Cognito.
#### Custom IdP
Use AWS STS (Security Token Service) to create temporary access tokens.