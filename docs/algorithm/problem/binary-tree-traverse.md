# Binary Tree (Traverse)

## LeetCode 257. Binary Tree Paths (Easy)
### Idea
- Traverse the tree  and record the path when reaching a leaf node

### Code
``` java showLineNumbers
    class Solution {
        LinkedList<String> res = new LinkedList<>();

        // record the path of traverse
        LinkedList<String> path = new LinkedList<>();

        public List<String> binaryTreePaths(TreeNode root) {
            traverse(root);
            return res;
        }

        void traverse(TreeNode root) {
            if (root == null) return;

            path.addLast(root.val + ""); // "" is for turning into String
            // termination, if reach leaf node
            if (root.left == null && root.right == null) {
                // 将这条路径装入 res
                res.addLast(String.join("->", path));
                path.removeLast();
                return;
            }

            traverse(root.left);
            traverse(root.right);
            path.removeLast();
        }
    }
```

## LeetCode 129.  Sum Root to Leaf Numbers
### Idea
- Traverse the tree and record the path when reaching a leaf node and do calculation

### Code
```java showLineNumbers
    class Solution {
        int sum = 0;

        StringBuilder path = new StringBuilder();

        public int sumNumbers(TreeNode root) {
            traverse(root);
            return sum;
        }

        void traverse(TreeNode root) {
            if (root == null) return;

            path.append(root.val);
            if (root.left == null && root.right == null) {
                sum += Integer.parseInt(path.toString());
                path.deleteCharAt(path.length() - 1);
                return;
            }
            
            traverse(root.left);
            traverse(root.right);
            path.deleteCharAt(path.length() - 1);
        }
    }
```

## LeetCode 199. Binary Tree Right Side View
### Idea
- 可用BFS做法，但這就不寫了，以下會用traverse的做法
- 先traverse Right再traverse Left

### Code
```java showLineNumbers
    class Solution {
        int depth = 1;
        List<Integer> res = new ArrayList<>();

        public List<Integer> rightSideView(TreeNode root) {
            traverse(root);
            return res;
        }

        void traverse(TreeNode root) {
            if (root == null) return;

            if (res.size() < depth) {
                res.add(root.val);
            }

            depth++;
            traverse(root.right);
            traverse(root.left);
            depth--;
        }
    }
```

## LeetCode 988. Smallest String Starting From Leaf
### Idea
- 用`path`來存從root到leaf的路徑
- 到達leaf時，將`path`轉成String，再反轉成String，並與`res`比較，取較小的

### Code
```java showLineNumbers
    class Solution {
        public String smallestFromLeaf(TreeNode root) {
            traverse(root);
            return res;
        }
        // 遍历过程中的路径
        StringBuilder path = new StringBuilder();
        String res = null;

        // 二叉树遍历函数
        void traverse(TreeNode root) {
            if (root == null) {
                return;
            }
            if (root.left == null && root.right == null) {
                // 找到叶子结点，比较字典序最小的路径
                // 结果字符串是从叶子向根，所以需要反转
                path.append((char) ('a' + root.val));
                path.reverse();

                String s = path.toString();
                if (res == null || res.compareTo(s) > 0) {
                    // 如果字典序更小，则更新 res
                    res = s;
                }

                // 恢复，正确维护 path 中的元素
                path.reverse();
                path.deleteCharAt(path.length() - 1);
                return;
            }
            // 前序位置
            path.append((char) ('a' + root.val));

            traverse(root.left);
            traverse(root.right);

            // 后序位置
            path.deleteCharAt(path.length() - 1);
        }
    } 
```