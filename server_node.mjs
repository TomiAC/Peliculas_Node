import express, { response } from 'express'
import cripto from 'node:crypto'
import peliculas from './movies.json' assert {type: 'json'}
import { request } from 'node:http'
import { validarPelicula, validarPeliculaParcial} from './schemas/peliculas.mjs'
import { error } from 'node:console'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT ?? 3000
app.disable('x-powered-by')
app.use(cors())
app.use(express.json())

app.get('/peliculas', (request, respuesta) => {
    const genero = request.query.genre
    if(genero){
        const peliculasFiltradas = peliculas.filter(
            pelicula => pelicula.genre.some(generoPelicula => generoPelicula.toLowerCase() === genero.toLowerCase())
        )
        return respuesta.json(peliculasFiltradas)
    }
    respuesta.json(peliculas)
})

app.get('/peliculas/:id', (request, respuesta) => {
    const id = request.params.id
    const pelicula = peliculas.find(pelicula => pelicula.id === id)
    if(pelicula){
        return respuesta.json(pelicula)
    } else{
        respuesta.status(404).send('Pelicula no encontrada')
    }
})

app.post('/peliculas', (request,respuesta) => {
    const peliculaValidada = validarPelicula(request.body)

    if(peliculaValidada.error){
        return respuesta.status(400).json({ error: JSON.parse(peliculaValidada.error.message)})
    }

    const nuevaPelicula = {
        id : crypto.randomUUID(),
        ...peliculaValidada.data
    }

    peliculas.push(nuevaPelicula)

    respuesta.status(201).json(nuevaPelicula)
})

app.patch('/peliculas/:id', (request, respuesta) => {
    const id = request.params.id
    const datosAActualizar = validarPeliculaParcial(request.body)

    if(datosAActualizar.error){
        return respuesta.status(400).send({error : JSON.parse(datosAActualizar.error.message)})
    }

    const pelicula = peliculas.findIndex(pelicula => pelicula.id === id)
    
    if(pelicula==-1){
        return respuesta.status(400).send('Pelicula no encontrada')
    }

    const peliculaActualizada = {
        ...peliculas[pelicula],
        ...datosAActualizar.data
    }
    peliculas[pelicula]=peliculaActualizada

    respuesta.status(200).json(peliculaActualizada)
})

app.delete('/peliculas/:id', (request,respuesta) => {
    const id = request.params.id
    const pelicula = peliculas.findIndex(pelicula => pelicula.id === id)

    if(pelicula==-1){
        return respuesta.status(400).send('Pelicula no encontrada')
    }

    peliculas.splice(pelicula, 1)

    return respuesta.status(200).send('Mensaje eliminado')
})

app.use((request, respuesta) => {
    respuesta.status(404).send('Pagina no encontrada 404')
})

app.listen(PORT, () => {
    console.log('El servidor esta escuchando en: ', PORT)
})
