import {nanoid} from "nanoid";
import logger from "./utils/logger";
import {Server, Socket} from "socket.io";

const EVENTS = {
    connection: "connection",
    CLIENT: 
    {
        CREATE_ROOM: "CREATE_ROOM",
        SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
        JOIN_ROOM: "JOIN_ROOM",
        SET_TIMER: "SET_TIMER",
        REQUEST_TIMER: "REQUEST_TIMER",
    },
    SERVER: 
    {
        ROOMS: "ROOMS",
        JOINED_ROOM: "JOINED_ROOM",
        ROOM_MESSAGE: "ROOM_MESSAGE",
        TIMER_SET: "TIMER_SET",
        TIMER_UPDATE: "TIMER_UPDATE",
        CONVERSATION_ENDED: "CONVERSATION_ENDED",
    },
};

const rooms: Record<string, { name: string; clients: Set<string> }> = {};

function socket({io}: { io: Server }) 
{
    let timerValue = null;
    let intervalFunction = null;

    io.on(EVENTS.connection, (socket) => {
        logger.info(`New client connected with id:${socket.id}`);
        socket.emit(EVENTS.SERVER.ROOMS, rooms);
        socket.on(EVENTS.CLIENT.CREATE_ROOM, ({roomName}) => {
            const roomId = nanoid();

            rooms[roomId] = {name: roomName, clients: new Set()};
            socket.join(roomId);
            
            rooms[roomId].clients.add(socket.id);
            socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);
            socket.emit(EVENTS.SERVER.ROOMS, rooms);
            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);

            logger.info(`${socket.id} created ${roomName} with timer ${timerValue}`);
        });

        socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
            if (rooms[roomId] && rooms[roomId].clients.size < 2) 
            {
                socket.join(roomId);
                rooms[roomId].clients.add(socket.id);
                
                socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
                if (timerValue !== null) 
                {
                    io.to(roomId).emit(EVENTS.SERVER.TIMER_SET, timerValue);
                    if (intervalFunction) 
                    {
                        clearInterval(intervalFunction);
                    }

                    let currentTime = timerValue;
                    intervalFunction = setInterval(() => {
                        currentTime -= 1;
                        io.to(roomId).emit(EVENTS.SERVER.TIMER_UPDATE, currentTime);

                        if (currentTime === 0) 
                        {
                            clearInterval(intervalFunction);
                            io.to(roomId).emit(EVENTS.SERVER.CONVERSATION_ENDED);

                            logger.info(`Conversation ended in ${rooms[roomId].name}`);
                            logger.info(
                                `${Array.from(rooms[roomId].clients).join(
                                    " and "
                                )} disconnected from ${rooms[roomId].name}`
                            );
                        }
                    }, 1000);
                }
                logger.info(`${socket.id} joined ${rooms[roomId].name}`);
            } 
            else 
            {
                socket.emit("error", "The room does not exist or is full.");
            }
        });

        socket.on(EVENTS.CLIENT.REQUEST_TIMER, () => {
            if (timerValue !== null) 
            {
                socket.emit(EVENTS.SERVER.TIMER_SET, timerValue);
            }
        });

        socket.on(EVENTS.CLIENT.SET_TIMER, (duration) => {
            timerValue = duration;
            io.emit(EVENTS.SERVER.TIMER_SET, duration);
        });

        socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({roomId, message, username}) => {
            const time = new Date();
            socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
                message,
                username,
                time: `${time.getHours()}:${time.getMinutes()}`,
            });

            logger.info(`${username} sent "${message}" in ${rooms[roomId].name}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
            for (const roomId in rooms) 
            {
                if (rooms[roomId].clients.has(socket.id)) {
                    rooms[roomId].clients.delete(socket.id);
                }
            }
        });
    });
}

export default socket;
