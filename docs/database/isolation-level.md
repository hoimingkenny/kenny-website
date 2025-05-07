# Transactional

Two concurrent transactions are updating on the same transaction record,
	- The existing record cannot be changed by second transaction till the first transaction is committed
	- But new transaction can be added




"optimistic locking failed; nested exception is org.hibernate.StaleObjectStateException: row was updated or deleted by another transaction (or unsaved-value mapping was incorrect)" is an error that occurs when optimistic locking fails due to a data conflict. However, after investigation, it was found that no other transaction has modified the same data."

Transaction Isolation Level:
	- change to higher level: REPEATABLE READ or SERIALIZABLE

@Version configuration:
	- used on the version field of the entity class


How to ensure that only one pod executes the scheduled task when multiple pods are started?
	- use shedlock
	- execution frequency of the task >= lock duration of Shedlock

Dirty Read
	- Happens when one transaction reads data that has been modified by another transaction but not yet committed
	- The uncommitted data might be rolled back later, end up with inconsistent data

Example:
1. Transaction 1 updates the balance from 100 to 150 but doesn't committed yet
2. Transaction 2 reads the updated value (150)
3. T1 rolls back, reverting the balance to 100
4. T2 now has the value 150

Isolation Level on Dirty Read
READ UNCOMMITTED
	- Allow transactions to read uncommitted changes from other transactions
READ COMMITTED
	- Ensure that a transaction only reads data that has been committed by other transaction
REPEATABLE READ
	- 
SERIALIZABLE
	- the strictest level