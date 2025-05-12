# Tree

## Binary Tree
### Common Types of Binary Tree
1. Full Binary Tree
    - Assuming the depth is `h`, the total number of nodes is `2^h - 1`
    - 
2. Complete Binary Tree
3. Perfect Binary Tree
4. Binary Search Tree
5. Perfect Binary Tree (BST)
6. Height-Balanced Binary Tree
    - Height difference between the left and right subtrees of every node is no more than 1
7. Self-Balancing Binary Tree
    - Assuming there are N nodes in the balanced binary tree, the height of the tree is `O(logN)`

### Recursive Traversal (DFS)
- Code Template
```java
    // basic binary tree node
    class TreeNode {
    int val;
        TreeNode left, right;
    }

    // recursive traversal framework for binary tree
    void traverse(TreeNode root) {
        if (root == null) {
            return;
        }
        traverse(root.left);
        traverse(root.right);
    }
```

#### Understanding Pre-order, In-order, and Post-order Traversal
:::note Important
    The effect can differ depending on where you place the code within the `traverse` function
:::

```java
void traverse(TreeNode root) {
    if (root == null) {
        return;
    }
    // pre-order position
    traverse(root.left);
    // in-order position
    traverse(root.right);
    // post-order position
}
```

### Level Order Traversal (BFS)
- Level-order traversal visits nodes of a binary tree level by level, processing all nodes at the current depth (distance from the root) before moving to nodes at the next depth. Within each level, nodes are visited from left to right
- Require the use of a queue data structure

## N-ary Tree
- Extension of binary tree
```java
    // 二叉树的遍历框架
    void traverse(TreeNode root) {
        if (root == null) {
            return;
        }
        // 前序位置
        traverse(root.left);
        // 中序位置
        traverse(root.right);
        // 后序位置
    }

    // N 叉树的遍历框架
    void traverse(Node root) {
        if (root == null) {
            return;
        }
        // 前序位置
        for (Node child : root.children) {
            traverse(child);
        }
        // 后序位置
    }
```


## Reference
1. https://labuladong.online/algo/en/data-structure-basic/binary-tree-traverse-basic/#method-three