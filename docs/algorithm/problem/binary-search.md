# Binary Search

## LeetCode 33. Search in Rotated Sorted Array
### Idea
    - ![](https://labuladong.online/algo/images/brief-extra/33_1.jpeg)
    - ![](https://labuladong.online/algo/images/brief-extra/33_2.jpeg)
    1. 判繼mid落左「断崖」左侧还是右侧
    2. 根据 target 和 `nums[left]`, `nums[right]`, `nums[mid]` 的相对大小收缩搜索区间

### Code
    ```java showLineNumbers
        public int search(int[] nums, int target) {
            // 左右都闭的搜索区间
            int left = 0, right = nums.length - 1;
            // 因为是闭区间，所以结束条件为 left > right
            while (left <= right) {
                int mid = left + (right - left) / 2;
                // 首先检查 nums[mid]，是否找到 target
                if (nums[mid] == target) {
                    return mid;
                }
                if (nums[mid] >= nums[left]) {
                    // mid 落在断崖左边
                    if (target >= nums[left] && target < nums[mid]) {
                        // target 落在 [left..mid-1] 中
                        right = mid - 1;
                    } else {
                        // target 落在 [mid+1..right] 中
                        left = mid + 1;
                    }
                } else {
                    // mid 落在断崖右边
                    if (target <= nums[right] && target > nums[mid]) {
                        // target 落在 [mid+1..right] 中
                        left = mid + 1;
                    } else {
                        // target 落在 [left..mid-1] 中
                        right = mid - 1;
                    }
                }
            }
            // while 结束还没找到，说明 target 不存在
            return -1;
        }
    ```


