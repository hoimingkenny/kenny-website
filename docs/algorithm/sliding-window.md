# Sliding Window

## Why sliding window cannot list out all subarries?
- 本身是不能窮舉所有sub arraries
- 不需要窮舉就可以找到答案

add ## Template
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
1. 什麼時侯應該move right去擴大窗口，窗口加入字符时，应该更新哪些数据？
2. 什么时候窗口应该暂停扩大，开始移动 left 缩小窗口？从窗口移出字符时，应该更新哪些数据？
3. 什么时候应该更新结果？

## Step
1. `[left, right)`:
- if `left = right = 0`, 區間`[0, 0)`中沒有元素，但只要right向右移一位，區間`[0, 1)`就有一個element了
2. Increase right until the elements in windows include what in T
3. Step inceasing right, instead, reducing left
4. repeating step 2 and 3, until right reach the end of S string

- 第二步: 尋找可行解
- 第三步: 優化


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

