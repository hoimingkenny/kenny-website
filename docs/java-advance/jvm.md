# JVM

## JVM基本介紹
- JVM是Java Virtual Machine的縮寫
- 是類似于一台小電腦運行運行在windows or linux的操作環境下，直接和os交互，與硬件不交互，而os可以幫我們完成和硬件進行交互的工作

## Java文件是如何運行
1. Class Loader
- 如果JVM想要執行一個.class文件，需要將其裝進一個類加載器，它像一個搬運工，將所有.class文件全部搬進JVM

2. Method Area
- 用于存放類似meta data，比如類信息，常量，static variable，編譯後的代碼
- classloader將.class文件搬過來就是先丟到這一塊上

3. Heap
- 用來store dynamically allocated objects，如用`new` create的object都會放到heap
    - e.g instance of classes, arrays, and collections
- heap中的objects可以share between多個方法的invocation
- 和Method Area一樣都屬於thread共享區域，都是thread non-safe
- Garbage collector會自動檢查和清理unreferenced objects
- Instance variable都會儲存在heap

4. Stack
- 代碼的運行空間，我們編寫的每一個方法都會放到棧裡運行
- 另外local variables也會放到這裡
    - Local variable: within limited scope, typically a function or block of code
- 每一個thread都會有自己的stack，thread-safe
- 如果local vairble point to一個object，the reference會store在stack，而實際的object會存在heap

5. Program Counter Register
- 類似一個指針，指向下一行我們需要執行的代碼，和棧一樣，是thread獨享的，每一個thread都會有自己對應的一塊區域而不會存在并發和multi-thread的問題

簡單代碼例子

對象初始化時會去方法區中找類信息，完成後再到棧中找運行方法，找方法就在方法表中找。


類加載器的介紹
- 負責加載.class文件的，這些文件在開頭會有特定的文件標示，將class文件字節碼內容加在度Memory中，並將這些內容轉換成方法區中嘅運行時數據結構，並且class leader只負責class文件的加載，而是否能夠運行則由Execution engine來決定。

- 2.1 class Loader的流程
- 從class被加載到JVM的memory中，到釋放內存總共有七個步驟：加載，驗證，準備，解釋，初次化，使用，卸載。其中驗證，準備，解釋三個部份統稱為連接。

2.1.1 加載
1. 將Class文件加載到Memory
2. 將static數據結構轉化成方法區中運行時的數據結構
3. 在堆中新城一個代表這個類的java.lang.Class對象作為數據訪問的入口

2.1.2 連接
1. 驗證：確保加在的裏符合jvm規範和安全，保證被教驗類嘅方法在運行時不會做出危害jvm的事件，其實就是一個安全檢查
2. 準備：為Static變量在方法區中分配內存空間，設置變量的初次值，例如static int a = 3(注意：準備階段指設置類中的靜態變量（ 方法區中)，不包括實例變量（堆內存中），實際變量是對象化初始化負賦值的）
3. 解析，虛擬機將常量池的符號引用替換為直接引用的過程（符號引用，例如import java.util.ArrayList, 直接引用就是指針或者對象地址，注意引用對象一定是在內存進行的） 

2.1.3 初始化
是執行類構造器方法`<clinit>()`的過程，而且要保證執行前父類的`<clinit>()`方法執行完畢。呢個方法由編譯器收集，順序執行所有類別量顯色初始化和靜態代碼block中預句。
此時準備階段的那個static int a 有默認初始化的0變成了顯色化的3. 
由於執行順序的緣故，初始化階段類變亮如果在靜態代碼快中又進行了更改，回覆蓋類便量的顯色初始化，最終會為靜態代碼中的負值

2.1.4 卸載
CC將無用對象從內存中卸載

2.2 ClassLoader的加載順序
加在一個class裏的順序也是有優先的，雷家在從最底層開始往上的順序是這樣的：
1. BootStrap ClassLoader: rt.jar
2. Extension ClassLoader: 加在擴展的jar包 
3. App ClassLoader: 指定的classpath下面的jar包
4. Custom ClassLoader: 自定義的類加載器

2.3 雙親委派機制
- 當一個class收到了加載請求時，他是不會先自己去嘗試加載的，而是委派給Parent ClassLoader去完成。
- 比如我現在要new一個Person，這個Person是我們自定義的類，如果我們要加載它，就會先委派給App ClassLoader，只有當父類加載器都返繪自己無法完成這個請求（也就是Parent ClassLoader都沒有找到加載所需的class時，Child加載器才會自行嘗試加載

- 這樣做的好處是, 加載位於rt.jar包中的類時，不管是那個classLoader加載，最終都會委託到BootStrap ClassLoader進行加載
，保證了使用不同的類加載器得到的都是同一個結果。
- 其實這個也是一個隔離作用，避免了我們的代碼影響了JK的代碼，比如我現在自定義一個`java.lang.String`，裡面有一個`main()`
    ```java
    package java.lang;
    public class String {
        public static void main(String[] args) {
            System.out.println();
        }
    }
    ```
- 當嘗試運行時，我們的代碼肯定會報錯，因為在loading的時候是找到了rt.jar中的`java.lang.String`

三，Runtime Data Areas
- 比如Thread Class，它的starto方法帶有一個native修飾，而且不存在method body，這些是本地方法，使用C方法來實現的，一般這些方法都會放到本地方法棧的區域
- Program Counter: 是一個指針，指向了程序中下一句需要執行的指令，它也是memory區域中唯一一個不會出現OutOfMemoryError的區域，而且佔用內存空間小到基本可以忽略不計。
- 僅代表當前thread所執行的byte的行號指示器, byte解析器通過改變這個counter的值選取下一條需要執行的byte指令
- 如果執行的是native方法，這個指針就不會工作了。

### JVM

#### Default Heap Allocation
- 1/4 of memory for heap allocation by default


```bash
sh-5.1$ java -XshowSettings:vm -version
Picked up JAVA_TOOL_OPTIONS: -javaagent:/opt/addons/apm-agent.jar -Xms256m -Xmx1344m -XX:MinHeapFreeRatio=20 -XX:MaxHeapFreeRatio=40
VM settings:
    Max. Heap Size (Estimated): 1.27G
    Using VM: OpenJDK 64-Bit Server VM

openjdk version "21.0.6" 2025-01-21 LTS
OpenJDK Runtime Environment (Red_Hat-21.0.6.0.7-1) (build 21.0.6+7-LTS)
OpenJDK 64-Bit Server VM (Red_Hat-21.0.6.0.7-1) (build 21.0.6+7-LTS, mixed mode, sharing)

```

#### Max. Heap Size
```bash
sh-5.1$ java -XX:+PrintFlagsFinal -version

Picked up JAVA_TOOL_OPTIONS: -javaagent:/opt/addons/apm-agent.jar -Xms256m -Xmx1344m -XX:MinHeapFreeRatio=20 -XX:MaxHeapFreeRatio=40
[Global flags]
size_t MaxHeapSize                              = 1409286144                                {product} {command line}

```

#### How to set JVM Heap Size
- It is always recommended to set 70% of total container memory been allocated of heap usage
- e.g. Default 1024MB in memory
  - JVM Heap Setting(70%) `-Xms716m -Xmx716m`

#### How to set JVM Non-Heap Size(Metaspace)
- JVM is the native application, and it also needs memory to maintain its internal data structures that represent application code, generated machine code, heap metadata, class metadata, internal profiling, etc. This is not accounted in Java heap, because most of those things are native, allocated in C heap, or mmap-ed to memory. JVM also prepares lots of things expecting the active long-running application with decent number of classes loaded, enough generated code created at runtime, etc.
- e.g. Default 1024MB in memory
  - JVM Heap Setting(70%) `-Xms716m -Xmx716m`
  - Non-Heap Setting(30%) `-XX:MaxMetaSpaceSize=307m`

#### Heap Dump JVM Setting
`-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/oom.bin`

#### How to take Heap Dump manually
1. Identify the Applications' PID
```bash
# To identify the Application PID
> ps -ef | grep java 

```

2. Generate Heap Dump
```bash
# jmap -dump:live,format=b,file=/tmp/heap_dump-<file_name>.bin <process_id>
> jmap -dump:live,format=b,file=/tmp/heap-dump-ms-task.bin 15
```

#### How to take Heap Histogram manually 
1. Identify the Applications' PID
```bash
# To identify the Application PID
> ps -ef | grep java 

```

2. Generate Heap Histogram
```bash
# jmap -histo:live <process_id> > /tmp/heap_histo.txt 
> jmap -histo:live 15 > /tmp/heap_histo.txt
```

#### Default GC Policy
-XX:+UseSerialGC

```bash
sh-5.1$ java -XX:+PrintCommandLineFlags -version
Picked up JAVA_TOOL_OPTIONS: -javaagent:/opt/addons/apm-agent.jar -Xms256m -Xmx1344m -XX:MinHeapFreeRatio=20 -XX:MaxHeapFreeRatio=40
-XX:InitialHeapSize=268435456 -XX:MaxHeapFreeRatio=40 -XX:MaxHeapSize=1409286144 -XX:MinHeapFreeRatio=20 -XX:MinHeapSize=268435456 -XX:+PrintCommandLineFlags -XX:ReservedCodeCacheSize=251658240 -XX:+SegmentedCodeCache -XX:+UseCompressedOops -XX:+UseSerialGC 
openjdk version "21.0.6" 2025-01-21 LTS
OpenJDK Runtime Environment (Red_Hat-21.0.6.0.7-1) (build 21.0.6+7-LTS)
OpenJDK 64-Bit Server VM (Red_Hat-21.0.6.0.7-1) (build 21.0.6+7-LTS, mixed mode, sharing)
```

#### How to take Heap Dump/Thread Dump manually using Spring Boot Actuator
1. application.properties
```bash
management.endpoints.web.exposure.include=heapdump
management.endpoints.web.exposure.include=threaddump
```

2. Go to Git Bash terminal
```bash
curl -k 'https://<MS Route URL>/actuator/heapdump' -O
curl -k 'https://<MS Route URL>/actuator/threaddump' -i -X GET -H 'Accept: text/plain' > threaddump.txt
```

### OutOfMemoryError
- `java.lang.OutOfMemoryError` exception is thrown when there is insufficient space to allocate an object in the Java heap
- The GC cannot make space available to accommodate a new object, and the heap cannot be expanded further
- Also, it may be thrown when there is insufficient native memory to support the loading of a Java class


##### Reference
1. Heap and Stack: https://nus-cs2030s.github.io/2324-s2/10-heap-stack.html#__tabbed_1_3