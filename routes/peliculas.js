import { Router } from "express";
import { ControladorPelicula } from "../controladores/peliculas.js";

export const peliculasRouter = Router()

peliculasRouter.get('/', ControladorPelicula.getTodasLasPeliculas)

peliculasRouter.get('/:id', ControladorPelicula.getID)

peliculasRouter.post('/', ControladorPelicula.agregarPelicula)

peliculasRouter.patch('/:id', ControladorPelicula.modificarPelicula)

peliculasRouter.delete('/:id', ControladorPelicula.eliminarPelicula)