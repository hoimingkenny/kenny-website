# Stack & Queue

## Basic API
```java
    class MyQueue<E> {
        // add an element to the back, O(1)
        void push(E e);
        // remove and return the element at the front, O(1)
        E pop();
        // check the front element, O(1)
        E peek();
        int size();
    }

    class MyStack<E> {
        // add an element to the top, O(1)
        void push(E e);
        // remove and return the element at the top, O(1)
        E pop();
        // check the top element, O(1)
        E peek();
        int size();
    }
```

### LeetCode 232. Implement Queue using Stacks
#### Code
```java showLineNumbers
    class MyQueue {
        private Stack<Integer> s1, s2;

        public MyQueue() {
            s1 = new Stack<Integer>();
            s2 = new Stack<Integer>();
        }
        
        public void push(int x) {
            s1.push(x);
        }
        
        public int pop() {
            peek();
            return s2.pop();
        }
        
        public int peek() {
            if (s2.isEmpty()) {
                while (!s1.isEmpty()) {
                    s2.push(s1.pop());
                }
            }

            return s2.peek();
        }
        
        public boolean empty() {
            return s1.isEmpty() && s2.isEmpty();
        }
    }
```

### LeetCode 225. Implement Stack using Queues
#### Code
    ```java showLineNumbers
        class MyStack {
            private Queue<Integer> q;
            int topElem = 0;

            public MyStack() {
                q = new LinkedList<>();
            }
            
            public void push(int x) {
                q.offer(x);
                topElem = x;
            }
            
            public int pop() {
                int size = q.size();

                // why not size > 1?
                while (size > 2) {
                    q.offer(q.poll());
                    size--;
                }

                topElem = q.peek();
                q.offer(q.poll());

                return q.poll();
            }
            
            public int top() {
                return topElem;
            }
            
            public boolean empty() {
                return q.isEmpty();
            }
        }
    ```
    - If `while (size > 1)`, the last element will be lost
    - So need to step while the last element is in the front of the queue and update topElem manually