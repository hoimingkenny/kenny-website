# Binary Heap

## Main Operation
1. Sink (Downward Adjustment)
2. Swim (Upward Adjustment)

- Primary Application
    1. Priority Queue
    2. Sorting: Heap Sort

- A binary heap is a data structure capable of dynamic sorting
- Dynamic sorting means we can continuously add or remove elements from the data structure, and it will automatically adjust the positions of the elements, allowing us to read elements from the data structure in an ordered manner

## Properties 
- The value of any node must be greater than or equal(or less than or equal to) to the values of all nodes in its left and right subtrees
- If it's greater than or equal to, we call it a max heap
- If it's less than or equal to, we call it a min heap

## Priority Queue
- Add/Remove: O(logN), where N is the number of elements in the heap
- It clearly a binary heap, the underlying principle is related to a binary tree
- The data structure is very similar to the standard Queue API, which follows a FIFO order
- Whereas binary heap can be understood as a kind of queue that automatically sorts the elements

```java
    public class PriorityQueue { 
        // add an element with priority
        void offer(int val);
        // remove and return the element with the highest/lowest priority
        int poll();
        // view the element with highest/lowest priority without removing it
        int peek();
    }
```

## Time Complexity
- height of a binary heap with $$\log_2 N$$
    - heapify-up: traverse a path from leaft to the root
- Space Complexity: O(N)

- N: size of heap
- offer(): O(logN)
- pop(): O(logN)
- peek(): O(1)
