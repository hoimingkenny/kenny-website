# Jenkins Pipeline

### 1. Describe the flow of a Jenkins pipeline using Git, Maven and Openshift.
1. Git:
    - Clone the repository from GitHub.
    ``` bash
        git fetch --tags --force --progress -- https://github.com/xxx/xxx.git +refs/heads/*:refs/remotes/origin/*
        git checkout -f origin/main
    ```

2. Build with Maven:
    ``` bash
        mvn clean -B package
    ```
    - `-B`: Batch mode, without interactive prompts.
    - `package`: Build the project and create deployable artifacts (e.g., `target/ms-abc.jar`)

3. Build with Docker and Push to Registry:
    ``` bash    
        docker build -f Dockerfile -t registry.apps.xxx/name-space-hk/ms-xxx:1.0.0 .
        docker image push registry.apps.xxx/name-space-hk/ms-xxx:1.0.0
    ```

5. OpenShift and Helm:
    ``` bash
        // Adds a Helm chart repository
        helm repo add helm-repo https://nexus.apps.xxx/repository/helm-repo

        // Download the latest version of Helm chart
        helm pull xxxx:8443/oc:latest

        // Authenticates to OpenShift Cluster
        oc login -u admin -p xxxxx --cluster=api-xxx:6443 --user=svcmscp/api-xxx:6443 --insecure-skip-tls-verify

        // Switch to project
        oc project name-space-hk --cluster=api-xxx:6443 --user=svcmscp/api-xxx:6443 --insecure-skip-tls-verify

        // Updates the Helm release (ms-abc) in the name-space-hk namespace to handle deprecated Kubernetes APIs
        helm mapkubeapis --mapfile Map.yaml name-space-hk ms-abc

        // Adds metadata annotations to the OpenShift Route resource
        oc annotate route ms-abc -n name-space-hk meta.helm.sh/release-name=ms-xxx meta.helm.sh/release-namespace=name-space-hk --overwrite

        // Deploys or updates the Helm release using the Docker image
        helm upgrade --install ms-xxx registry.apps.xxx/xxx/ms-xxx:1.0.0 \
    ```