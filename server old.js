// run 'gcloud app deploy' in terminal to deploy to google cloud app engine

const express = require("express");
const UUID = require("uuid-int");
const room_generator = UUID(0); // generator for room ids
const player_generator = UUID(1); // generator for player ids
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

// Routes
app.post("/api/create-room", (req, res) => {
  // Handle creating a new room
  // Extract data from req.body and perform necessary logic
  // Respond with appropriate status and data
  roomId = room_generator.uuid();
  playerId = player_generator.uuid();

  const response = {
    roomId,
    playerId,
  };
  res.json(response);
});

app.post("/api/join-room", (req, res) => {
  // Handle joining an existing room
  // Extract data from req.body and perform necessary logic
  // Respond with appropriate status and data

  // Lookup room name in database and return room id (otherwise return none)

  // Generate player ID:
  playerId = player_generator.uuid();

  // Add player name to database

  const response = {
    roomId: "1234", // Find id using database
    playerId: "abcd", // Create id using uuid
  };
  res.json(response);
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
