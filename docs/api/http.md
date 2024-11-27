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

## HTTPS
HTTPS mitigates the risk of information  leakage by incorporating TLS or SSL to encrypt messages.

What are the differences between HTTP and HTTPS?
1. Establishing an HTTP connection is straightforward, but HTTPS requires an SSL/TLS handshake after the TCP 3-way handshake before encrypted messages can be transmitted.
2. The default port for HTTP is 80, while for HTTPS it’s 443.
3. HTTPS requires a digital certificate from a CA (Certificate Authority) to verify the server’s trustworthiness.

## How does HTTPS works?

1. The client (browser) and the server establish a TCP connection.
2. The client sends a “client hello” to the server. The message contains a set of necessary encryption algorithms (cipher suites) and the highest TLS version it can support. The server responds with a “server hello”, confirming compatibility with the algorithms and TLS version.
- The server then sends its SSL certificate to the client for validation. The certificate contains the public key, hostname, expiry dates, etc.
3. After validating the SSL certificate, the client generates a session key, encrypts it using the public key, and sends it to the server. The server receives the encrypted session key and decrypts it using its private key. 
4. Now that both the client and the server possess the same session key (symmetric encryption), they can securely exchange encrypted data in a bi-directional channel.

