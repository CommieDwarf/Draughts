"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
var http = require("http");
var cors = require("cors");
var server = http.createServer(app);
var Server = require("socket.io").Server;
app.use(cors({
    origin: 'localhost/Draughts/client'
}));
var io = new Server(server, {
    cors: {
        origin: "http://localhost",
        methods: ["POST", "GET"]
    }
});
var players = [];
var someoneWriting = false;
io.on("connection", function (socket) {
    console.log("User connected", socket.id, socket.handshake.address);
    socket.on("player-connected", function (name) {
        socket.join("global");
        if (name.length > 6) {
            name = name.slice(0, 6);
        }
        players.push({
            name: name,
            avatar: {
                theme: getRandomElement(avatarThemes),
                shape: getRandomElement(avatarShapes)
            },
            id: socket.id
        });
        io.emit("players_update", players);
    });
    socket.on("join_room", function (room) {
        socket.join(room.id);
    });
    socket.on("leave_room", function (room) {
        socket.leave(room.id);
    });
    socket.on("send_message", function (msg) {
        socket.broadcast.emit("get_room", { target: msg.room.name, author: msg.author.name, msg: msg });
        setTimeout(function () { socket.broadcast.to(msg.room.id).emit(("get_message"), msg); }, 100);
    });
    socket.on("writing", function () {
        socket.broadcast.emit("someone_writing");
    });
    socket.on("done_writing", function () {
        socket.broadcast.emit("done_writing");
    });
    socket.on("request_players_list", function () {
        socket.emit("get_players", players);
    });
    socket.on("disconnect", function () {
        console.log("user disconnected");
        players = players.filter(function (player) { return player.id !== socket.id; });
        io.emit("players_update", players);
    });
});
server.listen(3001, function () {
    console.log('server running');
});
var avatarThemes = ["frogideas", "sugarsweets", "heatwave", "daisygarden", "seascape",
    "summerwarmth", "bythepool", "duskfalling", "berrypie", "base"];
var avatarShapes = ["squares", "isogrids", "spaceinvaders", "labs/isogrids/hexa", "labs/isogrids/hexa16"];
function getRandomElement(array) {
    return array[Math.floor(Math.random() * (array.length - 1))];
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
//# sourceMappingURL=index.js.map