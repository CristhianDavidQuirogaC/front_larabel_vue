//Como es un Crud copiamos de categoria para seguir el formato
import { http, urlBase } from "./Http"; //aqui llega el token y las configuracines

//1ro obtenemos la lista de categorias
//función para conectarnos a laravel con http
//necesitamos saber el numero de datos por pagina. agregamos una variable
export const index = (page=1) =>{
    //no solo se puede enviar la pagina sino caracteristicas de orden o mas opciones
    return http().get(`${urlBase}/producto?page=${page}`);
}
//guardar una categoria (enviamos los datos)
export const store = (datos) => {
    return http().post(`${urlBase}/producto`, datos);
}

//mostrar o listar 
export const show = (id) => {
    return http().get(`${urlBase}/producto/${id}`);
}
//actualizar
export const update = (datos, id) => {
    return http().put(`${urlBase}/producto/${id}`, datos);
}
//eliminar
export const destroy = (id) => {
    return http().delete(`${urlBase}/producto/${id}`);
}
