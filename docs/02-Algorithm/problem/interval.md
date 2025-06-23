# Interval

## Merge Interval
### LeetCode 56. Merge Intervals
#### Idea
    - 將區間排序
#### Code
    ```java showLineNumbers
        public int[][] merge(int[][] intervals) {
            LinkedList<int[]> res = new LinkedList<>();

            Arrays.sort(intervals, (a, b) -> {
                return a[0] - b[0];
            });

            // add the first interval
            res.add(intervals[0]);

            for (int i = 1; i < intervals.length; i++) {
                int[] curr = intervals[i];
                int[] last = res.getLast();

                // e.g. [1,3],[2,6], comparing 2 in index 1 and 3 in index 0
                if (curr[0] <= last[1]) {
                    last[1] = Math.max(last[1], curr[1]);
                } else {
                    // 由於於上一個區間不重疊
                    res.add(curr);
                }
            }

            return res.toArray(new int[0][0]);
        }
    ```

    ## Reference
    - https://labuladong.online/algo/practice-in-action/interval-problem-summary/
