# Java Version

## Java 8
### 1. Lambda Expression
- Used to create anonymous functions, primarily designed to simplify the use of functional interfaces (interfaces with a single abstract method)
- It has two basic syntax forms:
    1. `(parameters) -> expression`: Used when the Lambda body consists of a **single expression**. The result of the expression serves as the return value.
    2. `(parameters) -> { statements; }`: Used when the Lambda body contains multiple statements. Curly braces are required to enclose the statements, and if there is a return value, a return statement must be used.
- The traditional anonymous inner class implementation tends to be verbose, whereas Lambda expressions can achieve the same functionality with a more concise syntax. For example, implementing the `Runnable` interface can be done in both ways:
    1. Using Anonymous Inner Class
        ```java
        public class AnonymousClassExample {
            public static void main(String[] args) {
                Thread t1 = new Thread(new Runnable() {
                    @Override
                    public void run() {
                        System.out.println("Running using anonymous class");
                    }
                });
                t1.start();
            }
        }
        ```
    2. Using Lambda Expression
        ```java
        public class LambdaExample {
            public static void main(String[] args) {
                Thread t1 = new Thread(() -> System.out.println("Running using lambda expression"));
                t1.start();
            }
        }
        ```

- Additionally, Lambda expressions can more clearly express the intent of the code, especially when handling collection operations such as filtering, mapping, etc. For example, filtering a list to get all even numbers:
    ```java
    import java.util.Arrays;
    import java.util.List;
    import java.util.stream.Collectors;

    public class ReadabilityExample {
        public static void main(String[] args) {
            List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);
            // Using Lambda expression with Stream API to filter even numbers
            List<Integer> evenNumbers = numbers.stream()
                                            .filter(n -> n % 2 == 0)
                                            .collect(Collectors.toList());
            System.out.println(evenNumbers); // Output: [2, 4, 6]
        }
    }
    ```
- Furthermore, Lambda expressions enable Java to support the functional programming paradigm, allowing functions to be passed as parameters. This enables the creation of more flexible and reusable code. For example, defining a generic calculation function:
    ```java
    interface Calculator {
        int calculate(int a, int b);
    }

    public class FunctionalProgrammingExample {
        public static int operate(int a, int b, Calculator calculator) {
            return calculator.calculate(a, b);
        }

        public static void main(String[] args) {
            // Passing addition function using Lambda expression
            int sum = operate(3, 5, (x, y) -> x + y);
            System.out.println("Sum: " + sum); // Output: Sum: 8

            // Passing multiplication function using Lambda expression
            int product = operate(3, 5, (x, y) -> x * y);
            System.out.println("Product: " + product); // Output: Product: 15
        }
    }
    ```
- Drawback:
    1. Increase debugging difficulty because Lambda expressions are **anonymous**, making it challenging to pinpoint which specific Lambda expression is causing an issue



### 2. Stream API
1. For operations on collections such as fltering, mapping, and sorting.
2. Example 1: Filtering and collecting elements
    - Without Stream API:
        ```java
            List<String> originalList = Arrays.asList("apple", "fig", "banana", "kiwi");
            List<String> filteredList = new ArrayList<>();

            for (String item : originalList) {
                if (item.length() > 3) {
                    filteredList.add(item);
                }
            }
        ```
    - With Stream API:
        ```java
            List<String> originalList = Arrays.asList("apple", "fig", "banana", "kiwi");
            List<String> filteredList = originalList.stream()
                                                .filter(s -> s.length() > 3)
                                                .collect(Collectors.toList());
        ```
3. Example 2: Concatenating Strings with `reduce`
    ```java
        List<String> words = Arrays.asList("apple", "banana", "kiwi");
        String result = words.stream()
                            .reduce((a, b) -> a + "," + b)
                            .orElse("");
        System.out.println(result); // Output: apple,banana,kiwi
    ```
    - The first argument `a` is the accumulated result, and `b` is the next element in the stream.

4. 


### 3. Optional Class

### 4. Functional Interfaces

### 5. CompletableFuture
- Introduced in Java 8.
- Prior to Java 8, asynchronous operations were typically implemented using `Future` or Guava's `ListenableFuture`.
```java
    ExecutorService executor = Executors.newFixedThreadPool(5);
    CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> {
        System.out.println("执行step 1");
        return "step1 result";
    }, executor);
    CompletableFuture<String> cf2 = CompletableFuture.supplyAsync(() -> {
        System.out.println("执行step 2");
        return "step2 result";
    });
    cf1.thenCombine(cf2, (result1, result2) -> {
        System.out.println(result1 + " , " + result2);
        System.out.println("执行step 3");
        return "step3 result";
    }).thenAccept(result3 -> System.out.println(result3));
```

- `CompletableFuture` implements two interfaces: `Future` and `CompletionStage`.
    - `Future` represents the result of an asynchronous computation.
    - `CompletionStage` represents a stage in the asynchronous execution process, which may be triggered by another `CompletionStage`. As the current stage completes, it may also trigger the execution of a series of other `CompletionStage` instances.
- Allows for diverse orchestration and combination of these stages based on actual business needs.
- We can use its provided functional programming methods, such as `thenApply` and `thenCompose`, to compose and orchestrate these stages.


## Java 17
### 1. Sealed Class

### 2. Pattern Matching for `instanceof`

### 3. Records

## Java 21
### 1. Pattern Matching for Switch Statement
1. Pattern Matching for Switch Statement
    1. `case SavingsAccount sa -> result = sa.getSavings();`
        ```java title="Before Java 21"
            public class SwitchBeforeJava21 {
                static String processAccount(Object account) {
                    String result;
                    if (account instanceof SavingsAccount) {
                        SavingsAccount sa = (SavingsAccount) account;
                        result = "Savings Balance: " + sa.getSavings();
                    } else if (account instanceof CheckingAccount) {
                        CheckingAccount ca = (CheckingAccount) account;
                        result = "Checking Balance: " + ca.getChecking();
                    } else if (account == null) {
                        result = "Account is null";
                    } else {
                        result = "Unknown account type";
                    }
                    return result;
                }

                public static void main(String[] args) {
                    SavingsAccount savings = new SavingsAccount(1000);
                    CheckingAccount checking = new CheckingAccount(500);
                    System.out.println(processAccount(savings));  // Output: Savings Balance: 1000
                    System.out.println(processAccount(checking)); // Output: Checking Balance: 500
                    System.out.println(processAccount(null));     // Output: Account is null
                }
            }
        ```
        ```java title="In Java 21"
            public class SwitchInJava21 {
                static String processAccount(Object account) {
                    return switch (account) {
                        case SavingsAccount sa -> "Savings Balance: " + sa.getSavings();
                        case CheckingAccount ca -> "Checking Balance: " + ca.getChecking();
                        case null -> "Account is null";
                        default -> "Unknown account type";
                    };
                }

                public static void main(String[] args) {
                    SavingsAccount savings = new SavingsAccount(1000);
                    CheckingAccount checking = new CheckingAccount(500);
                    System.out.println(processAccount(savings));  // Output: Savings Balance: 1000
                    System.out.println(processAccount(checking)); // Output: Checking Balance: 500
                    System.out.println(processAccount(null));     // Output: Account is null
                }
            }
        ```
### 2. String Template
- Previously, `"hello " + name + ", welcome to the geeksforgeeks!"`, In Java 21, this can be simplified to `hello {name}, welcome to the geeksforgeeks!`.

### 3. Array Pattern
- For instance, `if (arr instanceof int[] {1, 2, 3})`


## Summary of Java 8 Features
| Feature Name            | Description                                      | Example or Explanation                                      |
|--------------------------|--------------------------------------------------|-------------------------------------------------------------|
| Lambda Expressions       | Simplify anonymous inner classes, support functional programming | `(a, b) -> a + b` replaces anonymous class implementing an interface |
| Functional Interfaces    | Interfaces with a single abstract method, marked with `@FunctionalInterface` annotation | `Runnable`, `Comparator`, or custom `@FunctionalInterface interface MyFunc { void run(); }` |
| Stream API              | Provides **chained operations for collection data**, supports parallel processing | `list.stream().filter(x -> x > 0).collect(Collectors.toList())` |
| Optional Class           | **Encapsulates potentially null objects**, reduces null pointer exceptions | `Optional.ofNullable(value).orElse("default")` |
| Method References        | Simplify Lambda expressions by directly referencing existing methods | `System.out::println` is equivalent to `x -> System.out.println(x)` |
| Default and Static Methods in Interfaces | Interfaces can define default implementations and static methods, enhancing extensibility | `interface A { default void print() { System.out.println("Default method"); } }` |
| Parallel Array Sorting   | Uses multithreading to accelerate array sorting  | `Arrays.parallelSort(array)` |
| Repeated Annotations     | Allows the same annotation to be used multiple times at the same location | `@Repeatable` annotation used with container annotations |
| Type Annotations         | Annotations can be applied to more locations (e.g., generics, exceptions) | `List<@NonNull String> list` |
| CompletableFuture        | Enhances asynchronous programming with **chained calls** and composite operations | `CompletableFuture.supplyAsync(() -> "result").thenAccept(System.out::println)` |


## Summary of Java 17 Features
| Feature Name            | Description                                      | Example or Explanation                                      |
|--------------------------|--------------------------------------------------|-------------------------------------------------------------|
| Sealed Classes          | Restrict which classes can extend or implement a class or interface, enhancing control over inheritance | `sealed interface Shape permits Circle, Rectangle {}` where only `Circle` and `Rectangle` can implement `Shape` |
| Pattern Matching for instanceof | Simplifies type checking and casting in one step, reducing boilerplate | `if (obj instanceof String s) { System.out.println(s.toUpperCase()); }` casts `obj` to `String s` automatically |
| Records                 | Immutable data classes with concise syntax for data carriers, automatically providing `equals`, `hashCode`, and `toString` | `record Point(int x, int y) {}` creates a class with `x`, `y` fields, getters, and standard methods |


## Summary of Java 21 Features
| Feature Name            | Description                                      | Example or Explanation                                      |
|--------------------------|--------------------------------------------------|-------------------------------------------------------------|
| Pattern Matching for switch | Enhances `switch` with pattern matching, allowing type patterns and guards for concise logic | `switch (obj) { case String s when s.length() > 5 -> s.toUpperCase(); case String s -> s; default -> "Unknown"; }` |
| String Templates (Preview) | Simplifies string construction with embedded expressions, improving readability and safety | `String name = "Alice"; String result = STR."Hello, \{name}!";` produces `"Hello, Alice!"` |