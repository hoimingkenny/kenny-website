# Sliding Window

## Ask Yourself
1. When to expand window? When insert element into window, what data should be updated?
2. When to shrink window? When remove element from window, what data should be updated?
3. When to update result?


### Why sliding window cannot list out all subarries?
- 本身是不能窮舉所有sub arraries
- 不需要窮舉就可以找到答案

### Template
```java showlinenumbers
    void slidingWindow(String s) {
        Object window = ...

        int left = 0; right = 0;
        while (right < s.length()) {
            char c = s[right];
            window.add(c);
            right ++
            ...

            while (left < right && window needs shrink) {
                char d = s[left];
                window.remove(d);
                left++;
            }
        }
    }
```
- Is O(N), because 每個元素只會進入窗口一次，然後被移出一次

### Step
1. `[left, right)`:
- if `left = right = 0`, 區間`[0, 0)`中沒有元素，但只要right向右移一位，區間`[0, 1)`就有一個element了
2. Increase right until the elements in windows include what in T
3. Step inceasing right, instead, reducing left
4. repeating step 2 and 3, until right reach the end of S string

- 第二步: 尋找可行解
- 第三步: 優化

### LeetCode 76. Minimum Window Substring
- q1： 當window不包含abc
- q2: 當window包含abc，可以嘗試減少window的元素
```java
    public String minWindow(String s, String t) {
        HashMap<Character, Integer> window = new HashMap<>();
        HaspMap<Character, Integer> need = new HashMap<>();
        for (int i = 0; i < t.length(); i++) {
            char c = t.charAt(i);
            need.put(c, need.getOrDefault(c, 0) + 1);
        }

        int left = 0, right = 0;
        int valid = 0;
        int start = 0, len = Integer.MAX_VALUE;
        while (right < s.length()) {
            char c = s.charAt(right);
            right++;
            
            // 當某個char在window中滿足need時，就要更新valid
            if (need.containsKey(c)) {
                window.put(c, window.getOrDefault(c, 0) + 1);
                if (window.get(c).equals(need.get(c)))
                    valid++;
            }

            
            while (valid == need.size()) {
                if (right - left < len) {
                    start = left;
                    len = right - left;
                }

                char d = s.charAt(left);
                left++;

                if (need.containsKey(d)) {
                    if (window.get(d).equals(need.get(d)))
                        valid--;
                    window.put(d, window.get(d) - 1);
                }
            }
        }
        return len == Integer.MAX_VALUE ? "" : s.substring(start, start + len);
    }
```

### LeetCode 567. Permutation in String
    ```java
        public boolean checkInclusion(String s1, String s2) {
            Map<Character, Integer> need = new HashMap<>();
            Map<Character, Integer> window = new HashMap<>();
            for (char c: s1.toCharArray()) need.put(c, need.getOrDefault(c, 0) + 1);

            int left = 0, right = 0;
            int valid = 0;
            while (right < s2.length()) {
                char c = s2.charAt(right);
                right++;

                if (need.containsKey(c)) {
                    window.put(c, window.getOrDefault(c, 0) + 1);
                    if (window.get(c).equals(need.get(c)))
                        valid++;
                }

                while (right - left >= s1.length()) {
                    if (valid == need.size())
                        return true;
                    char d = s2.charAt(left);
                    left++;

                    if (need.containsKey(d)) {
                        if (window.get(d).equals(need.get(d)))
                            valid--;
                        window.put(d, window.get(d) - 1);
                    }
                }
                return false;               
            }
        }
    ```
    - Maintain fixed size window, size as `t.length()`

### LeetCode 438. Find All Anagrams in a String (Medium)
    ```java
        public List<Integer> findAnagrams(String s, String t) {
            List<Integer> res = new ArrayList<>();

            Map<Character, Integer> window = new HashMap<>();
            Map<Character, Integer> need = new HashMap<>();
            for (char c : p.toCharArray()) {
                need.put(c, need.getOrDefault(c, 0) + 1);
            }

            int valid = 0;
            int left = 0, right = 0;
            while (right < s.length()) {
                char c = s.charAt(right);
                right++;

                if (need.containsKey(c)) {
                    window.put(c, window.getOrDefault(c, 0) + 1);

                    if (window.get(c).equals(need.get(c))) {
                        valid++;
                    }
                }
                while (right - left >= t.length()) {
                    // 当窗口符合条件时，把起始索引加入 res
                    if (valid == need.size()) {
                        res.add(left);
                    }
                    char d = s.charAt(left);
                    left++;
                    // 进行窗口内数据的一系列更新
                    if (need.containsKey(d)) {
                        if (window.get(d).equals(need.get(d))) {
                            valid--;
                        }
                        window.put(d, window.get(d) - 1);
                    }
                }
        }
    ```

### LeetCode 3. Longest Substring Without Repeating Characters
    ```java
        public int lengthOfLongestSubstring(String s) {
            Map<Character, Integer> window = new HashMap<>();
            
            int left = 0, right = 0;
            // store the result
            int res = 0;

            while (right < s.length()) {
                char c = s.charAt(right);
                right ++;

                // Update the elements in window
                window.put(c, window.getOrDefault(c, 0) + 1);
                
                // Condition to shrink the window: When window contains duplicate elements
                while (window.get(c) > 1) {
                    char d = s.charAt(left);
                    left ++;

                    // Update the elements in window    
                    window.put(d, window.get(d) - 1);
                }

                res = Math.max(res, right - left);
            }
            return res;
        }
    ```
    - Condition to shrink the window: When window contains duplicate elements
    - why return `right - left`? because of right++

### LeetCode 1658. Minimum Operations to Reduce X to Zero
    - 從邊界del sum為x的元素
    - 剩下來的是`nums`中的subarray
    - 題目＝要我們搵the longest `sum(nums) - x` 的subarray （minimum operation = remove既元素最少 ＝ 剩下的元素最多） 

    ```java
        public int minOperations(int[] nums, int x) {
            int n = nums.length, sum = 0;
            for (int i = 0; i < n; i++) {
                sum += nums[i];
            }

            int target = sum - x;

            int left = 0, right = 0;
            int windowSum = 0;
            int maxLen = Integer.MIN_VALUE;

            while (right < n) {
                windowSum += nums[right];
                right++;

                while (windowSum > target && left < right) {
                    windowSum -= nums[left];
                    left++;
                }

                if (windowSum == target) {
                    maxLen = Math.max(maxLen, right - left);
                }
            }
            return maxLen == Integer.MIN_VALUE ? -1 : n - maxLen;
        }
    ```


### LeetCode 713. Subarray Product Less Than K
    ```java
        Q1: when the product of subarray is < k
        Q2: when the product of subarray is >= k
        Q3: when the product of subarray is < k, the element in the window is the answer
    ```

    ```java
        public int numSubarrayProductLessThanK(int[] nums, int k) {
            int left = 0, right = 0;
            int windowProduct = 1;
            // 记录符合条件的子数组个数
            int count = 0;

            while (right < nums.length) {
                windowProduct = windowProduct * nums[right];
                right++;

                while (left < right && windowProduct >= k) {
                    windowProduct = windowProduct / nums[left];
                    left++;
                }
                // 现在必然是一个合法的窗口，但注意思考这个窗口中的子数组个数怎么计算：
                // 比方说 left = 1, right = 4 划定了 [1, 2, 3] 这个窗口（right 是开区间）
                // 但不止 [left..right] 是合法的子数组，[left+1..right], [left+2..right] 等都是合法子数组
                // 所以我们需要把 [3], [2,3], [1,2,3] 这 right - left 个子数组都加上
                count += right - left;
            }

            return count;
        }
    ```