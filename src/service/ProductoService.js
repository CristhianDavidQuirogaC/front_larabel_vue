//Como es un Crud copiamos de categoria para seguir el formato
import { http, urlBase } from "./Http"; //aqui llega el token y las configuracines

//1ro obtenemos la lista de categorias
//función para conectarnos a laravel con http
//necesitamos saber el numero de datos por pagina. agregamos una variable q
// si no se envía ese parámetro, por defecto iniciará en 1
export const index = (page=1, rows=5, q=null) =>{
    //no solo se puede enviar la pagina sino caracteristicas de orden o mas opciones
    return http().get(`${urlBase}/producto?page=${page}&rows=${rows}&q=${q}`);
}
//guardar una categoria (enviamos los datos)
export const store = (datos) => {
    return http().post(`${urlBase}/producto`, datos);
}

//mostrar o listar 
export const show = (id) => {
    return http().get(`${urlBase}/producto/${id}`);
}
//actualizar debe ser metodo put
export const update = (datos, id) => {
    return http().put(`${urlBase}/producto/${id}`, datos);
}
//eliminar
export const destroy = (id) => {
    return http().delete(`${urlBase}/producto/${id}`);
}
//la imagen se enviara por formData (formulario de datos)
export const actualizarImagen = (formData, id) =>{
    return http().post(`${urlBase}/producto/${id}/actualizar-img`, formData);
}
