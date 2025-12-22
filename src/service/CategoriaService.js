import { http, urlBase } from "./Http"; //aqui llega el token y las configuracines

//1ro obtenemos la lista de categorias
//función para conectarnos a laravel con http
export const index = () =>{
    return http().get(`${urlBase}/categoria`)
}
//guardar una categoria (enviamos los datos)
export const store = (datos) => {
    return http().post(`${urlBase}/categoria`, datos);
}

//mostrar o listar 
export const show = (id) => {
    return http().get(`${urlBase}/categoria/${id}`);
}
//actualizar
export const update = (datos, id) => {
    return http().put(`${urlBase}/categoria/${id}`, datos);
}
//eliminar
export const destroy = (id) => {
    return http().delete(`${urlBase}/categoria/${id}`);
}