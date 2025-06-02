# BST

## LeetCode 98. Validate Binary Search Tree
### Idea
    - In each node, check max.val > root.val > min.val;

```java showLineNumbers
    public boolean isValidBST(TreeNode root) {
        return _isValidBST(root, null, null);
    }

    // 定义：该函数返回 root 为根的子树的所有节点是否满足 max.val > root.val > min.val
    public boolean _isValidBST(TreeNode root, TreeNode min, TreeNode max) {
        // base case
        if (root == null) return true;
        // 若 root.val 不符合 max 和 min 的限制，说明不是合法 BST
        if (min != null && root.val <= min.val) return false;
        if (max != null && root.val >= max.val) return false;
        // 根据定义，限定左子树的最大值是 root.val，右子树的最小值是 root.val
        return _isValidBST(root.left, min, root) 
            && _isValidBST(root.right, root, max);
    }
```

## LeetCode 235. Lowest Common Ancestor of a Binary Search Tree
### Idea
    - Similar to LeetCode 236 
    - 需要用到bst的左小右大
    - Assume `val1 < val2`, If `val1 <= root.val <= val2`，则 root 就是LCA
    - If `root.val < val`, go find in right subtree
    - If `root.val > val`, go find in left subtree

### Code
    ```java showLineNumbers
        public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
            // 保证 val1 较小，val2 较大
            int val1 = Math.min(p.val, q.val);
            int val2 = Math.max(p.val, q.val);
            return find(root, val1, val2);
        }

        TreeNode find(TreeNode root, int val1, int val2) {
            if (root == null) {
                return null;
            }
            if (root.val > val2) {
                // 当前节点太大，去左子树找
                return find(root.left, val1, val2);
            }
            if (root.val < val1) {
                // 当前节点太小，去右子树找
                return find(root.right, val1, val2);
            }
            // val1 <= root.val <= val2
            // 则当前节点就是最近公共祖先
            return root;
        }
    ```

## LeetCode 230. Kth Smallest Element in a BST
### Idea
－ In-order traversal of BST = node value in ascending order

     3
    / \
    2   4
   /
  1   


  7, 9 , 4 10

