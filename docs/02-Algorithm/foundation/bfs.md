# BFS

## Introduction
- DFS/Backtracking/BFS in essence is to abstract the problem into a tree or graph then using brute-force to find the solution.
- DFS/Backtracking: recursively traverse a N tree, which is derived from the recursive traversal of binary tree
- BFS: is to traverse a graph
- Graph traversal algorithm: is multi-way tree traversal algorithms with an added `visisted` array to prevent infinite loops
- BFS很適合解決最短路徑的問題，等於二叉树最小深度. Recursive traversal requires visiting all nodes of the the tree to find the target node, whereas level-order traversal can achieve this without visiting all nodes
