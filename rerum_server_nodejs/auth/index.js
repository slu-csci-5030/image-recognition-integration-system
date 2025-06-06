import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
// import { auth } from 'express-oauth2-jwt-bearer' // Auth temporarily disabled

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

// === MongoDB Setup ===
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/rerum", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB")
}).catch((err) => {
    console.error(" MongoDB connection error:", err)
})


const historySchema = new mongoose.Schema({
    imageUrl: String,
    metadata: Object,
    createdAt: { type: Date, default: Date.now }
})
const History = mongoose.model('History', historySchema)

// === Temporarily Disabled Auth ===
// const _tokenError = function (err, req, res, next) { ... }
// const _extractUser = (req, res, next) => { ... }
// const checkJwt = [READONLY, auth(), _tokenError, _extractUser]

//  Temporary replacement for checkJwt middleware
const checkJwt = (req, res, next) => {
    req.user = {
        name: 'dev-user',
        email: 'dev@example.com',
        sub: 'auth0|mock-user-id'
    }
    next()
}

const generateNewAccessToken = async (req, res, next) => {
    console.log("RERUM v1 is generating a proxy access token.")
}

const generateNewRefreshToken = async (req, res, next) => {
    console.log("RERUM v1 is generating a new refresh token.")
}

const isGenerator = (obj, userObj) => {
    return userObj[process.env.RERUM_AGENT_CLAIM] === obj.__rerum.generatedBy
}

const isBot = (userObj) => {
    return process.env.BOT_AGENT === userObj[process.env.RERUM_AGENT_CLAIM]
}

function READONLY(req, res, next) {
    if (process.env.READONLY == "true") {
        res.status(503).json({ "message": "RERUM v1 is read only at this time. Try again later." })
        return
    }
    next()
}


app.post('/history', async (req, res) => {
    try {
        const newEntry = new History(req.body)
        await newEntry.save()
        res.status(201).json(newEntry)
    } catch (err) {
        console.error("Failed to save history item:", err)
        res.status(500).json({ error: err.message })
    }
})

app.get('/history', async (req, res) => {
    try {
        const entries = await History.find().sort({ createdAt: -1 })
        res.status(200).json(entries)
    } catch (err) {
        console.error("Failed to fetch history items:", err)
        res.status(500).json({ error: err.message })
    }
})


app.get('/', (req, res) => {
    res.send('RERUM API is running. Use /history to interact with data.')
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(` RERUM server running on http://localhost:${PORT}`)
})
