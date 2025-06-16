# Automatic Deployment

### In General
1. Create your application and the Dockerfile
2. Run `mvn package`
3. Create Docker image
    - `docker build -t <image_name> .`
    - `docker run -p 8080:8080 <image_name>`
4. Create `deployment.yaml`
    - Specify the image name, port and number of replicas
5. Create `service.yaml`
    - define the service type and port
6. Apply the change to K8S cluster
    - `kubectl apply -f deployment.yaml`
    - `kubectl apply -f service.yaml`
7. Check the result:
    - `kubectl get pods`
    - `kubectl get svc`