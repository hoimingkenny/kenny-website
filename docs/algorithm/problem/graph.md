# Graph

## Cycle Detection
### LeetCode 207. Course Schedule
#### Idea
    - Check if there is a cyclic dependency
    - If there is a cycle, return false
    - Use DFS

#### Code
```java showLineNumbers
    class Solution {
        boolean[] onPath;
        boolean[] visited;
        boolean hasCycle = false;

        public boolean canFinish(int numCourses, int[][] prerequisites) {
            List<Integer>[] graph = buildGraph(numCourses, prerequisites);

            onPath = new boolean[numCourses];
            visited = new boolean[numCourses];

            for (int i = 0; i < numCourses; i++) {
                // 遍历圖中所有節點
                traverse(graph, i);
            }
            
            // 只要沒有循環依賴 = 可以完成所有course
            return !hasCycle;
        }

        void traverse(List<Integer>[] graph, int s) {
            if (hasCycle) {
                // 如果已經找到環，不用再续遍歷
                return;
            }

            if (onPath[s]) {
                // 如果s已經在path上，證明已成環
                hasCycle = true;
                return;
            }

            if (visited[s]) {
                // 不用再重复遍历已遍历过的节点
                return;
            }

            visited[s] = true;
            onPath[s] = true;
            for (int t : graph[s]) {
                traverse(graph, t);
            }
            onPath[s] = false;
            visited[s] = false;
        }

        List<Integer>[] buildGraph(int numCourses, int[][] prerequisites) {
            // course in numCourses are unique
            List<Integer>[] graph = new LinkedList[numCourses];
            for (int i = 0; i < numCourses; i++) {
                graph[i] = new LinkedList<>();
            }

            for (int[] edge: prerequisites) {
                graph[edge[0]].add(edge[1]);
            }

            return graph;
        }
    }
```

## Topological Sorting Algorithm