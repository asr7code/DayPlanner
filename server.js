const express = require("express");
const mongoose = require("mongoose");

const User = require("./models/User");
const Task = require("./models/Task");

const app = express();

app.use(express.json());
app.use(express.static("public"));

/* ======================
   MongoDB Connection
====================== */
mongoose.connect("mongodb://127.0.0.1:27017/Proj_DB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/public/index.html");
});

/* ======================
   REGISTER
====================== */
app.post("/register", async(req,res)=>{

    const { name, email } = req.body;

    if(!name || !email){
        return res.json({ message:"All fields required" });
    }

    let user = await User.findOne({ email });

    if(user){
        return res.json({ message:"User already exists" });
    }

    user = new User({ name, email });
    await user.save();

    res.json({
        message:"Registered successfully!",
        userId:user._id
    });
});

/* ======================
   LOGIN
====================== */
app.post("/login", async(req,res)=>{

    const { email } = req.body;

    const user = await User.findOne({ email });

    if(!user){
        return res.json({ message:"User not found" });
    }

    res.json({
        message:"Login successful!",
        userId:user._id,
        name:user.name
    });
});

/* ======================
   ADD TASK
====================== */
app.post("/add-task", async(req,res)=>{

    const { userId, title, time, category } = req.body;

    if(!userId){
        return res.json({ message:"Login required" });
    }

    const task = new Task({
        userId,
        title,
        time,
        category
    });

    await task.save();

    res.json({ message:"Task added!" });
});

/* ======================
   GET TASKS
====================== */
app.get("/tasks/:userId", async(req,res)=>{

    const tasks = await Task.find({
        userId:req.params.userId
    });

    res.json(tasks);
});

/* ======================
   UPDATE TASK CHECKBOX
====================== */
app.put("/task/:id", async(req,res)=>{

    await Task.findByIdAndUpdate(req.params.id,{
        completed:req.body.completed
    });

    res.json({ message:"Updated" });
});

/* ======================
   DAILY RESET
====================== */
app.post("/daily-reset/:userId", async(req,res)=>{

    const today = new Date().toDateString();

    const tasks = await Task.find({
        userId:req.params.userId
    });

    for(let task of tasks){

        if(task.lastResetDate !== today){
            task.completed = false;
            task.lastResetDate = today;
            await task.save();
        }
    }

    res.json({ message:"Reset checked" });
});

/* ====================== */
app.listen(3000, ()=>{
    console.log("Server running on port 3000");
});
