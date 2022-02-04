
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");

app.use(cors({
    origin: 'localhost/Draughts/client'
}));

const io = new Server(server, {
    cors: {
        origin: "http://localhost",
        methods: ["POST", "GET"]
    }
});

interface Player {
    name: string,
    avatar: {
        theme: string,
        shape: string,
    }
    id: string
}

export type IMessage = {
    content: string,
    author: Player,
    room: Room,
}

type Room = {
    author: string,
    target: string,
    id: string
}


let players: Player[] = [];

interface IsWritingRooms<value> {
    [key: string]: value,
}

const isWritingRooms: IsWritingRooms<boolean> = {};

io.on("connection", (socket: any) => {

    console.log("User connected", socket.id, socket.handshake.address);

    socket.on("player-connected", (name: string) => {
        socket.join("global")
       
        if (name.length > 6) {
            name = name.slice(0, 6);
        }
        players.push({
            name,
            avatar: {
                theme: getRandomElement(avatarThemes),
                shape: getRandomElement(avatarShapes)
            },
            id: socket.id
        });
        io.emit("players_update", players);
    })

    socket.on("create_room", (room: Room) => {
        socket.broadcast.emit("room_created", room);
    })
    socket.on("join_room", (room: Room) => {
        socket.join(room.id);
    })
    socket.on("leave_room", (room: Room) => {
        socket.leave(room.id);
    })

    socket.on("send_message", (msg: IMessage) => {
        console.log(msg);
        socket.broadcast.to(msg.room.id).emit(("get_message"), msg);
    })


    socket.on("writing", (room: {name: string, id:string}) => {
        socket.broadcast.emit("someone_writing", room);
    })
    socket.on("done_writing", (room: {name: string, id:string}) => {
        socket.broadcast.emit("done_writing", room)
    })

    socket.on("request_players_list", () => {
        socket.emit("get_players", players);
    })

    socket.on("disconnect", () => {
        console.log("user disconnected");
        players = players.filter((player) => player.id !== socket.id);
        io.emit("players_update", players);
    })

})


server.listen(3001, () => {
    console.log('server running');
})


const avatarThemes = ["frogideas", "sugarsweets", "heatwave", "daisygarden", "seascape",
    "summerwarmth", "bythepool", "duskfalling", "berrypie", "base"];

const avatarShapes = ["squares", "isogrids", "spaceinvaders", "labs/isogrids/hexa", "labs/isogrids/hexa16"];

function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * (array.length - 1))]
}


// const cacheDir = // where to put cache files
// const cacheKey = // calculate cache key for the input

// const cacheFile = path.join(cacheDir, cacheKey);
// if (exists(cacheFile)) {
// 	// the result is cached
// 	return fs.readFile(cacheFile);
// }else {
// 	// calculate the result and store it
// 	const result = // run the process
// 	await fs.writeFile(cacheFile, result);
// 	return result;
// }