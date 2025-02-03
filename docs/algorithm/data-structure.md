# Data Structure

## Array
- 分為兩大類，一類Static Array，一類是Dynamic Array。
- Static Array：Block of continuous memory space，可以通過indexing來訪問這塊內存空間中的元素。
- Dynamic Array：底層還是static array，只是編程語言為了方便我們使用，在基礎上幫我們添加了一些常用的API，比如`push`， `insert`， `remove`等等的方法，可以讓我們更方便地操作數組元素。

```java
// define a static array of size 10
int arr[10];

// initialize the array values to 0 using memset function
memset(arr, 0, sizeof(arr));

// assign values using index
arr[0] = 1;
arr[1] = 2;

// retrieve values using index
int a = arr[0];
```

What `int arr[10]` do?
1. Allocate了一段連續的內存空間，大小是`10 * sizeof(int)` bytes，一個`int`在computer memory佔了4 bytes，共40bytes
2. 定義了一個名為`arr`的數組指針，指向這段內存空間的首地址

而`arr[1] = 2`主要做了以下幾件事情：
1. 計算`arr`首地址加上`1 * sizeof(int)` bytes的offset, 找到內存空間中的第二個元素的首地址
2. 從這個地址開始的4個bytes的內存空間中寫入了整數2

總結：
可以隨機訪問：只要給任何一個數組的index，可以在O(1)的時間內直接取到對應元素的值
因為我可以通過首地址和索引直接計算出目標的內存地址。計算機的內存尋址時間可以認為是O(1)，所以數組的隨機訪問時間複雜度是O(1)

### CRUD Operations
#### Create
Scenario 1: 數組末尾追加(append)元素
- 比方說，我有一個大小為10的數組，裡面裝了4個元素，現在想在末尾追加一個元素，那麼直接assign value在對應的索引就可以了。

Scenario 2: 數組中間insert元素
- Data Shifting: 給新元素騰出空位，然後才能插入新元素

Scenario 3: 數組空間已滿
- 由於連續內存必須一次性分配，分配完了之後就不能隨意增減了。因為你這個block後面的內存可能已經被其他程序佔用了。
- 只能重新申請一塊更大的內存，把原來的數據復制過去，再插入新的元素。

#### Delete
Scenario 1:
- 直接把last element標記為一個特別的數值，如: -1。
- delete last element的本質是random access operation，time complexity O(1)
 
Scenario 2:
- Shifting data: 所有在被delete元素後的元素，都要往前移一個位，令數組不斷裂。

Summary
- Addition增
  - Appending an element at the end: O(1)
  - Inserting an element in the middle (not at the end): O(N)
- Deletion刪
  - Removing an element from the end: O(1)
  - Removing an element from the middle (not at the end): O(N)
- Access查: given指定index，查詢index對應的value，Time Complexity: O(1)
- Update改: given指定index，修改index對應的value，Time Complexity: O(1)
- 為什麼array expansion的Time Complexity O(N)沒加到addition中呢？
  - 因為expansion不是每次都會trigger的，所以擴容的complexity要用"Amortized Time Complexity"來分析

## Linked List
Why need linked list?
- 鏈表跟array不一樣，不需要一整塊連續的內存空間存儲元素。元素們可以分佈在內存空間的任何一個地方，可通過節點上的`next`, `prev`指針，將零散的內存塊串聯起來形成鏈式結構。
- Advantage1：提高內存的利用效率，沒有capacity limit(除了fill up了所有memory)
- Advantage2：node可以隨時connect或remove，也不用考慮resizing或移動data
- Limitation1: 不能用index去快速access elements

### Single Linked List
- 


### Double Linked List
- 

