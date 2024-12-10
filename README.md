
# Mern ChatApp

## Description

This is a chat application built with `NextJS`, `Socket.io`, and `Typescript`. It allows users to create and join chat rooms, send messages, and set timers for conversations. It has a user-friendly and good-looking UI that enhances the chat experience.

## Motivation

I created this project because I wanted to learn how to use `NextJS` and `Socket.io` together to build a real-time application. I also wanted to improve my skills in `Typescript and NodeJs` and `NextJS`. This project solves the problem of having a simple and easy way to communicate with other people online.

This project is an improved version of my previous `Demo chat app with basic timer functionality using html and nodejs`, which you can check out. The main differences are:

- This project uses `NextJS and NodeJS` as a React framework for production, which provides features such as server-side rendering, code splitting, and routing.
- This project uses `Typescript` to make the code more readable, understandable, and easy to implement new features in the future.
- This project has a user-friendly and good-looking UI that enhances the chat experience.

## Table of Contents

- [How to run the project locally](#how-to-run-the-project-locally)
- [How to contribute](#how-to-contribute)
- [Built with](#built-with)
- [Backend](#backend-)
- [Learn more](#learn-more)

## How to run the project locally

To run chat-app on your local machine, you need to have [Node.js](https://nodejs.org/en/) installed. Node.js is a JavaScript runtime that allows you to run JavaScript code on the server side.

You also need to install the dependencies for both the client and the server servers. You can use either `npm` or `yarn` as your package manager.

First, clone this repository to your local machine:

```bash
git clone https://github.com/Subham-Maity/next-mern-chat.git
```

Then, navigate to the root folder and install all the dependencies for your packages and link any cross-dependencies:

```bash
lerna bootstrap
```

This will create a `node_modules` folder in each package folder and also in the root folder.

> - Lerna is a tool that helps you manage multiple packages in a single repository. This is also known as a monorepo. Lerna allows you to install dependencies, run scripts, and link packages across your monorepo with ease.

Next, run the following command in your root folder:

```bash
npm run dev

# or

yarn dev
```

This will start both the servers in parallel using `lerna`.

The server server will run on port 5002 by default. You can change this in the `server/config/default.ts` file.

The client server will run on port 3000 by default. You can change this in the `client/config/default.ts` file.

That's it! You can now open your browser and go to `http://localhost:3000` to see chat-app in action. 🎉

### Alternatively,

you can also run the servers separately by following these steps:

- Navigate to the packages folder and then to the server folder. Install the dependencies and start the server server:

```bash
cd packages/server
npm install

# or

yarn install

npm run dev

# or

yarn dev
```

- Open another terminal window and navigate to the packages folder and then to the client folder. Install the dependencies and start the client server:
> Make sure server should be running on port 5002 before starting client server

```bash
cd packages/client
npm install

# or

yarn install

npm run dev

# or

## Backend 🧠


The chat application uses Socket.io to communicate between the frontend and the backend using events. Events are messages that are emitted or received by the server or the client. Here are some of the events that are used in this application:

#### `connection` 🔗

This event is emitted by the server when a new client connects to it. It also sets up listeners for other events from the client.

#### `CLIENT.CREATE_ROOM` 🏠

This event is emitted by the client when it wants to create a new room. The server will create the room and emit a `SERVER.ROOMS` event with the updated list of rooms.

##### Payload 📦

```typescript
{
  roomName: string;
}
```

#### `CLIENT.JOIN_ROOM` 🔗

This event is emitted by the client when it wants to join an existing room. The server will add the client to the room and emit a `SERVER.JOINED_ROOM` event with the room details.

##### Payload 📦

```typescript
{
  roomId: string;
}
```

#### `CLIENT.SEND_ROOM_MESSAGE` 💬

This event is emitted by the client when it wants to send a new message to a room. The server will broadcast the message to all clients in the room and emit a `SERVER.ROOM_MESSAGE` event with the message details.

##### Payload 📦

```typescript
{
  time: string;
  roomId: string;
  message: string;
}
```

#### `CLIENT.SET_TIMER` ⏰

This event is emitted by the client when it wants to set a timer for a room. The server will start a countdown and emit a `SERVER.TIMER_SET` event with the timer details.

##### Payload 📦

```typescript
{
  time: number;
}
```

#### `CLIENT.REQUEST_TIMER` ⏰

This event is emitted by the client when it wants to request the current timer for a room. The server will emit a `SERVER.TIMER_UPDATE` event with the timer details.

##### Payload 📦

```typescript
{
  roomId: string;
}
```

#### `disconnect` ❌

This event is emitted by the client when it disconnects from the server. The server will remove the client from any rooms and emit a `SERVER.CONVERSATION_ENDED` event if the room becomes empty.

##### Payload 📦

```typescript
{
  roomId: string;
}
```

#### `SERVER.ROOMS` 🏠

This event is emitted by the server when there is a change in the list of rooms. It sends an array of rooms with their names and ids.

##### Payload 📦

```typescript
[
  {
    id: string;
    name: string;
  },
  ...
]
```

#### `SERVER.JOINED_ROOM` 🔗

This event is emitted by the server when a client joins a room. It sends an object with the room id, name, and an array of messages.

##### Payload 📦

```typescript
{
  id: string;
  name: string;
  messages: [
    {
      time: string;
      message: string;
    },
    ...
  ]
}
```

#### `SERVER.ROOM_MESSAGE` 💬

This event is emitted by the server when a new message is sent to a room. It sends an object with the room id, time, and message.

##### Payload 📦

```typescript
{
  roomId: string;
  time: string;
  message: string;
}
```

#### `SERVER.TIMER_SET` ⏰

This event is emitted by the server when a timer is set for a room. It sends an object with the room id and time.

##### Payload 📦

```typescript
{
  roomId: string;
  time: number;
}
```

#### `SERVER.TIMER_UPDATE` ⏰

This event is emitted by the server when there is an update on the timer for a room. It sends an object with the room id and time.

##### Payload 📦

```typescript
{
  roomId: string;
  time: number;
}
```

#### `SERVER.CONVERSATION_ENDED` ❌

This event is emitted by the server when a conversation ends in a room. It sends an object with the room id.

##### Payload 📦

```typescript
{
  roomId: string;
}
```



---
## How to contribute

If you like chat-app and want to contribute to its development, you are more than welcome! Here are some ways you can help:
- Fork this repository and submit pull requests with your code changes.
- Share chat-app with your friends and spread the word.

Any feedback or support is greatly appreciated. Thank you for your interest in chat-app! ❤️

## Built with

Chat-app is built with some of the most popular and powerful technologies in web development. Here are some of them:

- [Node.js](https://nodejs.org/en/) - JavaScript runtime
- [Express](https://expressjs.com/) - Web framework for Node.js
- [Socket.io](https://socket.io/) - Realtime application framework
- [Next.js](https://nextjs.org/) - React framework for production
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at Any Scale

These technologies allow me to create a fast, scalable, and user-friendly chat application that works across different devices and browsers.
