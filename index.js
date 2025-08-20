const express = require("express");
const ImageKit = require("imagekit");
const CORS = require("cors");
const keys = require("dotenv").config();

const app = express();
const PORT = 8000;

// Initialize ImageKit
var imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const allowedOrigins = process.env.ALLOWED_ORIGIN.split(",").map((s) =>
  s.trim()
);

// Middleware to handle CORS
app.use(
  CORS({
    origin: allowedOrigins, // Allow these origins
    methods: ["GET", "POST"], // Allow only GET and POST methods
  })
);

app.get("/ik-auth", (req, res) => {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  console.log(authenticationParameters);
  res.json(authenticationParameters);
});

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
