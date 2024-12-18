'use client';

import EVENTS from "@/app/config/events";
import {FiSend} from "react-icons/fi";
import {motion} from "framer-motion";
import {useSocket} from "@/app/context/socket.context";
import {useEffect, useRef} from "react";

const MessagesContainer = () => {
    const {messages, socket, username, roomId, setMessages} = useSocket();
    const newMessageRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    useEffect(() => {
    }, [roomId, socket]);

    if (!roomId) return <div/>;
    return (
        <div
            className="overflow-y-scroll p-4 flex-grow mx-auto md:w-2/3 lg:w-1/2 my-scrollbar bg-stone-900/25 rounded-2xl mt-4 mb-2">
            <div className="flex-1 h-screen flex flex-col rounded-lg">
                <div className="mb-20"></div>
                {messages?.map(({message, username, time}, index) => (
                    <motion.div
                        key={index}
                        className="bg-stone-300 rounded-b-2xl mb-4 p-4 border"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.5}}
                        style={{display: "flex", justifyContent: username === "You" ? "flex-end" : "flex-start"}}
                    >
                        <div>
              <span className="text-sm">
                {username} - {time}
              </span>
                        <div className=" text-base bg-gray-800 text-gray-200 rounded-lg p-2 shadow-lg">{message}</div>
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef}/>
            </div>
        </div>
    );
};

export default MessagesContainer;
