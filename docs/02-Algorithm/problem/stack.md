# Stack

## LeetCode 20. Valid Parentheses
### Idea
    - If the character is an opening parenthesis, push it to the stack
    - If the character is a closing parenthesis, pop the stack and check if the popped character is the corresponding opening parenthesis

### Code
```java showLineNumbers
    public boolean isValid(String s) {
        Stack<Character> left = new Stack<>();

        for (char c: s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                left.push(c);
            } else {
                if (!left.isEmpty() && left.peek() == leftOf(c)) {
                    left.pop();
                } else {
                    return false;
                }
            }
        }
        return left.isEmpty();
    }

    char leftOf(char c) {
        if (c == ')') return '(';
        if (c == ']') return '[';
        else return '{';
    }
```

## LeetCode 232. Implement Queue using Stacks

## LeetCode 150. Evaluate Reverse Polish Notation
    ### Idea
        - 如果是數字，則放入stack
        - 如果是operator，則取出stack的最後兩個元素，計算並放入stack
        - for division and substraction, 栈顶第二个数是被除（减）数

## LeetCode 155. Min Stack
    ### Idea
        - 每個元素入stack時，都要記下當前stack中的最小值

    ### Code
    ```java showLineNumbers
        class MinStack1 {
            // 记录栈中的所有元素
            Stack<Integer> stk = new Stack<>();
            // 阶段性记录栈中的最小元素
            Stack<Integer> minStk = new Stack<>();

            public void push(int val) {
                stk.push(val);
                // 维护 minStk 栈顶为全栈最小元素
                if (minStk.isEmpty() || val <= minStk.peek()) {
                    // 新插入的这个元素就是全栈最小的
                    minStk.push(val);
                } else {
                    // 插入的这个元素比较大
                    minStk.push(minStk.peek());
                }
            }
            
            public void pop() {
                stk.pop();
                minStk.pop();
            }
            
            public int top() {
                return stk.peek();
            }
            
            public int getMin() {
                // minStk 栈顶为全栈最小元素
                return minStk.peek();
            }
        }
    ```