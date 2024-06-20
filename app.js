import express, { response } from 'express'
import cors from 'cors'
import { peliculasRouter } from './routes/peliculas.js'

const app = express()
const PORT = process.env.PORT ?? 3000

app.disable('x-powered-by')
app.use(cors())
app.use(express.json())

app.use('/peliculas', peliculasRouter)

app.use((request, respuesta) => {
    respuesta.status(404).send('Pagina no encontrada 404')
})

app.listen(PORT, () => {
    console.log('El servidor esta escuchando en: ', PORT)
})
