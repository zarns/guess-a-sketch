"use client"

import { useContext, useEffect, useState } from "react"
import { customAlphabet } from "nanoid"
import { UserContext } from "../components/ContextProvider"
import { useRouter } from "next/navigation"

export default function Home() {
    const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 4)
    const { user, setUser } = useContext(UserContext)
    const [name, setName] = useState("")
    const [joinId, setJoinId] = useState("")
    const [nameError, setNameError] = useState(false)
    const [joinIdError, setJoinIdError] = useState(false)
    const router = useRouter()

    const handleCreateRoom = () => {
        if (!name) return setNameError(true)
        setNameError(false)
        const roomId = nanoid()
        setUser({ name, roomId, members: [], leader: name })
        router.push(`/room/${roomId}`)
    }

    const handleJoinRoom = () => {
        if (!name) return setNameError(true)
        setNameError(false)
        if (!joinId || joinId.length > 4) return setJoinIdError(true)
        setJoinIdError(false)
        setUser({ name, roomId: joinId, members: [], leader: "" })
        router.push(`/room/${joinId}`)
    }

    return (
        <main
            style={{ backgroundImage: "url(whiteboard_background.jpg)", backgroundSize: "cover" }}
            className="min-h-screen py-10 lg:min-h-[90vh] lg:h-screen w-full"
        >
            {/*   Title    */}
            <h1 className="p-2 mx-auto text-6xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-tr from-blue-700 to-blue-500">
                Telestrations
            </h1>
            <div className="flex flex-col p-6 mx-auto mt-20 rounded-lg borer-2 glass md:p-10 gap-y-6 w-max">
                <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 text-lg border-2 border-black rounded-md w-60 md:w-80 outline-0 btn-shadow"
                />
                {nameError && <p className="text-red-600">Enter Name</p>}
                <input
                    type="text"
                    placeholder="Game ID"
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value.toUpperCase())}
                    className="p-2 text-lg border-2 border-black rounded-md w-60 md:w-80 outline-0 btn-shadow"
                />
                {joinIdError && (
                    <p className="text-red-600">Enter Valid Game Room ID </p>
                )}

                <button
                    onClick={handleJoinRoom}
                    className="block w-full p-2 mx-auto text-2xl font-semibold text-center text-amber-400 transition-all bg-blue-700 rounded-md md:text-3xl btn-shadow hover:scale-105 active:scale-90"
                >
                    Join Room
                </button>
                <button
                    onClick={handleCreateRoom}
                    className="block w-full p-2 mx-auto text-2xl font-semibold text-center text-amber-400 transition-all rounded-md bg-blue-800 md:text-3xl btn-shadow hover:scale-105 active:scale-90"
                >
                    Create Room
                </button>
            </div>
        </main>
    )
}
