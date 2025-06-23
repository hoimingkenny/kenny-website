# nth Sum

## I. twoSum
### Multiple Pairs
- Return all pairs of element that sum up to target
- e.g. `nums = [1, 3, 1, 2, 2, 3], target = 4`
    - Ans: `[[1, 3], [2, 2]]`
    - `[1, 3]` and `[3, 1]` are the same pair

```java
    List<List<Integer>> twoSumTarget(int[] nums, int target) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int sum = nums[lo] + nums[hi];
            // 根据 sum 和 target 的比较，移动左右指针
            if (sum < target) {
                lo++;
            } else if (sum > target) {
                hi--;
            } else {
                res.add(Arrays.asList(nums[lo], nums[hi]));
                lo++;
                hi--;
            }
        }
        return res;
    }
```
- The problem is that we will have duplicate pairs, e.g. `nums = [1, 1, 1, 2, 2, 3, 3]`. The `[1, 3]` pairs are duplicated
- The solution is to skip the duplicate numbers when we find the target
![](https://labuladong.online/algo/images/nSum/1.jpeg)

```java
    // ...
    while (lo < hi) {
        int sum = nums[lo] + nums[hi];
        // 记录索引 lo 和 hi 最初对应的值
        int left = nums[lo], right = nums[hi];
        if (sum < target) {
            lo++;   
        } else if (sum > target) {
            hi--;
        } else {
            res.add(new ArrayList<>(Arrays.asList(left, right)));
            // 跳过所有重复的元素
            while (lo < hi && nums[lo] == left) lo++;
            while (lo < hi && nums[hi] == right) hi--;
        }
    }
    // ...
```

## II. threeSum
### Idea
    - 第一個數字，`nums`中每一個元素
    - 確定了第一個數字後，我們要找兩個數字，使得它们的和为 target - nums[i]，用2Sum 解決


## Reference
- https://labuladong.online/algo/practice-in-action/nsum/#%E4%BA%8C%E3%80%813sum-%E9%97%AE%E9%A2%98