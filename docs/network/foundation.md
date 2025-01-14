# Foundation

## TCP/IP Model
為什麼需要TCP/IP Model？
不同設備上進程之間的通信，需要Network communication，而設備是多樣性的，要compatible with不同設備，就協商了一套通用的網絡協議。

### Application Layer
- The top layer，就是我們平時直接接觸到的，Our computer or mobile phone的application都是在應用層中實現的。 那麼，當兩個不同設備的application需要通信的時侯，application就把data傳給下一層，也就是傳輸層。
- 只需要專注於為用戶提供應用功能，比如HTTP、FTP、Telnet、DNS、SMTP等。
- 應用層是不需要關心data是如何傳輸的，類似於寄速遞，只需要將Package交到速遞員，由他負責運輸，我們不需要關心運輸過程 。
- 而且應用層是工作在Operation System的User Mode，傳輸層及以下則工作在Kernel Mode。

### Transport Layer
- Application Layer的data會傳給傳輸層，Transport Layer是為應用層提供網絡支持的。
- 有兩個傳輸協議，分別是TCP和UDP。
- TCP的全稱叫Transmission Control Protocol，大部份應用使用的正是TCP，比如HTTP應用層協議。TCP相比UDP多了很多特性，比如流量控制、超時重傳、拥塞控制等，這些都是為了保證數據包能可靠地傳送給對方。


### 網絡層

### 網絡接口層