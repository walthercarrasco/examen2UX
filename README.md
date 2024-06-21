## createUser

Crea un usuario

**Parametros:**
- body.`email`: correo del usuario.
- body.`pass`: contraseña del usuario.


## logIn

Inicia sesion en la cuenta de un usuario.

**Parametros:**
- body.`email`: correo del usuario.
- body.`pass`: contraseña del usuario.


## logOut

Cierra sesion del usuario que se encuentra logueado.


## createPost

Crea un post del usuario que esta logueado.

**Parametros:**
- body.`title`: Titulo del post.
- body.`description`: Contenido o descripcion del post.


## listPost

Lista todos los post del usuario que se encuentra logueado.

## esitPost

Edita un post con un id de post en especifico del usuario logueado (el id no se puede modificar).

**Parametros:**
- params.`id`: (/esitPost/<id post>) id del post a modificar.
- body.`title`: Titulo al que se modificara el post.
- body.`description`: Contenido o descripcion  a la que se modificara el post.


## deletePost

Elimina un post en especifico del usuario logueado por medio del id.

**Parametros:**
- params.`id`: (/deletePost/<id post>) id del post a eliminar.