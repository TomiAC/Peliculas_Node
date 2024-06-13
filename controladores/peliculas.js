import { modeloPelicula } from "../modelos/pelicula";
import { validarPelicula, validarPeliculaParcial} from './schemas/peliculas.js'

export class ControladorPelicula{
    
    static async getTodasLasPeliculas(request, respuesta){
        const genero = request.query.genre
        const peliculasFilatradas = await modeloPelicula.getTodasLasPeliculas(genero)
        respuesta.json(peliculasFilatradas)
    }

    static async getID(request, respuesta){
        const id = request.params.id
        const pelicula = await modeloPelicula.getID(id)
        if(pelicula){
            return respuesta.json(pelicula)
        } else{
            respuesta.status(404).send('Pelicula no encontrada')
        }
    }

    static async agregarPelicula(request, respuesta){
        const peliculaValidada = validarPelicula(request.body)
    
        if(peliculaValidada.error){
            return respuesta.status(400).json({ error: JSON.parse(peliculaValidada.error.message)})
        }

        const nuevaPelicula = await modeloPelicula.agregarPelicula(peliculaValidada.data)

        respuesta.status(201).json(nuevaPelicula)
    }

    static async modificarPelicula(request, respuesta){
        const id = request.params.id
        const datosAActualizar = validarPeliculaParcial(request.body)

        if(datosAActualizar.error){
            return respuesta.status(400).send({error : JSON.parse(datosAActualizar.error.message)})
        }
        
        const peliculaActualizada = await modeloPelicula.modificarPelicula(id, datosAActualizar)

        if(peliculaActualizada==-1){
            return respuesta.status(400).send('Pelicula no encontrada')
        }

        respuesta.status(200).json(peliculaActualizada)
    }

    static async eliminarPelicula(request, respuesta){
        const id = request.params.id
        const peliculaEliminada = await modeloPelicula.eliminarPelicula(id)
        if(peliculaEliminada==false){
            return respuesta.status(400).send('Pelicula no encontrada')
        }
        return respuesta.status(200).send('Pelicula eliminada')
    }
}