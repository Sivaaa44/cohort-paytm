const express = require("express");
const z = require("zod");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { Authmiddlewere } = require("../middlewere");


const JWT_SECRET = process.env.JWT_SECRET; 


const signupSchema = z.object({
    username: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    password: z.string()
});

const signinSchema = z.object({
    username: z.string(),
    password: z.string()
});

const updateSchema = z.object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    password: z.string().optional()
});


userRouter.post("/signup", async (req, res) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(411).json({ msg: "Incorrect input format", errors: parsed.error.errors });
    }

    const existingUser = await User.findOne({
         username: req.body.username 
        });
    if (existingUser) {
        return res.status(401).json({ msg: "User already exists" });
    }

    const user = await User.create(req.body);

    const userId = user._id;
    await Account.create({
        userId,
        balance : 1 + Math.random()*1000
    })
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ msg: "User created successfully", token });
});

// POST route for signin
userRouter.post("/signin", async (req, res) => {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(411).json({ msg: "Invalid input", errors: parsed.error.errors });
    }

    const user = await User.findOne({ username: req.body.username, password: req.body.password });
    if (user) {
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
        return res.json({ token });
    } else {
        return res.status(401).json({ msg: "Invalid credentials" });
    }
});

// PUT route to update user data
userRouter.put("/", Authmiddlewere, async (req, res) => {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(411).json({ msg: "Invalid inputs for updating user data", errors: parsed.error.errors });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
        if (updatedUser) {
            return res.json({ msg: "User data updated successfully", user: updatedUser });
        } else {
            return res.status(500).json({ msg: "User not found or update failed" });
        }
    } catch (err) {
        console.error("Error updating user data:", err);
        return res.status(500).json({ msg: "Error updating user data", error: err.message });
    }
});

userRouter.get("/bulk", async(req,res)=>{
    const filter =   req.query.filter || "";
    const users = await User.find({
        $or : [{
            firstname : {
                "$regex" : filter
            }},{
            lastname : {
                "$regex" : filter
            }
        }]
    })
    res.json({
        user: users.map((user)=>({
            username : user.username,
            firstname : user.firstname,
            lastname : user.lastname,
            _id : user._id
        }))
    })
})

module.exports = userRouter;

