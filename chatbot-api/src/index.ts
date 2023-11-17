import express from 'express'
import path from 'path'
import { envConfig } from './shared/config/env'
import { router as chatRouter} from './routes/chat.routes'

const PORT = envConfig.PORT;
const app = express()
app.use(express.json())

// get images
app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/images/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.sendFile(path.join(__dirname, '../public', 'images', imageName));
});
  

app.use("/api/chat", chatRouter)

app.get("/ping", (_, res )=> {
    console.log("1 request")
    res.send("pong")
})

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`)
})