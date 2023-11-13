import express from 'express'
import { envConfig } from './shared/config'

const PORT = envConfig.PORT;
const app = express()
app.use(express.json())

app.get("/ping", (_, res )=> {
    console.log("1 request")
    res.send("pong")
})

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`)
})