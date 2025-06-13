# Graph

## Structure
- Extension of nth Tree
- Made of `Vertex` and `Edge`
- ![](https://labuladong.online/algo/images/graph/0.jpg)

### Tree vs Graph
``` java showLineNumbers
    // Graph
    class Vertex {
        int id;
        Vertex[] neighbors;
    }
    // 鄰接表
    // graph[x] store all neighbors of x
    List<Integer>[] graph
    // Matrix
    // use martix[x][y] to record if x has edge to y
    boolean[][] matrix;


    // N-Tree
    class TreeNode {
        int val;
        TreeNode[] children;
    }
```

### Graph Template
``` java showLineNumbers
    interface Graph {
        // 添加一条边（带权重）
        void addEdge(int from, int to, int weight);

        // 删除一条边
        void removeEdge(int from, int to);

        // 判断两个节点是否相邻
        boolean hasEdge(int from, int to);

        // 返回一条边的权重
        int weight(int from, int to);

        // 返回某个节点的所有邻居节点和对应权重
        List<Edge> neighbors(int v);

        // 返回节点总数
        int size();
    }
```

### DFS
:::important
    - Tree不存在ring，而graph可能存在ring，所以要避免死循環
    - 遍历图的所有「节点」时，需要 visited 数组在前序位置标记节点
    - 遍历图的所有「路径」时，需要 onPath 数组在前序位置标记节点，在后序位置撤销标记
:::

#### `visited`: Iterate all nodes
```java showLineNumbers title="Graph Find Path"
    void traverse(Vertex s, boolean[] visited) {
        if (s == null) {
            return;
        }
        if (visited[s.id]) {
            return;
        }

        // 前序位置
        visited[s.id] = true;
        System.out.println("visit " + s.id);
        for (Vertex neighbor : s.neighbors) {
            traverse(neighbor, visited);
        }
    }
```

```java showLineNumbers title="Tree Find Path"
    void traverse(Node root) {
        // base case
        if (root == null) {
            return;
        }
        // 前序位置
        System.out.println("visit " + root.val);
        for (Node child : root.children) {
            traverse(child);
        }
        // 后序位置
    }
```

#### `onPath`: Iterate all paths
```java showLineNumbers title="n-Tree Find Path"
    // n-Tree
    LinkedList<Node> path = new LinkedList<>();
    void traverse(Node root, Node targetNode) {
        if (root == null) {
            return;
        }

        path.addLast(root);
        if (root.val == targetNode.val) {
            System.out.println("find path: " + path);
        }
        for (Node child : root.children) {
            traverse(child, targetNode);
        }
        // 后序位置
        path.removeLast();
    }
```
```java showLineNumbers title="Graph Find Path"
    boolean[] onPath = new boolean[graph.size()];
    List<Integer> path = new LinkedList<>();

    void traverse(Graph graph, int src, int dest) {
        // base case
        if (src < 0 || src >= graph.size()) {
            return;
        }
        if (onPath[src]) {
            // 防止死循环（成环）
            return;
        }
        // 前序位置
        onPath[src] = true;
        path.add(src);
        if (src == dest) {
            System.out.println("find path: " + path);
        }
        for (Edge e : graph.neighbors(src)) {
            traverse(graph, e.to, dest);
        }
        // 后序位置
        path.remove(path.size() - 1);
        onPath[src] = false;
    }
```
