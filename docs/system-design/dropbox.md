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
### Upload Files
    - For metadata, we can use a NoSQL database like DynamoDB.

    :::danger Bad Solution: Uploading file to single server
      1. Not scalable, need to add more storage to servers when the number of files grows.
      2. Not reliable, if a server is down, we lose access to all of the files.
    :::

    :::warning Good Solution: Storage File in Blob Storage
      1. We send the file to a Blob Storage like Amazon S3, Google Cloud Storage and store the metadata in our database.

      2. Challenge 1: Either metadata or file is lost
          1. Handle the case where the file is uploaded but the metadata is not stored.
          2. Or the metadata is stored but the file is not uploaded.
          3. Solution: Only save the metadata if the file is uploaded successfully.
      3. Challenge 2: Redundant upload
          1. Once to our backend, once to the cloud storage.
          2. Solution: To allow user to upload the file directly to the Blob Storage Service.
    :::

    :::tip Great Solution
      1. To allow user to upload the file directly to the Blob Storage Service.
      2. We can use presigned URLs to generate a URL that the user can use to upload the file.
      3. Once the file is uploaded, the Blob storage service will send us a notification to our backend so we can save metadata.

      - <Term2>Presigned URLs</Term2>: URLs that give the user permission to upload a file to a specific location in the Blob storage service.

      - Three step process:
        1. Request a presigned URL from the backend (which itself get the URL from the Blob storage service like S3) and save the file metadata on our database with a status of "uploading".
        2. Use the presigned URL to upload the file to the Blob storage service. This is via a PUT request directly to the presigned URL where the file is the body of the request.
        3. Once the file is uploaded, the Blob storage service will send us a notification to our backend. Our backend will update the file metadata in our database with a status of "uploaded".
    :::

### Download File

### Share File with Others

### Automatically Sync Files across Devices