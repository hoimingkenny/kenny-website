# Linked List
Why need linked list?
- 鏈表跟array不一樣，不需要一整塊連續的內存空間存儲元素。元素們可以分佈在內存空間的任何一個地方，可通過節點上的`next`, `prev`指針，將零散的內存塊串聯起來形成鏈式結構。
- Advantage1：提高內存的利用效率，沒有capacity limit(除了fill up了所有memory)
- Advantage2：node可以隨時connect或remove，也不用考慮resizing或移動data
- Limitation1: 不能用index去快速access elements

### Linked List
```java
class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

// 输入一个数组，转换为一条单链表
ListNode createLinkedList(int[] arr) {
    if (arr == null || arr.length == 0) {
        return null;
    }
    ListNode head = new ListNode(arr[0]);
    ListNode cur = head;
    for (int i = 1; i < arr.length; i++) {
        cur.next = new ListNode(arr[i]);
        cur = cur.next;
    }
    return head;
}
```

### Single Linked List
#### Search/Modify
- 只能用for loop由head node開始往後找，直至找到index對應的node
    ```java
        // 创建一条单链表
        ListNode head = createLinkedList(new int[]{1, 2, 3, 4, 5});

        // 遍历单链表
        for (ListNode p = head; p != null; p = p.next) {
            System.out.println(p.val);
        }
    ```

#### Insertion
- Insert a New Element at the Head of the List
    ```java
    // create a singly linked list
    ListNode head = createLinkedList(new int[]{1, 2, 3, 4, 5});

    // insert a new node 0 at the head of the singly linked list
    ListNode newHead = new ListNode(0);
    newHead.next = head;
    head = newHead;
    // now the linked list becomes 0 -> 1 -> 2 -> 3 -> 4 -> 5
    ```

- Insert a New Element at the End of the List
    - 需要transver到last node
    ```java
        // create a singly linked list
        ListNode head = createLinkedList(new int[]{1, 2, 3, 4, 5});

        // insert a new node with value 6 at the end of the linked list
        ListNode p = head;
        // first, go to the last node of the linked list
        while (p.next != null) {
            p = p.next;
        }
        // now p is the last node of the linked list
        // insert a new node after p
        p.next = new ListNode(6);

        // now the linked list becomes 1 -> 2 -> 3 -> 4 -> 5 -> 6
    ```

- Insert a New Element in the Middle of the List
    - 需要找到插入位置的predecessor node
    ```java
        // create a singly linked list
        ListNode head = createLinkedList(new int[]{1, 2, 3, 4, 5});

        // insert a new node 66 after the 3rd node
        // first, find the predecessor node, i.e., the 3rd node
        ListNode p = head;
        for (int i = 0; i < 2; i++) {
            p = p.next;
        }
        // now p points to the 3rd node
        // set the next pointer of the new node
        ListNode newNode = new ListNode(66);
        newNode.next = p.next;

        // insert the new node
        p.next = newNode;

        // now the linked list becomes 1 -> 2 -> 3 -> 66 -> 4 -> 5     
    ```

#### Deletion
- Delete a Node in the List
    - 先找到要刪除的node的前一個node，然後將這個predecessor node的`next`指向被刪除節點的下一個節點
    ```java
        // create a singly linked list
        ListNode head = createLinkedList(new int[]{1, 2, 3, 4, 5});

        // to delete the 4th node, we need to operate on the predecessor node
        ListNode p = head;
        for (int i = 0; i < 2; i++) {
            p = p.next;
        }

        // at this point, p points to the 3rd node, which is the predecessor of the node to be deleted
        // remove the 4th node from the linked list
        p.next = p.next.next;

        // now the linked list becomes 1 -> 2 -> 3 -> 5
    ```

- Delete a Node at the End of the List
    - 要先找到倒數第二個節點，然後把它的`next`指針設為`null`
    ```java
        // 创建一条单链表
        ListNode head = createLinkedList(new int[]{1, 2, 3, 4, 5});

        // 删除尾节点
        ListNode p = head;
        // 找到倒数第二个节点
        while (p.next.next != null) {
            p = p.next;
        }

        // 此时 p 指向倒数第二个节点
        // 把尾节点从链表中摘除
        p.next = null;

        // 现在链表变成了 1 -> 2 -> 3 -> 4
    ```
- Delete a Node from the Head of the List
    - 把`head`移動到下一個node
    ```java
        // 创建一条单链表
        ListNode head = createLinkedList(new int[]{1, 2, 3, 4, 5});

        // 删除头结点
        head = head.next;

        // 现在链表变成了 2 -> 3 -> 4 -> 5
    ```

    - 舊的node1的`next`指針依然指向node2，會做成memory leak嗎？
        - No，node1指向其他nodes是沒有問題的，只要沒有references指向node1，它就可以被garbage collected

### Double Linked List
#### Search/Modify
- For seaching，可以由head node or tail node開始
- 要看index是比較接近head or tail

#### Insertion
- Insert a New Element at the Head of the list
    - Adjust the pointer of the new node and the original head node 
- Insert a New Element at the Tail of the list
- Insert a New Element in the Middle of the list
    - Need to adjust the pointers of the predecessor and successor nodes  
