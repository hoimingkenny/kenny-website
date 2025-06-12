# Robinhood

## Problem Requirements
1. Users can buy and sell financial products via an exchange and see their existing positions
2. Users can see the real-time value of their assets on one screen, as well as total portfolio value
3. Minimize the number of servers that we have listening to the exchange

## Numbers
- Arround 30 million users, 100 different investments in each portfolio

## Initial Thoughts
1. Most Robinhood clients are connecting via mobile device, so we want to limit the number of active connections to reduce how much load we put on them
    - Maybe try to keep it to one active connection per client
    - If client is connected from multiple devices, they'll want the same data on each device, should all connect to the same server
        - Use consistent hashing on userId to determine server to connect to
2. We can't have these "user server" directly listen to the exchange for prices
    - We need to pay extra for this, likely too expensive

## Placing Order 
- When a user place/cancel an order, it goes to an "exchange". As Robinhood is just the broker, it will forward the order to the exchange.
    - In reality, Robinhood allows other companies to pay them per order to decice which exchange the order goes to (payment for order flow)
    - When placing an order, it may take some time for the order to be filled, at which point it is "pending" and can be cancelled

- For cancelling orders(for pending order), we have race conditions
    - Need confirmation from the exchange of cancellation first before confirming the customer. Or else the user can click cancel, we can tell them it was cancelled, and the order could be filled in the mean time

## Order Placing Diagrams
1. User places the order and it saves in the DB
    - Order Table: MySQL (Shard on userId)
        - Fields: userId, productId, quantity, status, orderId
2. Order Gateway
3. Order Gateway sends the order to exchange
4. The exchange returns us the exchangeOrderId
5. Map the exchangeOrderId to robinhoodOrderId in Mapping Table
    - Shard on consistent hash of exchange id
    - Field: exchangeId, userId, orderId
6. Listeners listen to the exchange when exchange updates the order status
7. Listeners find the robinhoodOrderId by exchangeId in Mapping Table
8. Listeners also update the order in Order Table by robinhoodOrderId

## Cancelling Orders
1. Client -> Order Gateway
2. Get the exchangeId
3. Send cancel request to the exchange
4. Update the order status in the Order Table

## Quick Pricing Overview
1. There is no "price" for a stock or an option. Here is just what people are willing to pay
    - Jordan wants to buy NVDA for $100, Kenny wants to sell for $120
    - Trades happen when one person is willing to buy for a greater than or equal to amount that another party will sell for
2. Some products trade on many exchanges
3. Depending on the app they may compute the "price" in many different ways
    - Last trade price (not grant for illigal prices)
    - Take highest buy price and lowest sell price across exchange and average them

## Exchange Layer
- Recall: we want to minimize the number of subscriptions to exchanges
    - Publish data over multicast channels, typically using some sharding over ticker
    - We do not want one exchange facing server per user interested in an asset
    - Ideally, just one or two "publishing" servers per asset (can be run in active-active or active-passive configuration, can both listen to zookeeper)
        - AA: Publish updates twice but no downtime (need extra logic, use sequence number)
        - AB: only publish once but slight down time on failure. Need zookeeper to recover the service

## Pricing Layer
- The pricing layer has two jobs
    1. Decide a price for each asset based on incoming data from multiple exchange layer services for a given ticker
    2. Deliver prices to the user layer

    ```java
    User Service 1 ----websocket---> Pricing Service(GEM) <---- Exchange Service A <--UDP--> Exchange A
                                                         <---- Exchange Serviec B <--UDP--> Exchange B
    User Service 2    
    ```                

## Pricing Layer Load
- Note that in our diagram, our pricing server can get overloaded by popular assets
1. By exchange publishes if there are a lot of trades/open orders
    - In the last trade pricing case, our publishers could throttle how ofter they publish and only send some of the messages (or on averaged price)
    - In the weighted average case each published could build up state of bids and asks and occasionally send snapshot to pricing cache to aggregate
2. By user servers if many users want pricing, too many active connections
    - Solution: Pricing Forwarding Servers

## Pricing Forwarding Servers
- For popular assets, forward data from pricing servers to intermediary cache servers
```java
- User Server 1 --websocket--> Pricing GME Cache 1 <--- Pricing GME Server
  User Server 2 --websocket--> Pricing GME Cache 2 <--- 
```
- Can use round robin load balancing to decide which node to connect to







