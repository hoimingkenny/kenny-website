# OOP Concept
## OOP
Encapsulate business logic into objects which have properties and behaviours

objects are instance of classes
blueprint for creating object

### Encapsulation
- Concept of bundling the attributes and methods into the object
- Restrict the direct access to some object's component
- Access Modified
- Need Getter and Setter

### Inheritance
- to inherit the properties and behaviours of another class
- extends

### Polymorphism
-  object can have multiple forms
   achieved by method overriding and method overloading

method overriding: allow subclass to provide different implementation of a method that is already defined in. its superclass

method overloading: allow multiple methods with the same name to be defined in a clas with different parameters

- When create service for different region
   - BaseServiceClass
   - HKServiceClass
   - SGServiceClass

### Abstraction
- hiding implementation details
- Interface: methods without implementation

Abstract class cannot be instantiated

## Abstract Class vs Interface
- Class can extend >1 abstract class and implements multiple interfaces
- Abstract Class: can define both abstract or non-abstract method(have implementation)
   - default: `protected`
- Interface: default `public abstract`

|                | Objective                                                           |
| -------------- | ------------------------------------------------------------------- |
| Interface      | Define specification, "behavior" and "capabilities"                 |
| Abstract Class | For reuse of code, provide common implementation and basic function |
