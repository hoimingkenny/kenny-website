# Java Basic

## 1. What is the difference between interpretation and compilation? Is Java a compiled or interpreted language?
### Interpretation
- How it works: Code is translated and executed line by line
- Translation and Execution happen simultaneously
- Examples of languages: Python, JavaScript

### Compilation
- How it works: The entire code is translated into machine code (binary) before execution.
- Examples of compiled languages: C, C++

### Is Java Compiled or Interpreted?
- Java is both compiled and interpreted

- Java Execution Process
  - Compilation Phase:
    - Java source code (.java files) is compiled by the Java compiler (javac) into bytecode (.class files).
    - Bytecode is a platform-independent intermediate format.
  - Interpretation/Execution Phase:
      - The Java Virtual Machine (JVM) interprets the bytecode and translates it into machine code.
      - The JVM uses Just-In-Time (JIT) compilation to optimize frequently used bytecode by translating it into machine code for faster execution.

## 2. What is the difference in the use of the `/` symbol for floating-point and integer types?

## 3. How is int converted to double, and is double converted to int rounded or truncated?
- `int` and `double`
```
System.out.println(10/3); // Output: 3 (int)
System.out.println(10/3.0); // Output: 3.3333333333333335 (double)
System.out.println((int)(10/3.0)); // Output: 3 (int)
```

- Converting `int` to `double`
```
int myInt = 42
double myDouble = myInt;
System.out.println(myDouble); // Output: 42.0
```

- Converting `double` to `int`
```
double myDouble = 42.99;
int myInt = (int) myDouble;  
System.out.println(myInt);  // Output: 42
```
