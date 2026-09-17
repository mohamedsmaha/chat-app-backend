# 💬 Real-Time Chat Backend

A **real-time one-to-one chat backend** built with **NestJS**, **MongoDB**, **Mongoose**, and **Socket.IO**.

The application provides a modular backend architecture supporting REST APIs, real-time WebSocket communication, JWT authentication, conversations, messaging, online presence, and email services.

---

## 🚀 Features

* 🔐 User registration & authentication
* 🎟️ JWT Access & Refresh Tokens
* 👤 User search
* 💬 One-to-one conversations
* ⚡ Real-time messaging with Socket.IO
* 📬 Message delivery status
* 🟢 Online / offline status
* ✍️ Typing indicators
* 🗂️ Conversation management
* 📧 Gmail SMTP email service
* 📄 Cursor-based pagination
* 🛡️ Authentication guards & validation
* 🐳 Docker & Docker Compose support
* 🍃 MongoDB with Mongoose ODM
* 🔌 REST API + WebSocket architecture

---

## 🛠️ Tech Stack

| Technology     | Purpose                 |
| -------------- | ----------------------- |
| **NestJS**     | Backend framework       |
| **TypeScript** | Programming language    |
| **MongoDB**    | Database                |
| **Mongoose**   | MongoDB ODM             |
| **Socket.IO**  | Real-time communication |
| **JWT**        | Authentication          |
| **Gmail SMTP** | Email delivery          |
| **Docker**     | Containerization        |

---

# 📋 Table of Contents

* [Setup](#-setup)
* [Environment Variables](#-environment-variables)
* [Email Configuration](#-email-configuration)
* [Running MongoDB](#-running-mongodb)
* [Running the Backend](#-running-the-backend)
* [Docker](#-docker)
* [Architecture](#-architecture)
* [Backend Structure](#-backend-structure)
* [Database Design](#-database-design)
* [Authentication](#-authentication)
* [WebSocket Architecture](#-websocket-architecture)
* [WebSocket Events](#-websocket-events)
* [Online Status](#-online-status)
* [Typing Indicators](#-typing-indicators)
* [Message Delivery](#-message-delivery)
* [Pagination](#-pagination)
* [Technical Decisions](#-technical-decisions)
* [Project Structure](#-project-structure)
* [Application Flow](#-application-flow)

---

# ⚙️ Setup

## Requirements

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* npm
* [MongoDB](https://www.mongodb.com/)
* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com/) *(optional)*

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/mohamedsmaha/chat-app-backend.git

cd chat-app-backend
```

Install dependencies:

```bash
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root.

Example:

```env
MONGODB_URI=mongodb://localhost:27017/chat

DOMAIN=http://localhost:3000

PORT=3000

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-gmail-app-password
MAIL_FROM=your-email@gmail.com

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRES_IN=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d

NODE_ENV=development

SERVER_MODE=local

FRONTEND_URL=http://127.0.0.1:5500/
```

## Environment Variables Reference

| Variable                   | Description                  | Example                          |
| -------------------------- | ---------------------------- | -------------------------------- |
| `MONGODB_URI`              | MongoDB connection string    | `mongodb://localhost:27017/chat` |
| `DOMAIN`                   | Backend application domain   | `http://localhost:3000`          |
| `PORT`                     | Backend port                 | `3000`                           |
| `MAIL_HOST`                | SMTP server                  | `smtp.gmail.com`                 |
| `MAIL_PORT`                | SMTP port                    | `587`                            |
| `MAIL_USER`                | Gmail account                | `your-email@gmail.com`           |
| `MAIL_PASS`                | Gmail App Password           | `your-gmail-app-password`        |
| `MAIL_FROM`                | Sender email                 | `your-email@gmail.com`           |
| `ACCESS_TOKEN_SECRET`      | Access JWT signing secret    | `your_access_token_secret`       |
| `ACCESS_TOKEN_EXPIRES_IN`  | Access token lifetime        | `1d`                             |
| `REFRESH_TOKEN_SECRET`     | Refresh JWT signing secret   | `your_refresh_token_secret`      |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token lifetime       | `7d`                             |
| `NODE_ENV`                 | Application environment      | `development`                    |
| `SERVER_MODE`              | Server/network configuration | `local`                          |
| `FRONTEND_URL`             | Allowed frontend origin      | `http://127.0.0.1:5500/`         |

---

# 📧 Email Configuration

The application uses **Gmail SMTP** for sending emails.

No external email delivery provider such as SendGrid, Mailgun, or Amazon SES is required.

## Gmail SMTP

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-gmail-app-password
MAIL_FROM=your-email@gmail.com
```

## Gmail App Password

The application uses a **Gmail App Password** instead of the normal Gmail account password.

Before creating an App Password:

1. Enable **2-Step Verification** on the Gmail account.
2. Create a Gmail App Password.
3. Add the generated password to `.env`.

```env
MAIL_PASS=your-gmail-app-password
```

> ⚠️ Never use your normal Gmail password in the application.

### Security

Never commit secrets to Git.

Add the following to `.gitignore`:

```gitignore
.env
```

Never expose:

```text
MAIL_PASS
ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET
```

---

# 🌍 NODE_ENV

The application supports:

```text
development
production
test
```

For local development:

```env
NODE_ENV=development
```

---

# 🌐 SERVER_MODE

The application supports different deployment configurations.

### Local

Used during local development:

```env
SERVER_MODE=local
```

### Same Server

Used when the frontend and backend are deployed on the same server/domain:

```env
SERVER_MODE=same-server
```

### Separate

Used when the frontend and backend are deployed on separate domains:

```env
SERVER_MODE=separate
```

---

# 🍃 Running MongoDB

MongoDB can run either locally or through Docker.

## Option 1 — Local MongoDB

Start MongoDB locally.

The default connection is:

```text
mongodb://localhost:27017
```

The application uses the `chat` database:

```env
MONGODB_URI=mongodb://localhost:27017/chat
```

---

## Option 2 — Docker MongoDB

Start the Docker services:

```bash
docker compose up
```

When the backend and MongoDB are running inside Docker, use:

```env
MONGODB_URI=mongodb://mongodb:27017/chat
```

Here, `mongodb` is the MongoDB service name defined in Docker Compose.

### ⚠️ Important

Inside the backend container:

```text
localhost
```

refers to the backend container itself.

Therefore, don't use:

```env
MONGODB_URI=mongodb://localhost:27017/chat
```

when MongoDB is running in another Docker container.

Use:

```env
MONGODB_URI=mongodb://mongodb:27017/chat
```

instead.

---

# ▶️ Running the Backend

## Development

```bash
npm run start:dev
```

The backend will be available at:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

## Production

```bash
npm run start:prod
```

---

# 🐳 Docker

Start the services:

```bash
docker compose up
```

Build and start:

```bash
docker compose up --build
```

Stop the services:

```bash
docker compose down
```

A typical Docker architecture:

```text
Docker Compose
│
├── app
│   └── NestJS
│
└── mongodb
    └── MongoDB
```

The backend communicates with MongoDB through:

```text
mongodb:27017
```

---

# 🏗️ Architecture

## High-Level Architecture

```text
                    ┌─────────────────────┐
                    │      REST API       │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │      NestJS App     │
                    │                     │
                    │ Controllers         │
                    │ Services            │
                    │ Guards              │
                    │ Gateways             │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
             Mongoose                   Socket.IO
                 │                           │
                 ▼                           ▼
             ┌─────────┐              Real-time
             │ MongoDB │              Communication
             └─────────┘
```

The application uses two primary communication mechanisms:

### REST API

Used for standard request/response operations such as:

* Authentication
* User management
* User search
* Conversation operations
* Message retrieval

### Socket.IO

Used for real-time operations such as:

* Sending messages
* Typing indicators
* Online status
* Conversation events
* Message delivery updates

---

# 🧩 Backend Structure

The backend follows a **feature-based NestJS architecture**.

```text
src/

├── Auth/
├── Chat/
├── Conversation/
├── Email/
├── Message/
├── Session/
├── Users/
└── Utility/
```

General request flow:

```text
Request
   ↓
Controller / Gateway
   ↓
Guard / Validation
   ↓
Service
   ↓
Mongoose Model
   ↓
MongoDB
```

---

## Controllers

Controllers handle HTTP requests.

Examples:

* User registration
* User login
* User search
* Conversation creation
* Conversation retrieval
* Message operations

---

## Services

Services contain the business logic.

Examples:

* Authentication
* Password verification
* User management
* Conversation management
* Message management
* Online status
* Message delivery

---

## Gateways

Socket.IO gateways handle real-time events.

Examples:

* Message creation
* Typing indicators
* Online status
* Entering conversations
* Conversation events

---

## Guards

Guards protect authenticated resources and validate authentication information before allowing access.

---

# 🗄️ Database Design

MongoDB is used as the primary database.

Mongoose is used as the ODM.

The main entities are:

```text
User
Conversation
Message
Session
```

---

# 👤 User

A `User` represents an account in the system.

Conceptually:

```text
User

├── _id
├── username
├── email
├── password
├── profileImage
└── timestamps
```

Passwords are stored as hashes rather than plaintext passwords.

---

# 💬 Conversation Design

The application implements **one-to-one conversations**.

A conversation contains references to its participants.

```text
Conversation

├── _id
├── participants
│   ├── User A
│   └── User B
└── timestamps
```

## Why References?

Users are independent entities and can change over time.

For example:

* Username can change
* Profile image can change
* Other profile information can change

Using references keeps the `User` document as the source of truth instead of duplicating user information throughout conversations.

---

# 📨 Message Design

Messages belong to a conversation.

Conceptually:

```text
Message

├── _id
├── conversationId
├── senderId
├── content
├── status
└── timestamps
```

A message references:

```text
senderId        → User
conversationId  → Conversation
```

Instead of embedding complete User and Conversation documents.

This keeps messages lightweight and avoids unnecessary duplication.

---

# 🔗 Embedded Documents vs References

References are used for entities that:

* Have their own lifecycle
* Are shared across multiple documents
* Can change independently

For example:

```text
Message
   │
   ├── senderId → User
   │
   └── conversationId → Conversation
```

References were preferred because:

1. Users are shared across conversations and messages.
2. Conversations contain many messages.
3. User information can change independently.
4. Duplicated user data can create consistency problems.
5. Messages should remain relatively small.

Embedded documents are more appropriate for small data that belongs exclusively to a parent document and does not require an independent lifecycle.

---

# 🔐 Authentication

The application uses **JWT-based authentication**.

Authentication flow:

```text
Login
  ↓
Validate Credentials
  ↓
Generate Access Token
  ↓
Generate Refresh Token
  ↓
Client Sends Access Token
  ↓
Authentication Guard
  ↓
Validate JWT
  ↓
Authenticated Request
```

The application uses two token types.

## Access Token

Used to authenticate API requests.

```env
ACCESS_TOKEN_EXPIRES_IN=1d
```

REST requests use:

```http
Authorization: Bearer <access-token>
```

## Refresh Token

Used to maintain authentication for a longer period.

```env
REFRESH_TOKEN_EXPIRES_IN=7d
```

---

# 🤔 Why JWT?

The application supports both:

```text
REST API
+
WebSocket Communication
```

JWT provides a common authentication mechanism for both HTTP and Socket.IO connections.

For REST:

```http
Authorization: Bearer <access-token>
```

For WebSocket connections, the JWT is validated during the authentication process.

This avoids requiring a server-side session for every authenticated request.

## Trade-offs

JWT authentication introduces responsibilities such as:

* Token expiration
* Secure token storage
* Refresh token handling
* Token revocation when required

Cookie-based sessions can simplify browser session management but require server-side session handling or a session store.

JWT was selected to provide a common authentication mechanism across the REST and WebSocket layers.

---

# 🔌 WebSocket Architecture

Socket.IO provides real-time bidirectional communication.

The main responsibilities include:

* ⚡ Real-time message delivery
* ✍️ Typing indicators
* 🟢 Online status
* 🚪 Entering conversations
* 🚪 Leaving conversations
* 📬 Message delivery updates

---

# 🔄 WebSocket Connection Flow

When a client connects:

```text
Client
  ↓
Socket.IO Connection
  ↓
Authenticate JWT
  ↓
Identify User
  ↓
Join User Room
  ↓
Join Conversation Rooms
```

Each user has a dedicated room:

```text
user:{userId}
```

Conversation rooms use:

```text
conversation:{conversationId}
```

This allows events to be delivered to the intended users instead of broadcasting them to every connected client.

---

# 📡 WebSocket Events

Examples of application events:

```text
ConversationList:Search
Conversation:Create

Message:Create

Typing:Start
Typing:Stop

Online:Check

Chat:Enter
```

---

## Message Flow

```text
User A
  │
  │ Message:Create
  ▼
Socket.IO Gateway
  │
  ▼
Validate Authenticated User
  │
  ▼
Create Message
  │
  ▼
Save Message in MongoDB
  │
  ▼
Emit Socket.IO Event
  │
  ▼
User B Receives Message
```

MongoDB remains the **persistent source of truth**, while Socket.IO handles real-time delivery.

---

# 🟢 Online Status

Online status is based on active Socket.IO connections.

A single user can have multiple active connections:

```text
User A

├── Socket 1
├── Socket 2
└── Socket 3
```

Therefore, the system does not assume:

```text
1 User = 1 Socket
```

Instead, user-specific rooms allow the system to communicate with all active connections belonging to the same user.

---

# ✍️ Typing Indicators

Typing indicators are temporary real-time events:

```text
Typing:Start
Typing:Stop
```

Typing state is not permanently stored in MongoDB because it represents temporary connection state rather than persistent application data.

---

# 📬 Message Delivery

Messages are persisted in MongoDB.

Socket.IO is responsible for notifying the recipient about delivery.

Conceptually:

```text
Message Created
      ↓
Saved in MongoDB
      ↓
Sent through Socket.IO
      ↓
Recipient Receives Message
      ↓
Delivery Status Updated
```

This separates persistent message data from transient WebSocket events.

---

# 📄 Pagination

The application uses **cursor-based pagination** for data that can grow over time, especially:

* Messages
* Search results
* Other potentially large lists

Instead of relying only on:

```text
?page=1
?page=2
?page=3
```

the API can use a cursor representing the position of the last retrieved item.

Example:

```http
GET /messages?limit=20&cursor=<cursor>
```

## Why Cursor Pagination?

Chat messages can grow significantly over time.

Cursor pagination allows the database to continue from a known position.

It also provides more stable pagination when new messages are inserted while older messages are being loaded.

## Trade-off

Cursor pagination is more complex than offset pagination because the API needs to:

* Generate cursors
* Validate cursors
* Handle cursor expiration or invalid values
* Maintain consistent sorting

However, it fits continuously growing datasets such as chat messages.

---

# 🧠 Technical Decisions & Trade-offs

## NestJS

NestJS was chosen because it provides a structured architecture based on:

* Modules
* Controllers
* Services
* Dependency Injection
* Guards
* Gateways

This makes it easier to separate:

```text
Authentication
Users
Conversations
Messages
Real-time Communication
```

### Trade-off

NestJS introduces more structure and boilerplate compared with a minimal Express application.

---

## MongoDB

MongoDB was chosen because the application works with document-oriented data such as:

* Users
* Conversations
* Messages
* Sessions

MongoDB integrates naturally with Mongoose and provides flexible document modeling.

### Trade-off

MongoDB does not provide the same relational constraints and join model as a relational database.

Therefore, references, indexes, and query patterns need to be designed carefully.

---

## Socket.IO

Socket.IO was chosen because the application requires real-time bidirectional communication.

It provides:

* Events
* Rooms
* Connection management
* Reconnection support
* Real-time communication

### Trade-off

Real-time communication introduces additional complexity around:

* Connection state
* Disconnections
* Multiple sockets per user
* Event delivery
* Synchronization with persistent data

---

## JWT

JWT was selected to provide authentication across both REST and WebSocket communication.

### Trade-off

The application must correctly handle:

* Token expiration
* Refresh tokens
* Secure token storage
* Token revocation when required

---

## References

References are used for Users, Conversations, and Messages because these entities have independent lifecycles and are shared across the application.

### Trade-off

Related data may require additional queries or population, but this avoids duplicated data and consistency problems.

---

## Cursor Pagination

Cursor pagination was selected for potentially large datasets such as messages.

### Trade-off

It is more complex than page/offset pagination but provides a better model for continuously changing datasets.

---

# 🐳 Docker Architecture

Docker can run the backend and MongoDB in isolated containers.

```text
                 Docker Compose
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
       NestJS                  MongoDB
        App                    Database
          │                       ▲
          └──── mongodb:27017 ────┘
```

Docker provides:

* Consistent environments
* Easier deployment
* Isolated services
* Easier MongoDB setup
* Reduced "works on my machine" problems

---

# 📁 Project Structure

```text
src/

├── Auth/
│
├── Chat/
│
├── Conversation/
│
├── Email/
│
├── Message/
│
├── Session/
│
├── Users/
│
└── Utility/
```

The project is organized by feature.

Each feature can contain its own:

```text
Controllers
Services
Schemas
DTOs
Guards
Gateways
```

This keeps related functionality together and makes the codebase easier to maintain and extend.

---

# 🔄 Application Flow

The overall backend architecture can be summarized as:

```text
                         ┌───────────────┐
                         │   REST API    │
                         └───────┬───────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │    NestJS     │
                         │    Backend    │
                         └───────┬───────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
                Mongoose                 Socket.IO
                    │                         │
                    ▼                         ▼
                MongoDB                  Real-time
                                       Communication
```

The backend separates:

```text
HTTP Request Handling
        │
        ▼
Business Logic
        │
        ▼
Authentication
        │
        ▼
Database Persistence
        │
        ▼
Real-time Communication
```

This architecture provides clear separation of responsibilities and makes the application easier to maintain, test, and extend.

---

# 📌 Summary

This project demonstrates a modular real-time backend using:

```text
NestJS
   +
TypeScript
   +
MongoDB / Mongoose
   +
Socket.IO
   +
JWT
   +
Docker
```

The architecture combines **REST APIs for persistent operations** with **Socket.IO for real-time communication**, while MongoDB serves as the persistent source of truth for application data.

---

## 👨‍💻 Author

**Mohamed**

GitHub: [mohamedsmaha](https://github.com/mohamedsmaha)
