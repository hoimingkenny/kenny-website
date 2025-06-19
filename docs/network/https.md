# HTTPS

## Baisc
- Use TLS or SSL to encrypt messages

## What are the differences between HTTP and HTTPS?
1. Establishing an HTTP connection is straightforward, but HTTPS requires an **SSL/TLS handshake after the TCP 3-way handshake** before encrypted messages can be transmitted
2. The default port for HTTP is 80, while for HTTPS it’s 443
3. HTTPS requires a digital certificate from a CA (Certificate Authority) to verify the server’s trustworthiness

## How does HTTPS works?
1. The client (browser) and the server establish a TCP connection.
2. The client sends a “client hello” to the server. The message contains a set of necessary encryption algorithms (cipher suites) and the highest TLS version it can support. The server responds with a “server hello”, confirming compatibility with the algorithms and TLS version.
   - The server then sends its SSL certificate to the client for validation. The certificate contains the public key, hostname, expiry dates, etc.
3. After validating the SSL certificate, the client **generates a session key, encrypts it using the public key**, and sends it to the server. The server receives the encrypted session key and decrypts it using its private key.
4. Now that both the client and the server possess the same session key (symmetric encryption), they can securely exchange encrypted data in a bi-directional channel.

## What is an SSL certificate?
- A data file hosted in a website's origin server
   - contain the website's **public key** and the website's **identity**
- Devices attempting to communicate with the origin server will reference this file to obtain the public key and verify the server's identity. The private key is kept secret and secure

## Why do websites need an SSL certificate?
- In order to keep user data secure, **verify ownership of the website**, prevent attackers from creating a fake version of the site.

**Encryption:** SSL/TLS encryption is possible because of the public-private key pairing that SSL certificates facilitate. Clients (such as web browsers) get the public key necessary to open a TLS connection from a server's SSL certificate

**Authentication:** SSL certificates verify that a client is talking to the correct server that actually owns the domain. This helps prevent domain spoofing and other kinds of attacks

**HTTPS:** HTTPS is the secure form of HTTP, and HTTPS websites are websites that have their traffic encrypted by SSL/TLS

## CORS
1. Allow servers to specify which origins are allowed to access them.