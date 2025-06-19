# HTTP

## Basic
- Stateless: does not maintain information about previous requests
- Not secure in transmitting data
- No data integrity check

## HTTP Fields
1. Host: Domain name of the server
2. Content-Length: indicates the size of the body of the request or response in bytes. This helps the receiver understand when the current message ends and potentially prepare for the next one, especially in cases where multiple HTTP messages are being sent over the same connection.
3. Connection: This field is crucial in HTTP persistent connections, where a single TCP connection is used to send and receive multiple HTTP requests and responses
4. Content-type: format of the data
5. Content-encoding: compression format used for the data. For example, if the client sees ‘gzip’ encoding, it knows it needs to decompress the data

## HTTP GET vs HTTP POST
- HTTP GET: Usually lack a payload body
- HTTP POST: This methods interacts with resources based on payload body

## Understanding the Characteristics of GET and POST
- HTTP GET: retrieves data without causing changes, making it non-mutating
- HTTP POST: sends data that can modify server sources

BUT standards suggest above behaviors, developers sometimes use these methods in non-standard ways

Neither GET nor POST is inherently secure. GET parameters are visible in the URL, while POST bodies can be intercepted if not encrypted. To ensure secure data transmission, the use of HTTPS is advised

## HTTP vs HTTPS
### Differences between HTTP and HTTPS
- HTTP是超文本傳輸協議，信息是明文傳輸，存在data security的問題。HTTPS解決了HTTP不安全的缺陷，在TCP和HTTP網絡層之間加入了SSL/TLS安全協議，使得報文能夠加密傳輸。
- HTTP連接建立相對簡單，TCP三次握手後便可以進行HTTP的Request Message傳輸，而HTTPS在TCP三次握手之後，還需要SSL/TLS的握手過程，才可進入Request Message傳輸。

## HTTP Status Code
1. 1xx: Informational
    - 100: Continue, 101: Switching Protocols
2. 2xx: Success
    - 200: OK, 201: Created, 202: Accepted, 204: No Content
3. 3xx: Redirection
    - 300: Multiple Choices, 301: Moved Permanently, 302: Found, 303: See Other, 307: Temporary Redirect, 308: Permanent Redirect
4. 4xx: Client Error
    - 400: Bad Request, 401: Unauthorized, 403: Forbidden, 404: Not Found, 405: Method Not Allowed, 406: Not Acceptable, 408: Request Timeout
5. 5xx: Server Error
    - 500: Internal Server Error, 502: Bad Gateway, 503: Service Unavailable, 504: Gateway Timeout

## HTTP Method
1. GET: Retrieve a resource.
2. POST: Create a resource.
3. PUT: Update an entire resource. If it doesn't exist, it creates a new resource.
4. PATCH: Partially update a resource.
5. DELETE: Delete a resource.