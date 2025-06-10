import Highlight from '@site/src/components/Highlight'
import Warn from '@site/src/components/Warn'
import Term from '@site/src/components/Term'

# OpenShift

### 1. What is OpenShift?
- Cloud Kubernetes-based Container Platform.

### 2. What is Cluster?
- A collection of nodes, pods, services, and other Kubernetes resources.

1. Master Node (Single Control Plane)
    - Responsible for orchestrating the entire cluster.
    - Do not run application workloads.
2. Worker Nodes (Multiple Nodes)
    - Handle the execution of application workloads (pods).

### 3. What is Helm and its component?
- <Term>Helm</Term>
    1. A package manager for Kubernetes
    2. Provide a templated, configurable, and reproducible way to deploy applications.
    3. Manage Kubernetes resources like Deployments, Services, ConfigMaps, Secrets, etc.
- <Term>Helm Chart</Term>
    1. A collection of Kubernetes resources, packaged into a single unit for easy deployment.
    2. Include templates, values to make deployment configurable.
    3. Reusable blueprints for deploying applications.
- <Term>Helm Release</Term>
    1. An instance of a chart deployed to a Kubernetes cluster with a specific configuration.