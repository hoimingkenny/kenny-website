# Generics

`new ArrayList<E>`
E: Generic Type

## Why need Generic?
1. 請編寫程序，在ArrayList中，添加3個Dog Object
2. Dog 對象包含name，并有getName的method
3. 

- 現在有兩個Class，一個`Dog`Class & `Cat` Class，


## Generic的好處
1. 編譯時，檢查添加元素的類型，提高了安全性
2. 減少類型轉換的次數
   - Not using Generic
     - Dog -> Object -> Dog // 放入到ArrayList會先轉換成Object，在取出時，需要再轉換為Dog
   - Using Generic
     - Dog -> Dog -> Dog // 放入和取出，不需要類型轉換，提高效率
3. 不再提示編譯Error
```
   // 1. 當使用ArrayList<Dog> 表示存放到 ArrayList 集合中的元素是Dog類型
   // 2. 如果Compiler發現添加的類型不滿足要求，就會報錯
   // 3. When iterate，可以直接取出Dog類而不是Object類
   ArrayList<Dog> arrayList = new ArrayList<Dog>();
   arrayList.add(new Dog("123", 10));
   arrayList.add(new Dog("456", 11));
   arrayList.add(new Dog("789", 12));

    // arrayList.add(new Cat("abc", 21));

    // Iteration
    System.out.println("===== Use Generic =====");
    for (Dog dog : arrayList) {
        // No need to down-cast: Object -> Dog as in Generic01
        System.out.println(dog.getName() + "-" + dog.getAge());
    }
```

## Introduction to Generic
1. Generic又稱參數化類，是JDK5出現的新特性，解決數據類型的安全性問題
2. 在類聲明或實例化時只要指定好需要的具體的類型即可
3. 可以保證如果程序在編譯時沒有發出警告，運行時就不會發生`ClassCastException`異常
4. 作用：可以在聲明時通過一個標識表示類中某個屬性的類型，或者某個方法的type of return value，或者type of parameter

## Syntax

Declaration
  - `Interface<T>` and `Class <K,V>` // e.g. List, ArrayList
  - 說明：
    1. 其中，`T`, `K` & `V` 不代表值，而是表示類型
    2. 任用字母都可以。常用T表示，是Type的縮寫


## Custom Generics
```java
class ClassName<T, R, ...> {  // "..." indicates there can be multiple generics members
}
```
Important Details
1. Instance Members Can Use Generics: Generics can be used in properties and methods.
2. Generic Arrays Cannot Be Initialized: Since the type is not determined, the required memory size cannot be established.
3. Static Methods Cannot Use Class Generics: Static methods and variables are tied to the class itself, not to instances. At the time the class is loaded, no instance has been created, so the types for generics cannot be specified. If generics were allowed in static methods or variables, the JVM would be unable to complete their initialization.
4. The Type of Generic Class Is Determined at Object Creation: When creating an object of a generic class, the specific type must be provided.
Default to Object if No Type Is Specified: If no type is explicitly specified during object creation, the generic type defaults to Object.

```java
class Tiger<T, R, M>{
   	String name;
   	R r;
   	M m;
   	T t;
}
```
```java
@SuppressWarnings({"all"})
public class CustomGeneric_ {
    public static void main(String[] args) {
        //T=Double, R=String, M=Integer
        Tiger<Double, String, Integer> g = new Tiger<>("john");
        g.setT(10.9); //OK
        //g.setT("yy"); // Error: Wrong type
        System.out.println(g);
        Tiger g2 = new Tiger("john~~");//OK T=Object R=Object M=Object
        g2.setT("yy"); //OK ,因为 T=Object "yy"=String 是Object子类
        System.out.println("g2=" + g2);

    }
}

//1. The "Tiger" class uses generics, so we refer to "Tiger" as a custom generic class.
//2. T, R, M are generic type identifiers, typically represented as single uppercase letters.
//3. Multiple generic type identifiers can be used.
//4. Instance members (properties, methods) can use generics.
//5. Arrays using generics cannot be initialized.
//6. Static methods cannot use class-level generics.
class Tiger<T, R, M> {
    String name;
    R r; // Property using a generic type
    M m;
    T t;
    // Arrays using generics cannot be initialized because the type T is not determined, so memory allocation is not possible.
    T[] ts;

    public Tiger(String name) {
        this.name = name;
    }

    public Tiger(R r, M m, T t) { // Constructor using generics
        this.r = r;
        this.m = m;
        this.t = t;
    }

    public Tiger(String name, R r, M m, T t) { // Constructor using generics
        this.name = name;
        this.r = r;
        this.m = m;
        this.t = t;
    }

    // Static methods and properties cannot use generics because static members are associated with the class itself.
    // At the time of class loading, no objects have been created.
    // Thus, the JVM cannot initialize static members if they use generics.
//    static R r2;
//    public static void m1(M m) {
//
//    }

    // Methods using generics

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public R getR() {
        return r;
    }

    public void setR(R r) { // Method using a generic type
        this.r = r;
    }

    public M getM() { // Return type using a generic type
        return m;
    }

    public void setM(M m) {
        this.m = m;
    }

    public T getT() {
        return t;
    }

    public void setT(T t) {
        this.t = t;
    }

    @Override
    public String toString() {
        return "Tiger{" +
                "name='" + name + '\'' +
                ", r=" + r +
                ", m=" + m +
                ", t=" + t +
                ", ts=" + Arrays.toString(ts) +
                '}';
    }
}
```

### Custom Generic Interfaces
```java
interface InterfaceName<T, R, ...> {
}
```
Important Details
1. Static members in interfaces cannot use generics (same rule as for generic classes).
2. The type for a generic interface is determined when it is **extended** or **implemented**.
3. If no type is specified, the default type is Object.

```java
public class CustomInterfaceGeneric {
    public static void main(String[] args) {
    }
}

/**
* Explanation of using generic interfaces:
* 1. Static members in interfaces cannot use generics.
* 2. The type of a generic interface is determined when it is extended or implemented.
* 3. If no type is specified, the default type is `Object`.
*/

// Specifying the type for a generic interface when extending it
interface IA extends IUsb<String, Double> {
}

// Implementing IA, which extends IUsb and specifies U as String and R as Double.
// Methods in IUsb will use String for U and Double for R.
class AA implements IA {
    @Override
    public Double get(String s) {
        return null;
    }

    @Override
    public void hi(Double aDouble) {
    }

    @Override
    public void run(Double r1, Double r2, String u1, String u2) {
    }
}

// Specifying generic types directly when implementing the interface
class BB implements IUsb<Integer, Float> {
    @Override
    public Float get(Integer integer) {
        return null;
    }

    @Override
    public void hi(Float aFloat) {
    }

    @Override
    public void run(Float r1, Float r2, Integer u1, Integer u2) {
    }
}

// Not specifying types; defaults to Object. Equivalent to IUsb<Object, Object>.
class CC implements IUsb {
    @Override
    public Object get(Object o) {
        return null;
    }

    @Override
    public void hi(Object o) {
    }

    @Override
    public void run(Object r1, Object r2, Object u1, Object u2) {
    }
}

interface IUsb<U, R> {
    int n = 10;  // Static constants cannot use generics.

    // Generic types can be used in normal methods
    R get(U u);

    void hi(R r);

    void run(R r1, R r2, U u1, U u2);

    // Default methods (introduced in JDK 8) can use generics
    default R method(U u) {
        return null;
    }
}
```

### Custom Generic Methods
```java
    modifier <T, R, ...> returnType methodName(parameters) {
    }
```

Important Details
1. Generic methods can be defined in normal classes or generic classes.
2. The type is determined when the generic method is called.
3. A method like public void eat(E e) {} is not a generic method if `<T, R, ...>` is not declared after the modifier. It is simply using the class's declared generic types.

```java
@SuppressWarnings({"all"})
public class CustomMethodGeneric {
    public static void main(String[] args) {
        Car car = new Car();
        car.fly("BMW", 100);  // The compiler determines the types as String and Integer
        System.out.println("=======");
        car.fly(300, 100.1);  // The compiler determines the types as Integer and Double

        // Test generic method in a generic class
        Fish<String, ArrayList> fish = new Fish<>();
        fish.hello(new ArrayList(), 11.3f);  // ArrayList and Float
    }
}

// Generic method in a normal class
class Car {
    public void run() {
    }

    // <T, R> indicates generic types specific to this method
    public <T, R> void fly(T t, R r) {
        System.out.println(t.getClass());  // Prints the class of t
        System.out.println(r.getClass());  // Prints the class of r
    }
}

// Generic method in a generic class
class Fish<T, R> {
    public void run() {
    }

    public <U, M> void eat(U u, M m) {
    }

    // Uses class-level generics (T) in this method
    public void hi(T t) {
    }

    // Both class-level generics and method-specific generics
    public <K> void hello(R r, K k) {
        System.out.println(r.getClass());  // ArrayList
        System.out.println(k.getClass());  // Float
    }
}
```


### Generics and Wildcards
Explanation of Generics and Wildcards
1. Generics do not have inheritance
   ```java
   List<Object> list = new ArrayList<String>();  // Error
   ```
2. Wildcards
- `<?>`: Accepts any generic type.
- `<? extends A>`: Accepts A and its subclasses (upper bound).
- `<? super A>`: Accepts A and its superclasses (lower bound).

```java
    public class GenericExtends {
    public static void main(String[] args) {
        Object o = new String("xx");

        // Wildcard examples
        List<Object> list1 = new ArrayList<>();
        List<String> list2 = new ArrayList<>();
        List<AA> list3 = new ArrayList<>();
        List<BB> list4 = new ArrayList<>();
        List<CC> list5 = new ArrayList<>();

        // <?>: Accepts any generic type
        printCollection1(list1);
        printCollection1(list2);
        printCollection1(list3);
        printCollection1(list4);
        printCollection1(list5);

        // <? extends AA>: Accepts AA and its subclasses
        printCollection2(list3);
        printCollection2(list4);
        printCollection2(list5);

        // <? super AA>: Accepts AA and its superclasses
        printCollection3(list1);
        printCollection3(list3);
    }

    // <?>: Accepts any generic type
    public static void printCollection1(List<?> c) {
        for (Object object : c) {
            System.out.println(object);
        }
    }
    
    // <? extends AA>: Accepts AA and its subclasses
    public static void printCollection2(List<? extends AA> c) {
        for (Object object : c) {
            System.out.println(object);
        }
    }
    
    // <? super AA>: Accepts AA and its superclasses
    public static void printCollection3(List<? super AA> c) {
        for (Object object : c) {
            System.out.println(object);
        }
    }
}

class AA {
}

class BB extends AA {
}

class CC extends BB {
}
```

## Summary Question:
### 1. What are the different ways to use generics?

### 2. What is the generic type erasure mechanism? Why is it needed?

### 3. What is a bridge method?

### 4. What are the limitations of generics? Why?

### 5. What are bounded and unbounded wildcards in generics?

