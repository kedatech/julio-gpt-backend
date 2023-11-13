import { Router } from "express"

const router = Router()

router.get("/", (_, res)=> {
    res.send("chat endpoint")
})  

export { router }