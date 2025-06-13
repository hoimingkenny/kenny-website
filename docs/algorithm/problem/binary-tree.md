# Binary Tree

## LeetCode 236. Lowest Common Ancestor of a Binary Tree（Medium)
### Idea
    - 如果一個節點能夠在它左右子數中分別找到`p` and `q`，該節點為LCA
    - 題目說了`p` & `q`一定存在於樹中，所以遇到`q`可以直接return，根本没遍历到 p，也依然可以断定 p 在 q 底下，q 就是 LCA 节点。
### Code
    ```java
        public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
            return find(root, p.val, q.val);
        }

        // 在二叉树中寻找 val1 和 val2 的最近公共祖先节点
        TreeNode find(TreeNode root, int val1, int val2) {
            if (root == null) {
                return null;
            }
            // 前序位置
            if (root.val == val1 || root.val == val2) {
                // 如果遇到目标值，直接返回
                return root;
            }
            TreeNode left = find(root.left, val1, val2);
            TreeNode right = find(root.right, val1, val2);
            // 后序位置，已经知道左右子树是否存在目标值
            if (left != null && right != null) {
                // 当前节点是 LCA 节点
                return root;
            }
            
            return left != null ? left : right;
        }

    ```


