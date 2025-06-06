# LinkedList (Two Pointers)

## LeetCode 264. Ugly Number II
### Idea
- Ugly Number: with prime factors only 2, 3, 5
- Expected linked list: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 8 -> ...
- Think it as linked list
    ```java
    2: 1 -> 1*2 -> 2*2 -> 3*2 -> 4*2 -> 5*2 -> 6*2 -> 8*2 -> ...
    3: 1 -> 1*3 -> 2*3 -> 3*3 -> ...
    5: 1 -> 1*5 -> 2*5 -> 3*5 -> ...
    ```
- 把這3條有序的linked list合併，need to remove duplicated value, e.g. `2*3` and `3*2`

### Code
```java
    public int nthUglyNumber(int n) {
        // pointer to the head of each linked list
        int p2 = 1, p3 = 1, p5 = 1;
        // the value of the head node of each linked list
        int product2 = 1, product3 = 1, product5 = 1;
        // the final merged linked list
        int[] ugly = new int[n + 1];
        // the pointer to the merged linked list
        int p = 1;

        while (p <= n) { 
            int min = Math.min(product2, Math.min(product3, product5));

            // add the result list
            ugly[p] = min;
            p++;

            // if the node is selected from the 2nd list, then move the pointer to the next node in 2nd list
            // if the value of head node of any other list  is equal to the value of the selected node, then move the pointer to the next node in that list

            if (min == product2) {
                product2 = 2 * ugly[p2];
                p2++;
            }
            if (min == product3) {
                product3 = 3 * ugly[p3];
                p3++;
            }
            if (min == product5) {
                product5 = 5 * ugly[p5];
                p5++;
            }
        }

        return ugly[n];
    }
```

## LeetCode 378. Kth Smallest Element in a Sorted Matrix
### Idea
    - ＝ 合并n個有序列表 
    - Use `PriorityQueuq`
### Code
```java showLineNumbers
    public int kthSmallest(int[][] matrix, int k) {
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> {
            // 按照元素大小升序排序
            return a[0] - b[0];
        });

        for (int i = 0; i < matrix.length; i++, i++) {
            // {matrix[i][j], i, j}, value, row index, column index
            pq.offer(new int[]{matrix[i][0], i, 0});
        }

        // loop k times: when k == 0, we have found the kth smallest element
        while (!pq.isEmpty() && k > 0) {
            int[] cur = pq.poll();
            res = cur[0];
            k--;

            // add next element from the same linked list
            int i = cur[1], j = cur[2];
            if (j + 1 < matrix[0].length) {
                pq.add(new int[]{matrix[i][j + 1], i, j + 1})
            }
        }

        return res;
    }
```
- Array of Priority Queue: `{matrix[i][j], i, j}`, value, row index, column index

### Complexity Analysis
- Time Complexity:
    1. Line 7-9: n insertion x O(log n) = `O(nlogn)`
        - Insertion into heap: O(log n)
    2. Line 13-23
        - poll():  O(log n)
        - At most 1 add: O(log n) (only if the row has more elements)
        - Total per iteration: O(log n) + O(log n) = O(log n)
        - Total for k iterations: `O(klogn)`

- Combined: O(n log n + k log n)
- Since k ≤ n² (the matrix has n² elements), the worst case occurs when k = n²:
    - O(n log n + n² log n) = O(n² log n)
- However, we typically express the complexity as O(n log n + k log n) to show how it depends on both n (matrix size) and k (number of elements to process). This highlights that:
    - For small k, the k log n term is small, making the algorithm efficient
    - For large k (up to n²), the k log n term dominates

## LeetCode 2. Add Two Numbers
### Idea

### Code
- Start from 個位，align with our calculation of addition
- `carry`: used to handle 進位
- Need to use Math.floor() and mod
```java
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        let p1 = l1, p2 = l2;
        let dummy = new ListNode(-1);
        let p = dummy;

        let carry = 0;

        // 當兩條list都無 及 沒有carry先可以end
        while (p1 != null || p2 != null || carry > 0) {
            // 先加carry
            let sum = carry;
            if (p1 != null) {
                sum += p1.val;
                p1 = p1.next;
            }

            if (p2 != null) {
                sum += p2.val;
                p2 = p2.next;
            }

            // 處理carry情怳
            carry = Math.floor(sum / 10);
            sum = sum % 10;
            p.next = new ListNode(sum);
            p = p.next;
        }

        return dummy.next;
    }
```


## LeetCode 373. Find K Pairs with Smallest Sums
### Idea
- Variant of LeetCode 23. Merge K Sorted Lists
- The pairs are ordered by sum in ascending order, so we can use 23. Merge K Sorted Lists to solve this problem to loop the first kth pairs
```java
    nums1 = [1,7,11], nums2 = [2,4,6]

    1: [1, 2] -> [1, 4] -> [1, 6]
    2: [7, 2] -> [7, 4] -> [7, 6]
    3: [11, 2] -> [11, 4] -> [11, 6]
```
### Code
```java
    public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> {
            return (a[0] + a[1]) - (b[0] + b[1]);
        });

        // add the head node of each list
        for (int i = 0; i < nums1.length; i++) {
            // (nums1[i], nums2[j], j)
            pq.offer(new int[]{nums1[i], nums2[0], 0});
        }
        
        // process the whole linked list
        List<List<Integer>> res = new ArrayList<>();
        while(!pq.isEmpty() && k > 0) {
            int[] cur = pq.poll();
            k--;

            int nextIndex = cur[2] + 1;
            if (nextIndex < nums2.length) {
                pq.add(new int[]{cur[0], nums2[nextIndex], nextIndex});
            }

            List<Integer> pair = new ArrayList<>();
            pair.add(cur[0]);
            pair.add(cur[1]);
            res.add(pair);
        }
        return res;
    }
```
- The triple: `(nums1[i], nums2[j], j)`
- i is used to record the index of nums2 for generating next node