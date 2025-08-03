# Foundation

## TCP/IP Model
為什麼需要TCP/IP Model？
不同設備上進程之間的通信，需要Network communication，而設備是多樣性的，要compatible with不同設備，就協商了一套通用的網絡協議。

I. Application Layer
- 傳輸單位: message
- The top layer，就是我們平時直接接觸到的，Our computer or mobile phone的application都是在應用層中實現的。 那麼，當兩個不同設備的application需要通信的時侯，application就把data傳給下一層，也就是傳輸層。
- 只需要專注於為用戶提供應用功能，比如HTTP、FTP、Telnet、DNS、SMTP等。
- 應用層是不需要關心data是如何傳輸的，類似於寄速遞，只需要將Package交到速遞員，由他負責運輸，我們不需要關心運輸過程 。
- 而且應用層是工作在Operation System的User Mode，傳輸層及以下則工作在Kernel Mode。

II. Transport Layer
- Transmission: segment
- Application Layer的data會傳給傳。Transport Layer是為應用層提供網絡支持的，但不會負責將data從一個設備傳輸到另一個設備。
- 有兩個傳輸協議，分別是TCP和UDP。
- TCP (Transmission Control Protocol)
  1. Is used by most applications, such as the HTTP protocol. 
  2. Compared to UDP, TCP includes features like flow control, timeout retransmission, and congestion control to ensure reliable data packet delivery to the recipient.

- UDP只負責發送數據包，不保證數據包是否抵達對方，但它實時性相對更好，傳輸效率也更高。UDP也可以實現可靠傳輸，但需要把TCP的特性在應用層上實現。
- 當data非常大，如果直接傳輸就不好控制，因此當傳輸層的data大小超過MSS（TCP max. message段長度），就要將數據包分塊，這樣即使中途有一個分塊丢失或損壞了，只需要重新發送這一個block，而不用重新發送整個數據包。在TCP中，每個block稱為一個TCP Segment。
- 當設備作為接收方時，傳輸層則要把數據包傳給應用，但是一台設備上可能會有很多應用在接收或傳輸數據，因為需要用Port將應用區分開來。
- 比如80通常是Web Service用的，22通常是Remote登錄server用的。而對於browser(client)中的每一個標簽欄都是一個獨立的process，OS會為這些process分配臨時的port。
- 傳輸層的message中會帶上port，因此接收方可以識別出這message是發送給那個應用。

III. Network Layer
- 傳輸單位: packet
- 最常使用的是IP (Internet Protocol)，IP協議會將Transport Layer的message作為它的data部份，再加上IP包Header組裝成message，如果IP message大小超過MTU(Ethernet通常是1500Bytes)，IP層會將其分段。
- 一般用IP地址給設備進分編號，對于IPv4協議，IP地址共32位，分成了4段(比如: 192.168.100.1)，每段是8位。雖然一個IP地址做到了區分設備，但是Address search就會很麻煩。
- 因為需要將IP地址分成兩種意義：
  - 一個是Network ID: 負責標識該IP地址是屬於那個子網的
  - 另一個是Host ID: 負責標識同一子網下的不同主機
- 需要用Subnet Mask才能計算出IP地址的NID及HID
- 例如10.100.122.0/24，後面的/24表示255.255.255.0的Subnet Mask，二進制就是 11111111-11111111-11111111-00000000，共24個1，為了簡化用`/24`作代表。
- 例如IP地址: 10.100.122.2，Subnet Mask: 255.255.255.0，兩者做AND運算，就可以得到Network Address: 10.100.122.0。
- 在尋址過程中，先match到相同的network address（表示是找到同一個subnet），才會找對應的host。
- 除了尋址能力，IP協議還有另一個種要能力就是路由。實際場景中，兩台設備中間要通過很多Gateway、Router、交換機等眾多網絡設護，那麼就會產生很多path，因此當數據包到達一個node，就需要路由算法去決定下一步走那條path。
- 路由尋址的工作中，就是要找到目標地址的子網，找到後再將數據包發給對應的網絡。
- 所以，IP協議的尋址作用是告訴我們去往下一個目的地該朝那個方向走，路由則是根據Next destination來選擇路徑。尋址更像是Navigation，路由則像是Steering。

IV. Data Link Layer
- 傳輸單位: frame
- 生成了IP Header之後，接下來要交給Link Layer在IP Header前面加上MAC Header，并封裝成Data frame發送到網絡上。
- IP Header中的接收方IP地址表示網絡包的目的地，通過這個地址我們就可以判斷要將包發到哪裡，但不能在Ethernet的世界應用這個思路。
- 以太網由以太網接口，WiFi接口，以太網交換機，路由器上的Gigabit Ethernet網口組成。是一種在局域網內，把附近的設備連接起來，使它們之間可以進行通訊。
- 以太網在判斷網絡包目的地時和IP的方式不同，因為必須采用MAC Header。
- MAC Header是以太網使用的Header，它包含了接收方和發送方的MAC地址等信息，可以通過APR協議獲取對方的MAC地址。
- 主要為網絡層提供鏈路級的服務，負責在以太網、WiFi這樣的底層網絡上發送原始包，工作在網卡這個層次，使用MAC地址來標識網絡上的設備。

V. Summary
![Data Message](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost3@main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/%E6%B5%AE%E7%82%B9/%E5%B0%81%E8%A3%85.png)


##### Reference
1. XiaoLinCoding: https://xiaolincoding.com/network/1_base/tcp_ip_model.html