import pg from 'pg'

const client = new pg.Client({
    user: 'postgres',
    password: 'Tomi2024',
    host: 'localhost',
    port: '5432',
    database: 'Proyecto_Peliculas'
})

await client.connect()

export class modeloPelicula{

    static async getTodasLasPeliculas(genero) {
        
        try{
            const respuesta = await client.query('SELECT * FROM generos')
            const generos = respuesta.rows

            const respuestaPeliculas = await client.query('SELECT * FROM peliculas')
            let peliculas = respuestaPeliculas.rows

            if(genero){
                let generoValido = false
                let generoID
                generos.map((valor) => {
                    if(valor.nombre == genero){
                        generoValido = true
                        generoID = valor.id
                    }
                })

                if(generoValido){

                    const respuestaGenerosPelicula = await client.query('SELECT * FROM peliculas_generos WHERE id_generos = $1', [generoID])
                    const IDpeliculas = respuestaGenerosPelicula.rows.map((value) => {
                        return value.id_peliculas
                    })
                    peliculas = peliculas.filter(aux => IDpeliculas.includes(aux.id))

                    return peliculas
                }else{
                    return {message: 'El genero solicitado no es valido'}
                }
            }

            return peliculas
        }catch(error){
            console.log(error.message)
        }

    }

    static async getID(id){

        try{
            const respuestaPeliculas = await client.query('SELECT * FROM peliculas WHERE id= $1 ', [id])
            let pelicula = undefined
            respuestaPeliculas.rows.map((aux)=>{
                if(aux.id == id){
                    pelicula = aux
                }
            })

            return pelicula
        }catch(error){
            console.log(error.message)
        }
    }

    static async agregarPelicula(pelicula){

        try{
            const {
                title,
                year,
                director,
                duration,
                poster,
                rate
            } = pelicula

            const uuidRespuesta = await client.query('SELECT gen_random_uuid ()')
            const uuid = uuidRespuesta.rows[0].gen_random_uuid

            await client.query('INSERT INTO peliculas (id, anio, poster, puntuacion, titulo, director, duracion) VALUES ($1, $2, $3, $4, $5, $6, $7)', [uuid, year, poster, rate, title, director, duration])
            
            const nuevaPeliculaRespuesta = await client.query('SELECT * FROM peliculas WHERE id= $1 ', [uuid])
            const nuevaPelicula = nuevaPeliculaRespuesta.rows

            const respuestaGeneros = await client.query('SELECT * FROM generos')
            const generos = respuestaGeneros.rows
            console.log(generos)

            generos.map((valor)=>{
                if(pelicula.genre.includes(valor.nombre)){
                    console.log('hola')
                    client.query('INSERT INTO peliculas_generos(id_peliculas, id_generos) VALUES ($1, $2)', [uuid, valor.id])
                }
            })
            
            return nuevaPelicula
        }catch(error){
            console.log(error.message)
        }
    }

    static async modificarPelicula(id, datosAActualizar){
        
        try{
            const respuestaPelicula = await client.query('SELECT * FROM peliculas WHERE id= $1 ', [id])
            const pelicula = respuestaPelicula.rows
            console.log(pelicula)

            if(pelicula!=[]){
                const peliculaActualizada = {
                    ...pelicula[0],
                    ...datosAActualizar.data
                }

                const respuestPeliculaActualizada = await client.query('UPDATE peliculas SET titulo=$1, anio=$2, poster=$3, puntuacion=$4, director=$5, duracion=$6 WHERE id=$7', [peliculaActualizada.titulo, peliculaActualizada.anio, peliculaActualizada.poster, peliculaActualizada.puntuacion, peliculaActualizada.director, peliculaActualizada.duracion, peliculaActualizada.id])

                return peliculaActualizada
            }
            return -1
        }catch(error){
            console.log(error.message)
        }
    }

    static async eliminarPelicula(id){

        try{
            const respuestaPeliculaEliminada = await client.query('DELETE FROM peliculas WHERE id=$1', [id])
            console.log(respuestaPeliculaEliminada)

            return true
        }catch(error){
            console.log(error.message)
        }
    }
}