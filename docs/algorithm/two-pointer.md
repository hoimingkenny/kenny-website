# Two-Pointer

1. LeetCode 21. Merge Two Sorted Lists
    - https://leetcode.com/problems/merge-two-sorted-lists/
    - Use dummy node
    :::note Important
        `dummy` node, no need to handle null pointer
        use when you need to return a new linked list
    :::

    ```java showLineNumbers 
        public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
            ListNode dummy = new ListNode(-1);
            ListNode p = dummy;

            ...

            return dummy.next;
    ```

2. LeetCode 86. Partition List
    - https://leetcode.com/problems/partition-list/
    - Merging two in-ordered linkedlist
    ```java
        public ListNode partition(ListNode head, int x) {
            // to store Node < x
            ListNode dummy1 = new ListNode(-1);
            // to store Node >= x
            ListNode dummy2 = new ListNode(-1);
            
            // p1 and p2 for returning the result
            ListNode p1 = dummy1, p2 = dummy2;
            ListNode p = head;
        
            while (p != null) {
                if (p.val >= x) {
                    p2.next = p;
                    p2 = p2.next;
                } else {
                    p1.next = p;
                    p1 = p1.next;
                }

                // to break up the remaining nodes in p
                ListNode temp = p.next;
                p.next = null;
                p = temp;
            }

            p1.next = dummy2.next;

            return dummy1.next;
        }
    ```
    :::note Important
        要將原linked list的node斷關
    :::



## Reference
- https://labuladong.online/algo/essential-technique/linked-list-skills-summary/