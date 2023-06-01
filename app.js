import { config } from 'dotenv'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// environment variable path
config({
  path: join(__dirname, 'config', '.env')
})

import express from 'express';
import connectDB from './config/database.js';
import allRoutes from "./seekSocial/routes/index.js"
import cookieParser from "cookie-parser";
import cors from 'cors';
import passport from 'passport';
import { connectPassport } from './utils/googleProvider.js';
import session from "express-session"

const app = express();

app.use(express.json())
app.use(express.urlencoded({
  extended: true,
}))

const corsOptions = {}
if(process.env.NODE_ENV === "production"){
     corsOptions.origin = process.env.FRONTEND_URL,
     corsOptions.credentials = true
}else{
  corsOptions.origin = "*"
}
app.use(cors(corsOptions));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))


app.use(cookieParser())
app.use(passport.authenticate('session'))
app.use(passport.initialize())
app.use(passport.session())


//Connect to the database
connectDB()
connectPassport()


// Serve static files from the "build" directory
app.use(express.static(join(__dirname, "client", "build")));

//Api Routes
app.use("/api", allRoutes)


// Route all other requests to the React app
app.use('*', (req, res) => {
  res.sendFile(join(__dirname, "client", 'build', 'index.html'));
});


// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});