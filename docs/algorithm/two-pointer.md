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

            retirn dummy.next;
    ```




## Reference
- https://labuladong.online/algo/essential-technique/linked-list-skills-summary/