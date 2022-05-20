# Server

[![CI](https://github.com/morya-111/server/actions/workflows/CI.yml/badge.svg?branch=main)](https://github.com/morya-111/server/actions/workflows/CI.yml)
[![codecov](https://codecov.io/gh/morya-111/server/branch/main/graph/badge.svg?token=AL2UQA6DDR)](https://codecov.io/gh/morya-111/server)

# API Reference

### User Routes

- **DELETE** `/v1/user/deleteuser` - Deletes The User And logs out.

- **PUT** `/v1/user/updateuser` - send any of -
  `{first_name, last_name, password, avatarUrl}` and it will return -
  ```
  {
      "message": "success",
      "changedFields": [
        "password"
      ],
      "data": {
          "newUser": {
              "id": 1,
              "first_name": "Q",
              "last_name": "W",
              "email": "4@4.com",
              "avatarUrl": "https://i.ibb.co/rt9TSY7/8740db0e7e05.png",
              "role": "INDIVIDUAL"
          }
      }
  }
  ```

### Book Routes

- **GET** `/v1/books` - Get All Books

  Query Param `?s=searchInName` : search book by search term

  Pagination [Enabled](https://github.com/rjlopezdev/typeorm-express-query-builder#available-lookups)

- **GET** `/v1/books/:id` - Get Book By Id
  Response Codes

  - `200` - Book of corresponding id found
  - `404` - Book of the id not found / id is invalid(id is not int)

- **POST** `/v1/books/newBook` - Post A new Book
- [login required] **GET** `/v1/books/mybooks` - Gets all the books posted by the logged in user.

### Language Routes

- **GET** `/v1/languages` - Get All Languages
  Ordering [Enabled](https://github.com/rjlopezdev/typeorm-express-query-builder#available-lookups)

### Auth Routes

- **POST** `/v1/user/register` - Register a user

  Request Body

  ```ts
  {
      first_name : string;
      last_name : string;
      email : string;
      password : string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
  }
  ```

  Response Codes

  - `400` - Validation Error
  - `409` - Email / User already exists
  - `200` - User created successfully

- **POST** `/v1/user/login` - Login a user

  Request Body

  ```ts
  {
    email: string;
    password: string;
  }
  ```

  Response Codes

  - `400` - Email and password is required
  - `403` - Email is associated with social login
  - `401` - Incorrect email or password
  - `200` - User logged in successfully

- **POST** `/v1/user/logout` - Logout the current user

- **GET** `/v1/user/isloggedin` - Checks if the current user is logged in

  - `401` - You are not logged in / User does not exist / You don't have permission to access this resource.
  - `200` - User logged in. User data returned

- **GET** `/v1/auth/google` - Login with google

- **GET** `/v1/auth/facebook` - Login with facebook

### Chat Routes

- [login required] **GET** `/v1/chats/:userId` - Get all chats of logged in user with the supplied userId in params.

  Pagination,Ordering  [Enabled](https://github.com/rjlopezdev/typeorm-express-query-builder#available-lookups)

- [login required] **GET** `/v1/chats/users` - Get all users with whom the logged in user has chatted.
---

## Socket Docs

> :warning: Socket has no error handling yet will be added later. So make sure proper payload is sent. 

- Socket Connection Initiation
  
  Auto Connect should be false so that client can connect with auth userId.
  ```
  const socket = io(URL, { autoConnect: false });
  ```
- Socket Connect
  ```
  socket.auth = { userId :1 };
  socket.connect(); 
  ```

### Client Events
- `message:send` : Send Chat Message to another user
  
  Payload
  ```
  {
    to: number;
    message: string;
    bookId?: number;
  }
  ```
### Server Events
- `message:receive` : Listen to this event to get the chat message from the server. This will give you even the message you sent directly so don't use the own client for this.

  Response
  ```json
  [
  {
    "message": "<<1>> started a conversation with <<2>> for this book, click to know more!",
    "type": "EMBEDDED",
    "book": {
      "id": 10
    },
    "room": {
      "id": 1
    },
    "sender": {
      "id": 1
    },
    "id": 15,
    "createdDate": "2022-05-17T21:39:49.079Z",
    "updatedDate": "2022-05-17T21:39:49.079Z"
  },
  {
    "message": "This is a test msg",
    "book": {
      "id": 10
    },
    "room": {
      "id": 1,
      "createdDate": "2022-05-15T16:27:23.575Z",
      "updatedDate": "2022-05-15T16:27:23.575Z"
    },
    "sender": {
      "id": 1
    },
    "id": 16,
    "type": "NORMAL",
    "createdDate": "2022-05-17T21:39:49.088Z",
    "updatedDate": "2022-05-17T21:39:49.088Z"
  }
  ]
  ```

---

## Developer Notes

- `protected` - protected is a thunk function which returns a protected middleware. This is used to protect routes and give access to logged in users and users with specified roles.

  Arguments

  ```
  roles?: ["INDIVIDUAL" , "SHOP_OWNER" , "ADMIN"]
  ```

  Response Codes
  `401` - Not Logged In , User does not exist , Doesn't have permission

  Example:-

  ```ts
  // Only looks if user is logged in
  app.get("/v1/loginprotected", protect(), (_, res) => {
    res.status(200).json({ status: "success" });
  });

  // Looks if user is logged in and has specified roles in this case "ADMIN"
  app.get("/v1/roleprotected", protect(["ADMIN"]), (_, res) => {
    res.status(200).json({ status: "success" });
  });
  ```

- OAuth Client redirect url and path
  > Set `FRONTEND_CLIENT` env variable to frontend clients host url
  >
  > Set `SUCCESS_ROUTE` env variable to path to which the user should be redirected on OAuth success.
  >
  > Set `FAILURE_ROUTE` env variable to path to which user should be redirected on OAuth failure.

<img src="./er-diagram.svg" />
