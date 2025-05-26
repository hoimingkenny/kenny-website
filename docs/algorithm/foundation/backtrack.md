# Backtrack Algorithm

## Concept
```java showlinenumbers
    for option in options:
        // make a choice
        remove option from options
        route.add(option)

        // recusion
        backtrack(options, route)

        // undo choice
        route.remove(option)
        options.add(option)
```

## Permutation
### LeedCode 46. Permutations
#### Idea
- ![](https://labuladong.online/algo/images/backtracking/3.jpg)

#### Code
```java showlinenumbers
    class Solution {
        List<List<Integer>> res = new LinkedList<>();

        public List<List<Integer>> permute(int[] nums) {
            LinkedList<Integer> track = new LinkedList<>();
            boolean[] used = new boolean[nums.length];

            backtrack(nums, track, used);
            return res;
        }

        void backtrack(int[] nums, LinkedList<Integer> track, boolean[] used) {
            if (track.size() == nums.length) {
                res.add(new LinkedList(track));
                return;
            }

            for (int i = 0; i < nums.length; i++) {
                if (used[i]) {
                    continue;
                }

                track.add(nums[i]);
                used[i] = true;

                backtrack(nums, track, used);

                used[i] = false;
                track.removeLast();
            }
        }
    }
```

## Subset
### LeetCode 39. Combination Sum
```java showlinenumbers
public List<List<Integer>> combinationSum(int[] candidates, int target) {}



```

