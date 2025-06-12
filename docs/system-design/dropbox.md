import Highlight from '@site/src/components/Highlight'
import Warn from '@site/src/components/Warn'
import Term from '@site/src/components/Term'
import Term2 from '@site/src/components/Term2'


# Dropbox

## Requirements
### Functional Requirements
1. Users should be able to upload a file from any device.
2. Users should be able to download a file from any device
3. Users should be able to share a file with other users and view the files shared with them.

### Non-Functional Requirements
1. The system should be highly available (prioritizing availability over consistency).
2. The system should support files as large as 50GB.
3. The system should be secure and reliable. We should be able to recover files if they are lost or corrupted.
4. The system should make upload, download, and sync times as fast as possible (low latency).

## The Set Up
### Defining the Core Entities
1. User
2. File: raw data.
3. FileMetadata: Include file name, size, the user who uploaded it.

### API or System Interface
1. Upload
```java
POST /files
Request:
{
    File,
    FileMetadata
}
```

2. Download
```java
GET /files/{fileId} -> File & FileMetadata
```

3. Share
```java
POST /files/{fileId}/share
Request:
{
  User[] // The users to share the file with
}
```

## High-Level Design
1. Users should be able to upload a file from any device
    - For metadata, we can use a NoSQL database like DynamoDB.
    