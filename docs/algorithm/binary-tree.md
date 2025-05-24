# Binary Tree

## DFS
### Template
```java showLineNumbers
    class TreeNode {
        int val;
        TreeNode left, right;
    }

    void traverse(TreeNode root) {
        if (root == null) {
            return;
        }

        // Pre-order
        traverse(root.left);
        // In-order
        traverse(root.right);
        // Post-order
    }
```

### Example
![](https://labuladong.online/algo/images/binary-tree-summary/2.jpeg)
- Pre-order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7
- In-order: 3 -> 2 -> 4 -> 1 -> 7 -> 6 -> 5
- Post-order: 3 -> 4 -> 2 -> 7 -> 6 -> 5 -> 1



## BFS
### Template
```java showLineNumbers
    void levelOrderTraverse(TreeNode root) {
        if (root == null) {
            return;
        }
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int sz = q.size();

            for (int i = 0; i < sz; i++) {
                TreeNode cur = q.poll();
                // 访问 cur 节点
                System.out.println(cur.val);

                // 把 cur 的左右子节点加入队列
                if (cur.left != null) {
                    q.offer(cur.left);
                }
                if (cur.right != null) {
                    q.offer(cur.right);
                }
            }
        }
    }
```
- 把队列中的所有节点都出队，再把当前节点的左右子节点加入队列



## Mindset
:::important
    1. **By Traverse**: Can you obtain the answer by traversing the binary tree once? If so, use a traverse function with external variables to achieve this, which is the "traversal" mindset.
    2. **By Problem Decomposition**: Can you define a recursive function to derive the answer to the original problem from the answers to subproblems (subtrees)? If so, write out the definition of this recursive function and make full use of its return value, which is the "problem decomposition" mindset.

    - Regardless of the mindset used, you need to consider: What does an individual binary tree node need to do? When (pre/in/post-order position) should it do this? You don't need to worry about other nodes; the recursive function will perform the same operations on all nodes.
:::

## LeetCode 226. Invert Binary Tree（Easy)
    - By Traverse
        ```java showLineNumbers
            public TreeNode invertTree(TreeNode root) {
                // Exchange the left and right child of each node
                traverse(root);
                return root;
            }

            void traverse(TreeNode root) {
                if (root == null) {
                    return;
                }

                TreeNode tmp = root.left;
                root.left = root.right;
                root.right = tmp;

                traverse(root.left);
                traverse(root.right);
            }
        ```

    - By Problem Decomposition
        ```java showLineNumbers
            public TreeNode invertTree(TreeNode root) {
                if (root == null) {
                    return null;
                }
                TreeNode left = invertTree(root.left);
                TreeNode right = invertTree(root.right);

                root.left = right;
                root.right = left;

                // 和定义逻辑自恰：以 root 为根的这棵二叉树已经被翻转，返回 root
                return root;
            }
        ```

## LeetCode 116. Populating Next Right Pointers in Each Node
    - ![](https://labuladong.online/algo/images/binary-tree-i/1.png)
    - ![](https://labuladong.online/algo/images/binary-tree-i/3.png)
        ```java showLineNumbers
            public Node connect(Node root) {
                if (root == null) return null;

                traverse(root.left, root.right);
                return root;
            }

            void traverse(Node left, Node right) {
                if (node1 == null || node2 == null) {
                    return;
                }

                node1.next = node2;

                // 连接相同父节点的两个子节点
                traverse(node1.left, node1.right);
                traverse(node2.left, node2.right);
                // 连接跨越父节点的两个子节点
                traverse(node1.right, node2.left);
             }
        ```

## LeetCode 102. Binary Tree Level Order Traversal (Medium)
    - Use BFS template easily solved

### Type: Construct Binary Tree
- Idea: 先找到根节点，然后找到并递归构造左右子树即可。

## LeetCode 654. Maximum Binary Tree (Medium)
    ### Step
        1. Find the `maxVal` in the array
        2. Create a node with `maxVal`
        3. Contruct the left subtree by the array to the left of `maxVal`
        4. Construct the right subtree by the array to the right of `maxVal`

    ### Code
    ```java showLineNumbers
        public TreeNode constructMaximumBinaryTree(int[] nums) {
            return build(nums, 0, nums.length - 1);
        }

        TreeNode build(int[] nums, int left, int right) {
            // base case
            if (left > right) return null;

            // find the maxVal in the array
            int index = -1, maxVal = Integer.MIN_VALUE;
            for (int i = left; i <= right; i++) {
                if (maxVal < nums[i]) {
                    index = i;
                    maxVal = nums[i];
                }
            }

            TreeNode root = new TreeNode(maxVal);
            root.left = build(nums, left, index - 1);
            root.right = build(nums, index + 1, right);

            return root;
        }

    ```


## LeetCode 105. Construct Binary Tree from Preorder and Inorder Traversal (Medium)
    ### Idea
    - ![](https://labuladong.online/algo/images/binary-tree-ii/1.jpeg)
    - ![](https://labuladong.online/algo/images/binary-tree-ii/2.jpeg)
        - root: can be obtained from preorder
        - left/right subtree: can be obtained from inorder
    - ![](https://labuladong.online/algo/images/binary-tree-ii/3.jpeg)
        - 搵left/right subtree的index for 定義inorder 的range
    - ![](https://labuladong.online/algo/images/binary-tree-ii/4.jpeg)
        - 搵left/right subtree的index for 定義opreorder 的range

## LeetCode 110. Balanced Binary Tree (Easy)
    ### Idea
        - For each node:
            1. Recursively checks left and right subtrees
            2. Returns -1 if either subtree is unbalanced
            3. Checks if the height difference between left and right subtrees is > 1
            4. If balanced, returns the height (Math.max(left, right) + 1)

## LeetCode 104. Maximum Depth of Binary Tree (Easy)
    - 