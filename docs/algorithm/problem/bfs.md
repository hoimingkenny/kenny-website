# BFS

## LeetCode 773. Sliding Puzzle
### Idea
    - ![](https://labuladong.online/algo/images/sliding_puzzle/3.jpeg)
        - Use BFS
    - ![](https://labuladong.online/algo/images/sliding_puzzle/4.jpeg)
        ```java showLineNumbers
             int[][] neighbor = new int[][]{
                {1, 3},
                {0, 4, 2},
                {1, 5},
                {0, 4},
                {3, 1, 5},
                {4, 2}
            };
        ```
        - `index = 0`: the top-left cell, its neighbor cells are `index 1` and `index 3`
        - e.g: the neighbor of element 2 are element 4 and 5
        - The neighbor of [[2,4,1],[5,0,3]] are [[2,0,1],[5,4,3]](Index 1), [[2,4,1],[0,5,3]](Index 3), [[2,4,1],[5,3,0]](Index 5) 

### Code
```java showLineNumbers
    class Solution {
        public int slidingPuzzle(int[][] board) {
            String target = "123450";
            // 将 2x3 的数组转化成字符串作为 BFS 的起点
            String start = "";
            for (int i = 0; i < board.length; i++) {
                for (int j = 0; j < board[0].length; j++) {
                    start = start + board[i][j];
                }
            }

            // ****** BFS 算法框架开始 ******
            Queue<String> q = new LinkedList<>();
            HashSet<String> visited = new HashSet<>();
            // 从起点开始 BFS 搜索
            q.offer(start);
            visited.add(start);

            int step = 0;
            while (!q.isEmpty()) {
                int sz = q.size();
                for (int i = 0; i < sz; i++) {
                    String cur = q.poll();
                    
                    // check equal target?
                    if (target.equals(cur)) {
                        return step;
                    }
                    // 将数字 0 和相邻的数字交换位置
                    for (String neighborBoard : getNeighbors(cur)) {
                        // 防止走回头路
                        if (!visited.contains(neighborBoard)) {
                            q.offer(neighborBoard);
                            visited.add(neighborBoard);
                        }
                    }
                }
                step++;
            }
            // ****** BFS 算法框架结束 ******
            return -1;
        }

        private List<String> getNeighbors(String board) {
            // 记录一维字符串的相邻索引 (see above explaination in Idea)
            int[][] mapping = new int[][]{
                    {1, 3},
                    {0, 4, 2},
                    {1, 5},
                    {0, 4},
                    {3, 1, 5},
                    {4, 2}
            };

            int idx = board.indexOf('0');
            List<String> neighbors = new ArrayList<>();
            for (int adj : mapping[idx]) {
                String new_board = swap(board.toCharArray(), adj, idx);
                neighbors.add(new_board);
            }
            return neighbors;
        }

        private String swap(char[] chars, int i, int j) {
            char temp = chars[i];
            chars[i] = chars[j];
            chars[j] = temp;
            return new String(chars);
        }
    }
```