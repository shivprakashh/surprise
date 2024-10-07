const express = require("express");
const app = express();
const path = require("path");
const mime = require("mime-types");
const http = require("https");
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
const PORT = process.env.PORT || 4900;
require('dotenv').config();
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json())
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads")); // Directory for uploads
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept video files only
        if (file.mimetype === "video/webm") {
            cb(null, true);
        } else {
            cb(new Error("Not a video file!"), false);
        }
    }
});
// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
        const mimeType = mime.lookup(path);
        if (mimeType) {
            res.setHeader('Content-Type', mimeType);
        }
    }
}));

//const Option = {
  //  key: fs.readFileSync(path.join(__dirname, "server.key")), // Correct path
    //cert: fs.readFileSync(path.join(__dirname, "server.cert")) // Correct path
//}
app.get("/",(req,resp)=>{
    console.log("enter into / and user agent is",req.get("User-Agent"));
    resp.sendFile(path.join(__dirname,"public","index.html"));
})
app.get("/myview",(req,resp)=>{
    resp.sendFile(path.join(__dirname,"public","myview.html"))
})
app.post("/password",(req,resp)=>{

if(req.body.email){
    const right = "thetnaing1";
    const value = req.body.email;
    if(value === right){
        resp.send({message:"thet54321()()"});
    }else{
        resp.send({message:"wrong"})
    }
}else{
    resp.send("error")
}
   
})
app.post("/delete", (req, resp) => {
    const { filename } = req.body; // Extract the filename from the request body

    if (!filename) {
        return resp.status(400).send("Filename is required.");
    }

    const filePath = path.join(__dirname, "uploads", filename); // Create the full path to the file

    fs.unlink(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return resp.status(404).send("File not found."); // File does not exist
            }
            console.error(err);
            return resp.status(500).send("Error deleting file."); // Other server error
        }
        resp.send("File deleted successfully."); // Success response
    });
});

app.post("/namelist", (req, resp) => {
    console.log("enter into namelist");
    fs.readdir("uploads", (err, files) => {
        if (err) {
            console.error(err, "Unable to scan files");
            
        }
        console.log(files, "This is the file name");
        resp.send(files);
    });
});
app.post("/upload",upload.single("video"),(req,resp)=>{
    console.log("Video uploaded:", req.file);
    if (!req.file) {
        return resp.status(400).json({ message: "No file uploaded." });
    }
    console.log("Video uploaded:", req.file);
    resp.json({ message: "Video uploaded successfully!", file: req.file });
})
app.use(express.static(path.join(__dirname,"public")))
//http.createServer(Option,app).listen(4200,()=>{
  //  console.log("listening on 4100");
//})
app.listen(PORT,'0.0.0.0',()=>{
    console.log("server is running...")
})