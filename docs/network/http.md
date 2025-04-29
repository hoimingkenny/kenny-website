# HTTP

## HTTP Headers
Provided structured way for clients and servers to communicate important metadata about request and response.

## HTTP Fields
1. Host: Domain name of the server
2. Content-Length: indicates the size of the body of the request or response in bytes. This helps the receiver understand when the current message ends and potentially prepare for the next one, especially in cases where multiple HTTP messages are being sent over the same connection.
3. Connection: This field is crucial in HTTP persistent connections, where a single TCP connection is used to send and receive multiple HTTP requests and responses
4. Content-type: This field tells the client the format of the data it’s receiving.
5. Content-encoding: This field indicates the compression format used for the data. For example, if the client sees ‘gzip’ encoding, it knows it needs to decompress the data.

## HTTP GET vs HTTP POST
- HTTP GET: Usually lack a payload body.
- HTTP POST: This methods interacts with resources based on payload body.

## Understanding the Characteristics of GET and POST
- HTTP GET: retrieves data without causing changes, making it non-mutating.
- HTTP POST: sends data that can modify server sources

BUT standards suggest above behaviors, developers sometimes use these methods in non-standard ways.

Neither GET nor POST is inherently secure. GET parameters are visible in the URL, while POST bodies can be intercepted if not encrypted. To ensure secure data transmission, the use of HTTPS is advised.

## HTTP vs HTTPS
### Differences between HTTP and HTTPS
- HTTP是超文本傳輸協議，信息是明文傳輸，存在data security的問題。HTTPS解決了HTTP不安全的缺陷，在TCP和HTTP網絡層之間加入了SSL/TLS安全協議，使得報文能夠加密傳輸。
- HTTP連接建立相對簡單，TCP三次握手後便可以進行HTTP的Request Message傳輸，而HTTPS在TCP三次握手之後，還需要SSL/TLS的握手過程，才可進入Request Message傳輸。
