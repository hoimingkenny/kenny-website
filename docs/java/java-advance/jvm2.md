# JVM

- The runtime environment that executes Java bytecode.

## Key Concept
JVM Architecture
- Class Loader: Loads, links, and initializes `.class` files
- Runtime Data Area: store data during execution
    - Method Area: metadata, static variables
    - Heap: object instances, shared across threads
    - Stack: per-thread, store frames (local variables, operand stack)
    - PC Register: per-thread, holds address of current instruction
    - Native Method Stack: for native methods (e.g. C/C++)
- Execution Engine: interprets or compiles bytecode

