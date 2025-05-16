# Math

## Count Prime
- Prime Number: 如果一個數只能被1和自己整除
- https://labuladong.online/algo/frequency-interview/print-prime-number/
```java
    int countPrimes(int n) {
        int count = 0;
        for (int i = 2; i < n; i++)
            if (isPrime(i)) count++;
        return count;
    }

    // 判断整数 n 是否是素数
    boolean isPrime(int n) {
        for (int j = 2; j < n; j++)
            if (n % j == 0)
                // 有其他整除因子
                return false;
        return true;
    }
```
- Why `i * i <= n` (i.e., `i <= √n)`)?
    - if `n` is composite, it can be refactored as `n = a * b`, where `a` and `b` are divisors (not ` or `n`)
    - `√n * √n = n`
    - Example for `n = 12`:
        - Divisors: 1, 2, 3, 4, 6, 12
        - Pairs: (2, 6), (3, 4)
        - `√12 ≈ 3.46`. Checking up to 3 covers 2 and 3
