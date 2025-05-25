# Two-Pointer (Array)

## Introduction
- 左右指針和快慢指針

### In-Place
#### LeetCode 26. Remove Duplicates from Sorted Array 
    - Slow pointer: track the position where the next unique element should be placed
    - Fast pointer: scan the array and find unique elements
    - When a unique element is found, copy it to the slow position and increment slow
    ```java showLineNumbers
        public int removeDuplicates(int[] nums) {
            if (nums.length == 0) {
                return 0;
            }
            int slow = 0, fast = 0;
            while (fast < nums.length) {
                if (nums[fast] != nums[slow]) {
                    slow++;
                    // 维护 nums[0..slow] 无重复
                    nums[slow] = nums[fast];
                }
                fast++;
            }
            // 数组长度为索引 + 1
            return slow + 1;
        }
    ```

#### LeetCode 83. Remove Duplicates from Sorted List

#### LeetCode 27. Remove Element
    - Remove in place!
    ```java showLineNumbers
        public int removeElement(int[] nums, int val) {
            int fast = 0, slow = 0;
            while (fast < nums.length) {
                if (nums[fast] != val) {
                    nums[slow] = nums[fast];
                    slow++;
                }
                fast++;
            }
            return slow;
        }
    ```

#### LeetCode 283. Move Zeroes

#### LeetCode 167. Two Sum II - Input Array Is Sorted
    - **exactly one solution**, exactly one pair `(i, j)` where `numbers[i] + numbers[j] = target` and `i < j`
    ```java showLineNumbers
        public int[] twoSum(int[] numbers, int target) {
            int left = 0, right = numbers.length - 1;
            while (left < right) {
                int sum = numbers[left] + numbers[right];
                if (sum == target) {
                    return new int[]{left + 1, right + 1};
                } else if (sum < target) {
                    left++;
                } else if (sum > target) {
                    right--
                }
            }
            return new int[]{-1, -1};
        }
    ```
    - Termination Condition: `left = right`


### Palindrome
#### LeetCode 5. Longest Palindromic Substring
    - 回文串： 正著讀和反著讀都一樣的string, e.g. "abba" and "aba"

    :::important
        - 如果回文串的長度係odd number, 有一個中心字符
        - 如果回文串的長度係even number, 兩個中心字符
        - Main Function: longestPalindrome
            - Iterate through each index `i` in the string
            - For each `i`:
                - **Check for an odd-length palindrome centered at `s[i]`**
                - **Check for an even-length palindrome centered at `s[i]` and `s[i+1]`**
    :::
    
    - Helper Function: palindrome
        - Expands around a given center (`l`, `r`) to find the longest palindrome
        - Return the palindrome substring
    - `s.substring(start, end)` includes `start` to `end-1`
    - "babad", if index = 0, only return b,
        - if index = 4, only return d

    ```java
        public String longestPalindrome(String s) {
            String res = ""; // Store the longest palindrome found
            for (int i = 0; i < s.length(); i++) {
                // Odd-length palindrome centered at s[i]
                String s1 = palindrome(s, i, i);
                // Even-length palindrome centered between s[i] and s[i+1]
                String s2 = palindrome(s, i, i + 1);
                // Update res to the longest of res, s1, s2
                res = res.length() > s1.length() ? res : s1;
                res = res.length() > s2.length() ? res : s2;
            }
            return res;
        }

        // Expand around center (l, r) to find palindrome
        String palindrome(String s, int l, int r) {
            // Expand while within bounds and characters match
            while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
                l--; // Move left
                r++; // Move right
            }
            // Return substring from l+1 to r-1 (last valid palindrome)
            return s.substring(l + 1, r);
        }
    ```


## Reference
- https://labuladong.online/algo/essential-technique/array-two-pointers-summary/