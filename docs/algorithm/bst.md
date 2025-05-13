# Binary Search Tree

## Advantage of BST
- For each node in the tree, the value of every node in its left subtree must be smaller than the value of this node, and the value of every node in its right subtree must be larger than the value of this node



利用bst左小右大的特性，可以迅速定位到目标节点，理想的时间复杂度是树的高度 
O(logN)，而普通的二叉树遍历函数则需要O(N) 的时间遍历所有节点。

## TreeMap/TreeSet Implementation
HashMap底層把KV pair放在一個table array
而treemap的底層是把KV pair放在一棵bst中

TreeSet和TreeMap的關係正如 HashMap和HashMap的關係
TreeSet是TreeMap的封裝

## TreeMap API
`firstKey`: find the smallest key
`lastKey`: find the largest key
`floorKey`: find the largest key that is smaller than or equal to the given key
`ceilingKey`: find the smallest key that is larger than or equal to the given key

`keys`: return a set of keys in order
`selectKey`: return the key at the given index
`rank`: return the index of the given key

