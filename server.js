// run 'gcloud app deploy' in terminal to deploy to google cloud app engine
// npm start to run locally at localhost:3001

const express = require("express");
const UUID = require("uuid-int");
const app = express();

// Middleware
app.use(express.json());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// Database Setup (Example: Using MongoDB with Mongoose)
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/room_data", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Room = mongoose.model("rooms", {
  roomName: String,
  roomId: String,
  ownerName: String,
  players: [
    {
      playerName: String,
      playerScore: String,
    },
  ],
});

// Routes
app.post("/api/create-room", async (req, res) => {
  try {
    const { roomName, password, playerName } = req.body;
    const room = new Room({
      roomName: roomName,
      roomId: UUID(0).uuid(),
      players: [{ playerName: playerName, playerScore: 0 }],
    });
    await room.save();

    res.json({
      success: true,
      message: "Room created successfully",
      roomName: room.roomName,
      roomId: room.roomId,
      playerName: room.playerName,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create room",
    });
  }
});

app.post("/api/join-room", async (req, res) => {
  try {
    // Extract data from req.body
    const { roomName, password, playerName } = req.body;

    // Find room in the database
    const room = await Room.findOne({ roomName });

    if (!room) {
      res.status(404).json({
        success: false,
        message: "Room not found",
      });
      return;
    }

    // Generate player ID
    // const playerId = UUID(1).uuid();

    // Add player name to database (Example: adding playerName to room.players array)
    room.players.push({ playerName, playerScore: 0 });
    await room.save();

    res.json({
      success: true,
      message: "Joined room successfully",
      roomName: room.roomName,
      playerName: room.playerName,
    });
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({
      success: false,
      message: "Failed to join room",
    });
  }
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
