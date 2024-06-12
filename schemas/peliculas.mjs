import zod from 'zod'

const schemaPelicula = zod.object({
    title : zod.string(),
    year : zod.number().int().min(1850).max(2100),
    director : zod.string(),
    duration : zod.number().int().positive(),
    poster : zod.string().url().endsWith('.jpg'),
    rate :  zod.number().min(0).max(10).default(0),
    genre : zod.array(
        zod.enum(['Drama', 'Action', 'Crime', 'Adventure', 'Sci-Fi', 'Romance', 'Animation', 'Biography', 'Fantasy'])
    )
})

export function validarPelicula(objecto) {
    return schemaPelicula.safeParse(objecto)
}

export function validarPeliculaParcial(object){
    return schemaPelicula.partial().safeParse(object)
}