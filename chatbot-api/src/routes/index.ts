import { Router } from 'express'
const router = Router()
import { readdirSync} from 'fs'
const path = __dirname

const removeExtension = (fileName: string) => fileName.split(".").shift()

readdirSync(path).forEach((file: string) => {
  const name = removeExtension(file)
  if (name != "index") {
    import(`./${name}.routes`).then((module)=> {
        console.log("Se esta cargando la ruta " + name)
        router.use(`/${name}`, module.router)
    })
  }
})

export { router }