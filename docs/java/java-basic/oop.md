import Highlight from '@site/src/components/Highlight'
import Warn from '@site/src/components/Warn'
import Term from '@site/src/components/Term'

# OOP
#### 1. What is OOP? Briefly Explain Encapsulation, Inheritance, and Polymorphism.
   1. Programming paradigm that abstracts real-word entities into objects.
   2. Objects have attributes (called fields or properties) and behaviors (called methods).

- <Term>Encapsulation</Term>
   1. Bundling an object's data and methods into a single unit, hiding the internal details from the outside world.
   2. Interaction occurs only through the interfaces provided by the object.
- <Term>Inheritance</Term>
   1. Allows a subclass to share the data structures and methods of a parent class.
   2. A key means of code reuse.
   3. Helps establish a hierarchical relationship between classes, making the structure clearer.
- <Term>Polymorphism</Term>
   1. Object can have multiple forms.
   2. Polymorphism can be divided into compile-time polymorphism (overloading) and runtime polymorphism (overriding).


#### 2. Where is Polymorphism Reflected?
- <Term>Method Overloading</Term>
   1. Allows a class to have multiple methods with the same name but different parameter lists (differing in parameter types, number, or order).
   2. The compiler determines which method to call at compile time based on the passed parameters.
   3. Example: An `add` method can be defined as `add(int a, int b)` and `add(double a, double b).`
- <Term>Method Overriding</Term>
   1. Allows a subclass to provide a specific implementation for a method that is already defined in its parent class.
   2. At runtime, the JVM determines which version of the method to call based on the actual type of the object.
   3. Example: In an `Animal` class, a `sound` method is defined; the subclass `Dog` can override it to implement `bark`, while `Cat` can implement `meow`.
- Interfaces and Implementations
   1. Multiple classes can implement the same interface.
   2. References of the interface type can be used to call methods of these classes.
   3. Example: `Animal` interface with `sound()` method, `Dog` and `Cat` classes implementing `sound()`.
- Upcasting and Downcasting
   1. A parent class-type reference can point to a subclass object, which is known as upcasting.
   2. Enables the use of different subclass implementations at runtime.
   3. Downcasting: Converting a parent class reference back to its subclass type.
   4. Require verifying the actual object type to avoid `ClassCastException`.

#### 3. Differences Between Abstract Class and Regular Class
   1. Instantiation: A regular class can be directly instantiated into an object, whereas an abstract class cannot be instantiated and can only be inherited.
   2. Method Implementation: Methods in a regular class can have specific implementations, while methods in an abstract class may or may not have implementations.
   3. Inheritance: A class can inherit from one regular class and implement multiple interfaces; however, a class can only inherit from one abstract class but can implement multiple interfaces simultaneously.
   4. Implementation Constraints: A regular class can be inherited and used by other classes, whereas an abstract class is typically used **as a base class, intended to be inherited** and extended by other classes.
   5. The subclass must **implement all the abstract methods** of the abstract class.

#### 4. What is the difference between Abstract class and Interface?
- Characteristics of Both:
   - <Term>Abstract Class</Term>
      1. Used to describe the common characteristics and behaviors of a class.
      2. can have member variables, constructors, and concrete methods.
   - <Term>Interface</Term>
      1. Used to define behavioral specifications.
      2. Supports multiple implementations.
      3. Can contain constants, abstract methods, default methods, and static methods. (Two last two since Java 8)

- Differences Between the Two:
   - Implementation Approach
      1. Implementing Interface: `implements`
      2. Inheriting Abstract Class: `extends`
      3. A class can implement multiple interfaces, but it can only inherit one abstract class.
      4. Use interfaces can indirectly achieve multiple inheritance.
   - Access Modifiers
      1. In an interface, member variables are implicitly `public static final`, must be initialized, and cannot be modified.
      2. All member methods are `public`
      3. In abstract class, member variables and member methods are implicitly `public abstract`.
   - Variables
      1. Abstract class can contain instance variables and static variables.
      2. Interface can only contain constants (i.e., static constants).

#### 5. What methods can be defined inside an interface?
   1. Abstract method
      1. All classes implementing the interface must provide implementations for these methods.
      2. Abstract methods are implicitly `public abstract`.
      ```java  
         public interface Animal {
            void makeSound();
         }
      ```
   2. Default method
      1. Introduced in Java 8.
      2. Allow interfaces to provide concrete implementations.
      3. Implementing classes can choose to override these default methods.
      ```java
         public interface Animal {
            void makeSound();
            
            default void sleep() {
               System.out.println("Sleeping...");
            }
         }
      ```
   3. Static method
      1. Introduced in Java 8.
      2. Can be called directly using the interface name, without requiring an instance of an implementing class.
      ```java
         public interface Animal {
            void makeSound();
            
            static void staticMethod() {
               System.out.println("Static method in interface");
            }
         }
      ```
   4. Private method
      1. Introduced in Java 9.
      2. Provide helper functionality for default methods or other private methods within the interface.
      ```java
         public interface Animal {
            void makeSound();
            
            default void sleep() {
               System.out.println("Sleeping...");
               logSleep();
            }
            
            private void logSleep() {
               System.out.println("Logging sleep");
            }
         }
      ```

##### 6. Can an abstract class be instantiated?
   - <Warn>Cannot</Warn> be instantiated directly.
   - The primary purpose of an abstract class is to be inherited.
   - An abstract class can have constructors, which are called during the instantiation of a subclass to perform necessary initialization.

   ```java
      public abstract class AbstractClass {
         public AbstractClass() {
            // Constructor code
         }
         
         public abstract void abstractMethod();
      }

      public class ConcreteClass extends AbstractClass {
         public ConcreteClass() {
            super(); // Calls the abstract class's constructor
         }
         
         @Override
         public void abstractMethod() {
            // Implementation of the abstract method
         }
      }

      // The following code can run
      ConcreteClass obj = new ConcreteClass();
   ```
   - When we create an instance of `ConcreteClass`, the constructor of `AbstractClass` is called. However, this does not mean `AbstractClass` is instantiated.
