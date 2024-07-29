const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("")));

let arr = [];
let playingArray = [];

io.on("connection", (socket) => {
    socket.on("findPlayer", (e) => {
        if (e.name != null) {
            arr.push(e.name);

            if (arr.length >= 2) {
                // Connecting only if the array has more than 2 players
                let p1obj = {
                    p1name: arr[0],
                    p1value: "X",
                    p1move: ""
                };
                let p2obj = {
                    p2name: arr[1],
                    p2value: "O",
                    p2move: ""
                };

                let obj = {
                    p1: p1obj,
                    p2: p2obj,
                    sum: 1
                };

                playingArray.push(obj);
                arr.splice(0, 2);

                io.emit("findPlayer", { allPlayers: playingArray });
            }
        }
    });

    socket.on("playing", (e) => {
        let objToChange;

        if (e.value === "X") {
            objToChange = playingArray.find(obj => obj.p1.p1name === e.name);
        } else if (e.value === "O") {
            objToChange = playingArray.find(obj => obj.p2.p2name === e.name);
        }

        if (objToChange) {
            if (e.value === "X") {
                objToChange.p1.p1move = e.id;
            } else if (e.value === "O") {
                objToChange.p2.p2move = e.id;
            }
            objToChange.sum++;
            io.emit("playing", { allPlayers: playingArray });
        }
    });

    //deleting the array after winner is declared.
    socket.on("gameOver", (e)=>{
        //filter will go through all the objects in playingArray and filter out all the objects which does not contain 'e.name', the object that contains this name will automatically be deleted.
        playingArray=playingArray.filter(obj=>obj.p1.p1name!==e.name)
        console.log(playingArray)
    })

    socket.on("disconnect", () => {
        // Handle player disconnect
        playingArray = playingArray.filter(obj => obj.p1.p1name !== socket.name && obj.p2.p2name !== socket.name);
        io.emit("playing", { allPlayers: playingArray });
    });
});

app.get("/", (req, res) => {
    return res.sendFile("index.html");
});

server.listen(3000, () => {
    console.log("PORT CONNECTED TO 3000!");
});
