import {motion} from "framer-motion";
import {useRef} from "react";
import {FiSend} from "react-icons/fi";
import {useSocket} from "@/app/context/socket.context";
import EVENTS from "@/app/config/events";

export const Sender = () => {
    const newMessageRef = useRef<HTMLTextAreaElement>(null);
    const {messages, socket, roomId, username, setMessages} = useSocket();

    function handleMessageSend() 
    {
        const message = newMessageRef.current?.value;
        if (!String(message).trim())
        {
            return;
        }

        socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, 
        {
            roomId,
            username,
            message,
        });

        const date = new Date();
        setMessages([
            ...(messages as any),
            {
                message,
                username: "You",
                time: `${date.getHours()}:${date.getMinutes()}`,
            },
        ]);

        newMessageRef.current!.value = "";
    }

    return (
        <div
            className="bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-sky-300/50 to-indigo-900/45 p-4 border-t border-cyan-400 flex items-center pointer-events-none "
            style={{
                marginLeft: "1rem",
                marginRight: "0.5rem",
                bottom: 20,
                borderRadius: "0.5rem",
            }}
        >
            <motion.textarea
                className="w-full p-4 text-base rounded-lg shadow-lg bg-stone-300 pointer-events-auto"
                placeholder="Type a message..."
                rows={1}
                ref={newMessageRef}
                initial={{scale: 0}}
                animate={{scale: 1}}
                transition={{duration: 0.5}}
                whileTap={{scale: 0.9}}
            />

            <motion.button
                onClick={handleMessageSend}
                className="px-12 py-5 ml-2 text-stone-300 bg-cyan-500 rounded-lg pointer-events-auto"
                initial={{scale: 0}}
                animate={{scale: 1}}
                transition={{duration: 0.5}}
                whileTap={{scale: 0.9}}
            >
                <FiSend/>
            </motion.button>
        </div>
    );
};

export default Sender;
