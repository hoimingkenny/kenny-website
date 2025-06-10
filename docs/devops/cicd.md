# CICD

### 1. What is CI/CD, and why is it important?
1. CI/CD stands for Continuous Integration and Continuous Deployment.
2. CI: Involves developers frequently merging code changes into a shared repository, where automated builds and tests run to catch issues early.
    - For example, Use Jenkins to build and test the code after commit to catch bug early.
3. CD: Automates the deployment of validated code to SIT, UAT or PROD environments.

### 2. What are the key components of a CI/CD pipeline?
1. Source Control: Stores code (e.g., GitHub, GitLab).
2. Build: Compiles code and dependencies (e.g., Maven for Java).
3. Test: Runs automated tests (unit, integration, e.g., JUnit, Selenium).
4. Deploy: Deploys to environments (e.g., Kubernetes, AWS).
5. Health Check: Checks the health of the deployed application.