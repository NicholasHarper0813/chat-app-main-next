import {nanoid} from "nanoid";
import {Server, Socket} from "socket.io";
import logger from "./utils/logger";

const EVENTS = {
    connection: "connection",
    CLIENT: {
        CREATE_ROOM: "CREATE_ROOM",
        SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
        JOIN_ROOM: "JOIN_ROOM",
        SET_TIMER: "SET_TIMER",
        REQUEST_TIMER: "REQUEST_TIMER",
    },
    SERVER: {
        ROOMS: "ROOMS",
        JOINED_ROOM: "JOINED_ROOM",
        ROOM_MESSAGE: "ROOM_MESSAGE",
        TIMER_SET: "TIMER_SET",
        TIMER_UPDATE: "TIMER_UPDATE",
        CONVERSATION_ENDED: "CONVERSATION_ENDED",
    },
};

const rooms: Record<string, { name: string; clients: Set<string> }> = {};

function socket({io}: { io: Server }) {
    // Initialize the timer value to null
    let timerValue = null;
    // Initialize an interval function to null
    let intervalFunction = null;

    io.on(EVENTS.connection, (socket) => {
        // Log the client's id when they connect
        logger.info(`New client connected with id:${socket.id}`);

        // Emit the rooms object to the client when they connect
        socket.emit(EVENTS.SERVER.ROOMS, rooms);

        // Listen for the client creating a new room
        socket.on(EVENTS.CLIENT.CREATE_ROOM, ({roomName}) => {
            // Create a roomId
            const roomId = nanoid();

            // Add a new room to rooms object with an empty set of clients
            rooms[roomId] = {name: roomName, clients: new Set()};

            // Join the room with the given roomId
            socket.join(roomId);

            // Add the client's id to the room's clients set
            rooms[roomId].clients.add(socket.id);

            // Broadcast an event saying that a new room has been created
            socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

            // Emit back to the room creator with all the rooms
            socket.emit(EVENTS.SERVER.ROOMS, rooms);

            // Emit an event back to room creator that they have joined the room
            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);

            // Log the room creation and timer value in the terminal
            logger.info(`${socket.id} created ${roomName} with timer ${timerValue}`);
        });

        // Listen for a client joining a room
        socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
            // Check if the room exists and is not full
            if (rooms[roomId] && rooms[roomId].clients.size < 2) {
                // Join the room with the given roomId
                socket.join(roomId);

                // Add the client's id to the room's clients set
                rooms[roomId].clients.add(socket.id);

                // Emit an event back to room creator that they have joined the room
                socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);

                // Check if there is a timer value for the room
                if (timerValue !== null) {
                    // Emit the timer value to all clients in the room
                    io.to(roomId).emit(EVENTS.SERVER.TIMER_SET, timerValue);

                    // Clear any existing interval function
                    if (intervalFunction) {
                        clearInterval(intervalFunction);
                    }

                    // Set the current time to the timer value
                    let currentTime = timerValue;

                    // Create a new interval function that runs every second
                    intervalFunction = setInterval(() => {
                        // Decrement the current time by one
                        currentTime -= 1;

                        // Emit the current time to all clients in the room
                        io.to(roomId).emit(EVENTS.SERVER.TIMER_UPDATE, currentTime);

                        // Check if the current time is zero
                        if (currentTime === 0) {
                            // Clear the interval function
                            clearInterval(intervalFunction);

                            // Emit the conversation ended event to all clients in the room
                            io.to(roomId).emit(EVENTS.SERVER.CONVERSATION_ENDED);

                            // Log the conversation end and disconnection in the terminal
                            logger.info(`Conversation ended in ${rooms[roomId].name}`);
                            logger.info(
                                `${Array.from(rooms[roomId].clients).join(
                                    " and "
                                )} disconnected from ${rooms[roomId].name}`
                            );
                        }
                    }, 1000);
                }

                // Log the join event in the terminal
                logger.info(`${socket.id} joined ${rooms[roomId].name}`);
            } else {
                // Emit an error message to the client who tried to join an invalid or full room
                socket.emit("error", "The room does not exist or is full.");
            }
        });

        // Listen for a client requesting a timer for a room
        socket.on(EVENTS.CLIENT.REQUEST_TIMER, () => {
            // Check if there is a timer value for the room
            if (timerValue !== null) {
                // Emit the timer value to the client who requested it
                socket.emit(EVENTS.SERVER.TIMER_SET, timerValue);
            }
        });

        // Listen for a client setting a timer for a room
        socket.on(EVENTS.CLIENT.SET_TIMER, (duration) => {
            // Set the timer value to the received duration
            timerValue = duration;
            // Emit the timer value to all clients in the room
            io.emit(EVENTS.SERVER.TIMER_SET, duration);
        });

        // Listen for a client sending a message to a room
        socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({roomId, message, username}) => {
            const time = new Date(); // get the current time

            // Emit the event to all clients in the room except the sender
            socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
                message,
                username,
                time: `${time.getHours()}:${time.getMinutes()}`,
            });

            // Log the message and sender in the terminal
            logger.info(`${username} sent "${message}" in ${rooms[roomId].name}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
            // Remove the client's id from any rooms they joined
            for (const roomId in rooms) {
                if (rooms[roomId].clients.has(socket.id)) {
                    rooms[roomId].clients.delete(socket.id);
                }
            }
        });
    });
}

export default socket;
