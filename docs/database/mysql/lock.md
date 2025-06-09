import Highlight from '@site/src/components/Highlight'
import Warn from '@site/src/components/Warn'
import Term from '@site/src/components/Term'

# Lock

### 1. What locks are there in MySQL?
- Locks can be categorized into three types: **global locks**, **table-level locks**, and **row-level locks**.

#### <Term>Global Lock</Term>
1. Using the `FLUSH TABLES WITH READ LOCK` statement puts the entire database in a read-only state
2. During this time, operations such as inserts, updates, deletes, or table structure modifications by other threads are blocked.
3. Mainly used for **full database logical backups** to ensure data consistencies in the backup file.

#### Table-Level Lock
1. <Term>Table Lock</Term>
2. <Term>Metadata Lock (MDL)</Term>
3. <Term>Intention Lock</Term>



#### Row-Level Lock
1. <Term>Record Lock</Term>
2. <Term>Gap Lock</Term>
3. <Term>Next-Key Lock</Term>