# MySQL

## B+ Tree
- B: Balanced
    - Insertion/Deletion: 會有node的分裂和合并
- B+ Tree Index: 一種以tree structure來組織索引項的多級索引
- Root Node, Non-leaf node and Leaf node
- Leaf Node指向主文件數據block
- 能夠自動保持與主文件大小相適應的樹的層次
- Leaf Node: 指向主文件的data block/data record
    - 最後一個pointer指向下一個block
- Non-leaf Node: point to 索引塊
- 索引字段值在leaf node是in order的

## B+ Tree for Indexing
- Dense Index:
    - Use primary key of the table
    - 主文件可以按主鍵排序，也可以不按，指針指向record
- Sparse Index:
    - Key field: Primay key
    - 主文件是按pk排序的
- 索引字段可帶有重復值

## B+ Tree vs BST
- 對于有N個leaf node的B+ Tree，其search complexitiy是`O(logdN)`，其中`d`表示node允許的最大子節點數
- 在實際應用中，d值是大于100的，這保證了當數據達千萬級別時，B+ Tree的高度是維持3~4層左右，也就是說一次數據查詢只需要做3~4次disk的I/O操作就可以
- 而BST的child node數只為2個，其Search Complexity為`O(logN)`，所經歷的disk I/O會比B Tree+多

## B+ Tree vs B Tree 
- B+ Tree只在leat node存儲data，而B Tree的non-leaf node也要存儲data
- B+ Tree的leaf node是double linked list的設計，適合range search，而B Tree不是

## B+ Tree vs Hash
- Hash在做等值查詢會更快，Search Complexity為`O(1)`
- 但Hash不適合做Range Search，而B+ Tree很適合

## How InnoDB store data？
- InnoDB是如何存儲data的
    - Record是按row來存儲，但是DB不以row為單位，而是以Page為單位
    - DB的I/O操作的最小單位是Page，InnoDB數據頁的default size為16KB，每次從Disk最少讀取16KB的內容到memory
    - 每個Page都有兩個pointers，分別指向上一個和下一個Page
    - Page中的record是按Primay Key順序組成的singly linked list
    - Page中的頁目錄是由多個Slot(槽)組成，相當于分組紀錄的index，slot指向相關的segment中最大的紀錄
    - 由于records是**按PK從小到大排序**，所以可以使用Binary Search快速定位要查詢的紀錄在那個Slot(那個分組)，再在Slot中遍歷所有紀錄，找到對應的records 
        
## How B+ Tree search in InnoDB?
- 總結上面，一個page中的紀錄是有限的，且PK是有序的，所以通過所有紀錄進行分組，然後將slot號放到頁目錄中作為index，通過binary search來找到紀錄在那個分組，減低search的time complexity

