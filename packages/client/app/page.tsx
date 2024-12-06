"use client";

import MessagesContainer from "@/app/containers/Messages";
import RoomsContainer from "@/app/containers/Rooms";
import {useSocket} from "@/app/context/socket.context";
import {useEffect, useRef} from "react";
import EVENTS from "@/app/config/events";
import Sender from "@/app/containers/Sender"; // import motion component from Framer Motion
export default function Home() {
    const {socket, username, setUsername, timer, roomId} = useSocket(); // Add timer and roomId here
    const usernameRef = useRef<HTMLInputElement>(null);

    function handleUsername() {
        const value = usernameRef.current?.value || "";

        if (!value) return;

        setUsername(value);

        localStorage.setItem("username", value);
    }

    useEffect(() => {
        if (usernameRef) {
            usernameRef.current!.value = localStorage.getItem("username") || "";
        }

        // Add a listener for conversation ended event
        socket.on(EVENTS.SERVER.CONVERSATION_ENDED, () => {
            // Alert the user that the conversation is over and they are disconnected from the room
            alert("The conversation has ended. You are disconnected from the room.");
        });

        // Add a cleanup function to remove the listener when component unmounts
        return () => {
            socket.off(EVENTS.SERVER.CONVERSATION_ENDED);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            {!username ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-200">
                    <div className="bg-white p-8 rounded">
                        <input
                            className="mb-4 px-4 py-2 border border-gray-300 rounded"
                            placeholder="Username"
                            ref={usernameRef}
                        />
                        <button
                            onClick={handleUsername}
                            className="px-4 ml-2 py-2 text-white bg-pink-500 rounded"
                        >
                            Set Username
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex h-screen overflow-hidden">
                    <RoomsContainer/>
                    <div className="flex flex-col flex-grow relative">
                        {timer && (
                            <div
                                className="absolute top-0 right-0 m-4 text-white bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-sky-300/50 to-indigo-900/45 px-4 py-2 rounded-lg shadow-lg">
                                Time remaining: {Math.floor(timer / 60)}m {timer % 60}s{" "}
                            </div>
                        )}
                        <MessagesContainer/>
                        {/* Add a condition to render Sender component only when roomId is not null or undefined */}
                        {roomId && <Sender/>}
                    </div>
                </div>
            )}
        </div>
    );
}
