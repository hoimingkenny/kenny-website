# Kubernetes

### 1. What is Kubernetes, and what problem does it solve?
1. Orchestrate containerized application.
2. Automate the deployment, scaling, and operations of containerized applications.
3. Kubernetes automatically distributes containers, balances traffic, and restarts failed pod.

### 2. What are the main components of a Kubernetes cluster?
- A cluster has two main parts: the master node (control plane) and the worker nodes.
- Control plane include:
    1. API Server: Handles requests and serves as the cluster’s front-end.
    2. Controller Manager: Runs controllers to maintain desired state, like scaling pods.
    3. Scheduler: Assigns pods to nodes based on resources and policies.
    4. etcd: Stores cluster state as a key-value database.
- Worker nodes:
    1. Kubelet: Manages pods and ensures they run as expected.
    2. Kube-Proxy: Manages network policies and routes traffic.
    3. Container Runtime: Runs containers (e.g., Docker).

### 3. What is a Pod in Kubernetes, and how is it different from a container?
1. Pod is the smallest deployable unit in Kubernetes.
2. Unlike a container, which is a single isolated process, a Pod can run multiple containers, sharing the same IP and volumes.

### 4. Explain the role of Deployments, ReplicaSets, and Services in Kubernetes.
1. Deployments
    1. Manage application updates and scalling ensuring smooth rollouts and rollbacks wihout downtime.
2. ReplicaSets
    1. Ensure a specified number of pod replicas are running, controlled by Deployments. 
    2. They maintain availability if pods fail.
3. Services
    1. To expose pods over a network.
    2. Each pod gets it own IP address.
4. Ingress
    1. As entrypoint for routing external traffic to services. 
5. Horizaontal Pod Autoscaler
    1. To automatically scale pods based on CPU or memory usage.

### 5. What is a Kubernetes Namespace, and why is it used?
1. A Namespace is a virtual cluster within a Kubernetes cluster, used to organize and isolate resources like pods, services, and deployments.
2. Separate environments (e.g., dev, prod) or teams in a shared cluster, preventing naming conflicts and enabling resource quotas.
3. Resource Quotas: Limit resource usage within a namespace.

### 6. How does Kubernetes handle storage, and what are Persistent Volumes (PVs) and Persistent Volume Claims (PVCs)?
- Kubernetes manages storage using Persistent Volumes (PVs) and Persistent Volume Claims (PVCs).

1. A PV is a cluster-wide storage resource, like an NFS share or cloud disk, provisioned manually or dynamically via StorageClasses.
2. A PVC is a request by a user for storage, specifying size and access mode, which binds to a matching PV.

### 7. What is an Ingress, and how does it differ from a Service?
1. A Kubernetes resource that manages external HTTP/HTTPS traffic, providing routing rules to direct requests to Services based on host or path.
2. A Service, however, handles internal networking and load balancing for pods, typically within the cluster.

- For instance, I used an Ingress to route `example.com/api` to a backend Service, while the Service load-balanced traffic to multiple API pods.

### 8. How do you scale applications in Kubernetes?
1. Horizontal Pod Autoscaling (HPA)
    - Automatically adjusts pod replicas based on metrics like CPU or memory usage.
    - Example: I set up HPA to scale a web app from 2 to 5 pods during high traffic.
2. Cluster Autoscaling
    - Adds or removes nodes based on resource needs.
3. Manual Scaling
    - Using `kubectl scale deployment my_app --replicas=4` to set a fixed number of pods.

### 9. What are ConfigMaps and Secrets, and how are they used?
- ConfigMaps
    - Store non-sensitive configuration data.
- Secrets
    - store sensitive data, like passwords or API keys.

- Both can be mounted as volumes or injected as environment variables in pods.

### 10. How do you troubleshoot a pod that is in a CrashLoopBackOff state?
- To troubleshoot a CrashLoopBackOff pod,
    1. Check logs with `kubectl logs <pod_name>` to identify errors
    2. Run `kubectl describe pod <pod_name>` to see events, such as resource limits or image pull issues.
    3. Verify the pod’s configuration, like `command` or `args` in the YAML, for errors.