import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const peliculas = require("./movies.json");
import cripto from 'node:crypto'

export class modeloPelicula{
    static async getTodasLasPeliculas(genero) {
        if(genero){
            peliculas.filter(
                pelicula => pelicula.genre.some(generoPelicula => generoPelicula.toLowerCase() === genero.toLowerCase())
            )
            return peliculas
        }
        return peliculas
    }

    static async getID(id){
        const pelicula = peliculas.find(pelicula => pelicula.id === id)
        return pelicula
    }

    static async agregarPelicula(pelicula){
        const nuevaPelicula = {
            id : cripto.randomUUID(),
            ...pelicula
        }
        peliculas.push(nuevaPelicula)
        return nuevaPelicula
    }

    static async modificarPelicula(id, datosAActualizar){
        const pelicula = peliculas.findIndex(pelicula => pelicula.id === id)
        if(pelicula!=-1){
            const peliculaActualizada = {
                ...peliculas[pelicula],
                ...datosAActualizar.data
            }
            peliculas[pelicula]=peliculaActualizada
            return peliculaActualizada
        }
        return pelicula
    }

    static async eliminarPelicula(id){
        const pelicula = peliculas.findIndex(pelicula => pelicula.id === id)
        if(pelicula!=-1){
            peliculas.splice(pelicula, 1)
            return true
        }
        return false
    }
}