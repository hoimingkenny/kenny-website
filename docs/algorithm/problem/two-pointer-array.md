# Array (Two Pointers)

## LeetCode 83. Remove Duplicates from Sorted List (Easy)
### Idea
- Use fast and slow pointers

### Code
```java showLineNumbers
    public ListNode deleteDuplicates(ListNode head) {
        ListNode slow = head, fast = head;
        ListNode p = head;

        if (head == null) return null;

        while (fast != null) {
            if (fast.val != slow.val) {
                slow.next = fast;
                slow = slow.next;
            }

            fast = fast.next;
        }
        
        slow.next = null;

        return p;
    }
```

## LeetCode 167. Two Sum II - Input Array Is Sorted
### Idea
- Use left and right pointers
- Termination Condition: `left = right`

### Code
#### LeetCode 167. Two Sum II - Input Array Is Sorted
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
    