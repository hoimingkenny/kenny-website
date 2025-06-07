# Java Basic

## Primitive Types
1. Java has 8 primitive types
  - `byte` (8), `short` (16), `int` (32), `long` (64)
  - `float` (32), `double` (64)
  - `char` (16), `boolean` (1)

## Core API
### String
1. Immutable
2. No need to be instantiated with the `new` keyword
3. Implements the interface `CharSequence`
4. Rules for `+` operator
  - When both operands are numeric, `+` means addition
  - When one operand is a string, `+` means concatenation
  - During concatenation, a null value will be represented by the string "null"
  ```java 
    System.out.println( 10 + 100 ); // 110
    System.out.println( 12 + "345" ); // 12345
    System.out.println( "543" + 12 ); // 54321
    System.out.println( "654" + 32 + 1 ); // 654321
    System.out.println( 12 + 3 + "456" ); // 15456 
    System.out.println( 1 + null ); // compile error
    System.out.println( "1" + null ); // 1null
    String a = null;
    String b = null;
    System.out.println( a + b ); // nullnull
  ```

### StringBuilder
1. Mutable
2. Concatenation of String will result in a lot of interim String objects, which are immediately available for GC
    ```java title="Below code will create 27 objects."
      String str = "";
      for(char i='a'; i<='z'; i++)
          str += i;
      System.out.println(str);
    ```
    - Each concatenation operation creates a new String object
    - After str = "ab", the "a" object is no longer referenced
3. Concatenation of String via StringBuilder will not result in any interim object
    ```java title="Below code will create only StringBuilder object."
      StringBuilder stringBuilder = new StringBuilder("");
      for(char i='a'; i<='z'; i++)
          stringBuilder.append(i);
      System.out.println(stringBuilder.toString());
    ```

### Equality
- String equality is checked by comparing the **values of the strings**
  ```java
    String a1 = "Hello World";
    String a2 = "Hello World";
    System.out.println(a1.equals(a2)); // true
    System.out.println(a1 == a2); // true
  ```
- StringBuilder equality is checked by comparing the **references of the objects**
  ```java
    StringBuilder a1 = new StringBuilder("Hello World");
    StringBuilder a2 = new StringBuilder("Hello World");
    System.out.println(a1.equals(a2)); // false
    System.out.println(a1 == a2); // false
  ```
- String literal is pooled in String Pool
  ```java
    String a1 = "Hello World";
    String a2 = "Hello World";
    String a3 = "Hello" + " " + "World";
    String a4 = "Hello World".trim();
    String a5 = " Hello World ".trim();

    System.out.println(a1 == a2); // true
    System.out.println(a1 == a3); // true
    System.out.println(a1 == a4); // true
    System.out.println(a1 == a5); // false
  ```
  - `trum()` does not return the interned String from the string pool, it create new String object in the heap (not the String pool)

## 2. Method
### Access Modifier
1. `private`: only within the same class
2. `default`: only within the same package
3. `protected`: within the **same package** and **subclasses outside the package**

### Local Variable and Instance Variable
1. Local variable: defined in a method or code block
2. Instance variable: defined in a class but outside of any method
3. `final` modifier can be applied to local variable
4. For final primitive type, the value cannot be changed after initialization
5. For final object type, its reference cannot be changed after initialization, but the content of the object can be changed

### Static
1. `static` can be applied to class, method and variable
2. The target will then belong to the class instead of the instance of the class
3. Static methods have 2 main purposes:
  - Utility/helper methods that don't require any object state
  - For state(s) that is/are shared by all instances
4. You can use an instance of the class to call the static method. The compiler **checks for the type of the reference and uses that instead of the object**
  ```java
    public class Test {
      public static String everyone = "Everyone";
      public static void main(String... args) {
        Test test = null;
        System.out.println(Test.everyone); // Everyone
        System.out.println(test.everyone); // Everyone
      }
    }
  ```
5. Static member doesn't require an instance to use
6. Instance member require an instance to use

### Pass by value
1. Java is a pass-by-value language.
2. All method arguments are passed by value. For objects, this means the value of reference (not the object itself) is copied.
3. When passing a primitive, the method receives a copy of primitive's value
  ```java
    static void increment(int i){
      i += 1;
      System.out.println( "Callee: " + i ); // Callee: 1001
    }
    public static void main(String... args) {
      int salary = 1000;
      System.out.println( "Caller: " + salary ); // Caller: 1000
      increment(salary);
      System.out.println( "Caller: " + salary ); // Caller: 1000
    }
  ```
4. When passing an object, the method receives a copy of reference
  ```java
    static void reassign(StringBuilder sb){
      sb = new StringBuilder("Happy Valley");
      System.out.println( "Callee: " + sb ); // Callee: Happy Valley
    }
    public static void main(String... args) {
      var sb = new StringBuilder("Hello World");
      System.out.println( "Caller: " + sb ); // Caller: Hello World
      reassign(sb);
      System.out.println( "Caller: " + sb ); // Caller: Hello World
    }
  ```
5. Note the above example focus on the assignment of variables, and show that any reassignments made to the parameter in the method do not affect the caller.
6. When passing an object to a method, the method receives a copy of reference, and that copy of reference points to the same object as the caller.
7. Changes made to the object will be available to both references (caller and callee).
  ```java
    static void append(StringBuilder sb){
      sb.append(" and Happy new year.");
      System.out.println( "Callee: " + sb); // Callee: Hello World and Happy new year.
    }
    public static void main(String... args) {
      var sb = new StringBuilder("Hello World");
      append(sb);
      System.out.println( "Caller: " + sb); // Caller: Hello World and Happy new year
    }
  ```
  






## 1. What is the difference between interpretation and compilation? Is Java a compiled or interpreted language?
### Interpretation
- How it works: Code is translated and executed line by line
- Translation and Execution happen simultaneously
- Examples of languages: Python, JavaScript

### Compilation
- How it works: The entire code is translated into machine code (binary) before execution.
- Examples of compiled languages: C, C++

### Is Java Compiled or Interpreted?
- Java is both compiled and interpreted`

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
