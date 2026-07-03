Para garantizar la calidad:
Hemos usado para los tests en primer lugar el formato y metodología CI/CD por su gran velocidad deteccion de errores, que puede probar las funcionalidades en cuanto a la base de datos, y usa las mismas funciones con las que el front llama directamente al back, su facilidad para evitar un deploy fallido, y los tests que corren en cada commit.

Tests CI/CD:
1. Usuario crea una cuenta nueva correctamente --> se agrega una cuenta nueva a la base de datos, se recibe el nombre se usuario ingresado desde el query para asegurarse del buen funcionamiento.
2. Usuario intenta crear una cuenta ya existente --> el front recibe una notificación que le avisa que el usuario ya existe desde antes.
3. Usuario inicia sesión correctamente--> el front recibe tokens para futuras interacciones y su propia lista personalizada de películas.
4. Usuario intenta iniciar sesion en cuenta inexistente --> el front recibe un mensaje de que o el nombre de usuario o contraseña son inválidos.
5. Usuario intenta iniciar sesion en con contraseña incorrecta --> el front recibe un mensaje de que o el nombre de usuario o contraseña son inválidos.
6. Usuario añade una película a su lista --> la película es agragada a la base de datos y el front puede recibir el nombre de la película que acaba de enviar.
7. Usuario inteta añadir película ya presente en su lista --> front recibe mensaje de que la película ya es parte de su lista.
8. Usuario intenta añadir una película no existente a su lista --> en caso de que el front por alguna razón muestra una película no presente en la base de datos, reciba la notificación de que no existe.
9. Usuario elimina una película de su base de datos --> el front es notificado que la película fue eliminada una vez ejecutado el query.

También usamos tests E2E, ya que son los que hacen que sepamos que los botones del frontend estan presentes y funcionan.
Tests E2E:
1. Usuario busca una película existente por nombre. --> Solo esta presente la película.
2. Usuario busca película no existente. --> La págino no muestra ninguna película.
3. Usuario busca películas de romance --> Página solo muestra películas de ese género.