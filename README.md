## Description

```
Requirement: https://gist.github.com/gerukin/3233e6cfeb21fc56015ad6079d9e8743?fbclid=IwAR1jOmEuq_6GnL3KTTQEkTjQLHSMBD5a4ybA2Se3K66XuV3k7IjMl7RHgno
This is a newly developed demo after 3 days of research.
Total implementation time is 32 hours. Thank you for your time.

Video demo: https://drive.google.com/file/d/1oQWjb89qu4_GxyTkFQiAFAzIz2E_aQmg/view?usp=sharing


Node v18.15.0
NestJS v10.3.2
PostgreSQL v15.3
Docker v4.7.0
```

## Config
```bash
$ Create ".env"
```

```
ENV=local
JWT_SECRET=ABC123456_III
JWT_TIMEOUT=30

DATABASE_HOST=demo-db
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=demo_db
```
```bash
$ Create "pgdata" folder to save postgreSQL data
```



## Installation & Running the app

```bash
# Run to init local envrionment
$ docker compose up -d

# Run to init local envrionment - debug mod
$ docker compose up

# Run migration
$ npm run migration:run
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Command line to development

```bash
# create new migrate file
$ npm run migration:create --name=$filename

# migration
$ npm run migration:run

# Add new module
$ nestjs g module modules/user

# Add new controller
$ nestjs g controller modules/user

# Add new service
$ nestjs g service modules/user
```

## API to resolve for socket about processing timeout to faster more

#### 1. POST /user/signup-with-nickname
#### 2. POST /rooms/create
#### 3. GET /rooms
#### 4. POST /rooms/update
#### 5. POST /rooms/join
#### 6. GET /rooms/detail
#### 7. POST /rooms/remove
#### 8. GET /messages?room_id=207
#### 9. POST /messages/update

## Socket.IO

```
Host: ws://localhost:3001
Event type: message|event

Client connect: socket.html
Message format:

{
    "request_id": {requestId},
    "room_id": {roomId},
    "message": {messageText},
    "type": {type}
}

Postman:
-> Open & choose "Create new"
-> Websocket request
-> Change request option "Raw" to "Socket.IO"
-> Set URL ws://localhost:3001
-> Set header Authorization: Bearer {{access_token}}
```

## Set header after signup
```
# API
Authorization: Bearer {{access_token}}

# Socket.IO - client
const socket = io('http://localhost:3001', {
  transports: ['websocket','polling'],
  auth: {
    token: `Bearer ${token}`
  }
});
```

## API detail
#### 1. POST /user/signup-with-nickname
```
{
    "nickname": "chipm"
}
```
#### 2. POST /rooms/create
```
{
    "room_name": "room test"
}
```

#### 3. GET /rooms
```
/rooms
/rooms?page=2
```


#### 4. POST /rooms/update
```
{
    "room_name": "room test rename",
    "room_id": 1
}
```

#### 5. POST /rooms/join
```
{
    "room_id": 1
}
```

#### 6. GET /rooms/detail
```
/rooms/detail/1
/rooms/detail/1?page=2
```

#### 7. POST /rooms/remove
```
{
    "room_id": 1
}
```

#### 8. GET /messages?room_id=207
```
/messages?room_id=1
/messages?room_id=1&page=2
```

#### 9. POST /messages/update
```
{
    "message_id": 1,
    "message": "test update message",
    "room_id": 1
}
```


