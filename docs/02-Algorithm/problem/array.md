# Array

## LeetCode 303. Range Sum Query - Immutable
### Idea
    - ![](https://labuladong.online/algo/images/difference/1.jpeg)
### Code
    ```java showLineNumbers
        class NumArray {
            // 前缀和数组
            private int[] preSum;

            // 输入一个数组，构造前缀和
            public NumArray(int[] nums) {
                // preSum[0] = 0，便于计算累加和
                preSum = new int[nums.length + 1];
                // 计算 nums 的累加和
                for (int i = 1; i < preSum.length; i++) {
                    preSum[i] = preSum[i - 1] + nums[i - 1];
                }
            }

            // 查询闭区间 [left, right] 的累加和
            public int sumRange(int left, int right) {
                return preSum[right + 1] - preSum[left];
            }
        }
    ```
    - preSum's complexity: O(N)
    - sumRange's complexity: O(1)

## LeetCode 238. Product of Array Except Self
### Code
    ```java showLineNumbers
        public int[] productExceptSelf(int[] nums) {
            int n = nums.length;
            // 从左到右的前缀积，prefix[i] 是 nums[0..i] 的元素积
            int[] prefix = new int[n];
            prefix[0] = nums[0];
            for (int i = 1; i < nums.length; i++) {
                prefix[i] = prefix[i - 1] * nums[i];
            }
            // 从右到左的前缀积，suffix[i] 是 nums[i..n-1] 的元素积
            int[] suffix = new int[n];
            suffix[n - 1] = nums[n - 1];
            for (int i = n - 2; i >= 0; i--) {
                suffix[i] = suffix[i + 1] * nums[i];
            }
            int[] res = new int[n];
            res[0] = suffix[1];
            res[n - 1] = prefix[n - 2];
            for (int i = 1; i < n - 1; i++) {
                // 除了 nums[i] 自己的元素积就是 nums[i] 左侧和右侧所有元素之积
                res[i] = prefix[i - 1] * suffix[i + 1];
            }
            return res;
        }
    ```

