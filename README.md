Vercel: https://proyecto-unkn.vercel.app/

Catalogo de peliculas

Aquí se vera un catálogo de películas similar el de un sevicio de streaming, puedes filtrar el contenido o agregar peliculas a tu lista

Para filtrar, solo hace falta hacer click en la flecha de arriba a la derecha, donde se abrira un menú donde puedes seleccionar los géneros que quieres ver o buscar una película por su nombre

Para agregar una película a tu lista, haz click en cualquier instancia en la que se te muestra adentro del catálogo, aparecerá un pop up que te preguntará si quieres tenerla en tu lista o no.

Tambien puedes activar el modo oscuro, tocando el input de arriba a la derecha.


Este proyecto usa astro para separar cada isla. Css con variables para poder cambiar rápidamente del modo claro al oscuro sin necesidad de demasiado código. En javascript se guardan las películas ya existentes en objetos que indican el nombre de la película, la portada, sus géneros, en que parte del catalogo aparece y si es parte de "Mi Lista". Al empezar, se agregan todas las películas en sus correspondiendes lugares, y al filtrarlas, se eliminan todas y se muestran solo aquellas que coindiden con el filtro.