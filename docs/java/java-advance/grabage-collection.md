# Grabage Collection

- Identify and free memory of unreachable objects

## How does garbage collection work in Java?
- The heap is divided into Young and Old generations
- Minor GC cleans Young, Major GC cleans Old
- Algorithm like G1 balance throughput and latency


### OutOfMemoryError
- `java.lang.OutOfMemoryError` exception is thrown when there is insufficient space to allocate an object in the Java heap
- The GC cannot make space available to accommodate a new object, and the heap cannot be expanded further
- Also, it may be thrown when there is insufficient native memory to support the loading of a Java class