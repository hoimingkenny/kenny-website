# Binary Tree (Decomposition)

## LeetCode 105. Construct Binary Tree from Preorder and Inorder Traversal
### Idea

### Code
```java showLineNumbers
class Solution {
    HashMap<Integer, Integer> valToIndex = new HashMap<>();

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        // for getting the index of the root in inorder, O(1)
        for (int i = 0; i < inorder.length; i++) {
            valToIndex.put(inorder[i], i);
        }

        TreeNode root = build(preorder, 0, preorder.length - 1, inorder, 0, inorder.length - 1);

        return root;
    }

    TreeNode build(int[] preorder, int startPre, int endPre,
                        int[] inorder, int startIn, int endIn) {
        if (startPre > endPre) {
            return null;
        }

        int rootVal = preorder[startPre];
        int rootIdx = valToIndex.get(rootVal);

        // construct self
        TreeNode root = new TreeNode(rootVal);

        // construct left
        int leftSize = rootIdx - startIn;
        root.left = build(preorder, startPre + 1, startPre + leftSize, 
                        inorder, startIn, rootIdx - 1);

        // construct right
        root.right = build(preorder, startPre + leftSize + 1, endPre, 
                        inorder, rootIdx + 1, endIn);

        return root;
    }
}
```

## LeetCode 100. Same Tree (Easy)
### Idea
- 判斷2 trees是否相同，可以分解為判斷root是否相同，然後判斷左子樹和右子樹是否相同

### Code
```java showLineNumbers
    class Solution {
        // 定义：输入两个根节点，返回以它们为根的两棵二叉树是否相同
        public boolean isSameTree(TreeNode p, TreeNode q) {
            // 判断一对节点是否相同
            if (p == null && q == null) {
                return true;
            }
            if (p == null || q == null) {
                return false;
            }
            if (p.val != q.val) {
                return false;
            }
            // 判断其他节点是否相同
            return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
        }
    }
```

## LeetCode 951. Flip Equivalent Binary Trees
### Idea
- Two trees are flip equivalent if its node can be made identical by performing any number of left-right child swaps at any nodes
- No flip + Flip


### Code
```java showLineNumbers
    class Solution {
        public boolean flipEquiv(TreeNode root1, TreeNode root2) {
            // 判断 root1 和 root2 两个节点是否能够匹配
            if (root1 == null && root2 == null) {
                return true;
            }
            if (root1 == null || root2 == null) {
                return false;
            }
            if (root1.val != root2.val) {
                return false;
            }
            // 根据函数定义，判断子树是否能够匹配
            // 不翻转、翻转两种情况满足一种即可算是匹配
            return (
                    // No-flip
                    flipEquiv(root1.left, root2.left) && flipEquiv(root1.right, root2.right)
            ) || (
                    // Flip
                    flipEquiv(root1.left, root2.right) && flipEquiv(root1.right, root2.left)
            );
        }ß
    }
```



