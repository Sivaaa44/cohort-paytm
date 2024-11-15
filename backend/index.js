require("dotenv").config();
const express = require("express");
const app = express();
const {mongodbConnect} = require("./db");
const rootRouter = require("./routes/index.js");
const cors = require("cors");


app.use(express.json())
app.use(cors());

mongodbConnect();
app.use("/api/v1", rootRouter);


app.listen(3000, ()=>{
    console.log("server has been up and running")
})
