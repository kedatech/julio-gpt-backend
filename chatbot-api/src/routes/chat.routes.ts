import { Router } from "express"
import { chatHandler } from '../controllers/chat.controllers'

const router = Router()

router.post("/", chatHandler)  

export { router }