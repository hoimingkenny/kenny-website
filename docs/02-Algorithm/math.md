# Math

## Count Prime
- Prime Number: 如果一個數只能被1和自己整除
    - 5 can only be divided by 1 and 5
- https://labuladong.online/algo/frequency-interview/print-prime-number/

#### Solution of O(n^2)
```java
    int countPrimes(int n) {
        int count = 0;
        for (int i = 2; i < n; i++)
            if (isPrime(i)) count++;
        return count;
    }

    // 判断整数 n 是否是素数，由2去到n-1
    boolean isPrime(int n) {
        for (int j = 2; j < n; j++)
            if (n % j == 0)
                // 有其他整除因子
                return false;
        return true;
    }
```

#### isPrime from O(n^2) -> O(sqrt(n))
```java
    6 = 2 x 3
    6 = √6 x √6 (√6 = 2.44949)
    6 = 3 x 2

    boolean isPrime(int n) {
        for (int i = 2; i * i < n; i++) {
            ...
        }
    }
```
- 如果在 `[2, √n]`這個區間內沒有發現可整除的因子，就可以直接斷定`n`是prime number了，因為在`[sqrt(n), n]`之間都不會找到可整除的因子。

#### Best Solution
- The method is called "Sieve of Eratosthenes"
- Starting from 2, it is a prime number. So, 2 x 2 = 4, 2 x 3 = 6, 2 x 4 = 8, ... 4, 6, 8 and so on can not be prime numbers
- 3, it is also a prime number. So, 3 x 3 = 9, 4 x 3 = 12, 5 x 3 = 15, ... 6, 9, 12, 15 and so on can not be prime numbers

```java
    public int countPrimes(int n) {
        boolean[] isPrime = new boolean[n];
        Arrays.fill(isPrime, true);

        for (int i = 2; i * i < n; i++) {
            if (isPrime[i]) {
                for (int j = i * i; j < n; j += i) {
                    isPrime[j] = false;
                }
            }
        }

        int count = 0;
        for (int i = 2; i < n; i++) {
            if (isPrime[i]) count++;
        }

        return count;
    }
```
