let pagina=1;
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');

btnSiguiente.addEventListener('click', () => {
  if(pagina<25)
    pagina += 1;
    cargarPeliculas();
})

btnAnterior.addEventListener('click', () =>{
    if(pagina > 1){
        pagina -= 1;
        cargarPeliculas();
    }
})

 // Realiza una sola solicitud a la API con el link combinado
async function getGenreNames(genreIds) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=7ad7d5d27bd2ddd0854c605f07fa7fdc&language=es-PE`
        );
        if (response.status === 200) {
            const data = await response.json();

            const genreNames = genreIds.map(genreId => {
                const genre = data.genres.find(genre => genre.id === genreId);
                return genre ? genre.name : '';
            });
            return genreNames.join(', ');
        } else {
            return 'Genre not found';
        }
    } catch (error) {
        console.error(error);
        return 'Error fetching genre';
    }
}
 // Realiza una sola solicitud a la API con el link combinado
async function cargarPeliculas() {
    try {
        const respuesta = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=71f5f9cb6ee848eb836ee79a4d50a7ba&language=es-PE&page=${pagina}`
        );

        if (respuesta.status === 200) {
            const datos = await respuesta.json();

            let peliculas = '';
            for (const pelicula of datos.results) {
                const genreNames = await getGenreNames(pelicula.genre_ids);
                peliculas += `
                <div class="pelicula">
                <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
                <marquee><h3>${pelicula.title}<h3></marquee>
                <br>
                 <h5>${pelicula.vote_average} <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i></h5>
                <br>
                <h6 class="sinopsis">Género: ${genreNames}</h6>
                <h5> ${pelicula.release_date}</h5>
                <br><hr>
                <h6 class=""sipnosis">${pelicula.overview}</h6>
                </div> 
                
                
                `;
            }
            document.getElementById('contenedor').innerHTML = peliculas;
        } else if (respuesta.status === 401) {
            console.log('Pusiste la llave incorrecta');
        } else if (respuesta.status === 404) {
            console.log('La Película que buscas no existe');
        } else {
            console.log('Hubo un error y no sabemos qué pasó');
        }
    } catch (error) {
        console.log(error);
    }
}

cargarPeliculas();