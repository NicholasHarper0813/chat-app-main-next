const EVENTS =
{
    connection: "connection",
    CLIENT: 
    {
        CREATE_ROOM: "CREATE_ROOM",
        SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
        JOIN_ROOM: "JOIN_ROOM",
        SET_TIMER: "SET_TIMER", // Add this line
        REQUEST_TIMER: "REQUEST_TIMER", // Add this line
    },
    SERVER:
    {
        ROOMS: "ROOMS",
        JOINED_ROOM: "JOINED_ROOM",
        ROOM_MESSAGE: "ROOM_MESSAGE",
        TIMER_SET: "TIMER_SET", // Add this line
        TIMER_UPDATE: "TIMER_UPDATE", // Add this line
        CONVERSATION_ENDED: "CONVERSATION_ENDED", // Add this line
    },
};

export default EVENTS;
