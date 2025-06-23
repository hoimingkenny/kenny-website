# Palindrome Linked List

## LeetCode 234. Palindrome Linked List
    - Recurrsion: Linked List
        ```java
            // 二叉树遍历框架
            void traverse(TreeNode root) {
                // 前序遍历代码
                traverse(root.left);
                // 中序遍历代码
                traverse(root.right);
                // 后序遍历代码
            }

            // 递归遍历单链表
            void traverse(ListNode head) {
                // 前序遍历代码
                traverse(head.next);
                // 后序遍历代码
            }
        ```

