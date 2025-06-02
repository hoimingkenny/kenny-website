# Gopuff (Local Delivery Service)

## I. Define Functional/Non-functional Requirements
### Functional Requirements
- Core Requirements
    - 1. Aggregate availability of items across local distribution centers
    - 2. Allow users to place orders without double booking

### Non-Functional Requirements
- Core Requirement
1. Availability requests should be fast(`<100ms`) to support use-cases like search
2. Ordering should be strongly consistent: two customers should not be able to purchase the same physical product
3. System should be able to support 10k DCs and 100k items in the catalog across DCs
4. Order volume will be O(10m orders/day)

### Out of Scope
- Payments/purchases
- Driver routing
- Search
- Cancellations and returns

## II. Setup
### Defining the Core Entities

### Definiing the API

## III. High-Level Design
### Customers should be able to query availability of items
1. 

## IV. Deep Dives


