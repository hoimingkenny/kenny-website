# Common

## Length/Size
```java
    
    String s = "abc";
    int len = s.length();

    int[] freq = new int[26];
    int len1 = freq.length;

    // sort int[][]
    Arrays.sort(intervals, (a, b) -> {
        return a[0] - b[0];
    });
```

## Sorting
```java 

```

## String Operation
```java showLineNumbers
    // first convert all characters to lowercase and filter out spaces and punctuation
    StringBuilder sb = new StringBuilder();
    
    for (char c: s.toCharArray()) {
        if (Character.isLetterOrDigit(c)) {
            sb.append(Character.toLowerCase(c));
        }
    }

    // append and delete the last element
    StringBuilder sb = new StringBuilder();
    for (char c : str.toCharArray()) {
        if (c != '#') {
            sb.append(c);
        } else if (sb.length() > 0) {
            sb.deleteCharAt(sb.length() - 1);
        }
    }
    return sb.toString();
```

## Priority Queue
```java showLineNumbers
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> {
        // 按照元素大小升序排序
        return a[0] - b[0];
    });
```