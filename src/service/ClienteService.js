import { http, urlBase } from "./Http"; //aqui llega el token y las configuracines

//1ro obtenemos la lista de categorias
//función para conectarnos a laravel con http
export const index = (q=null) =>{
    return http().get(`${urlBase}/cliente?q=${q}`);
}
//guardar una cliente store va a "enviar información para registrar" y van a llegar los datos
export const store = (datos) => {
    return http().post(`${urlBase}/cliente`, datos);
}

//mostrar o listar 
export const show = (id) => {
    return http().get(`${urlBase}/cliente/${id}`);
}
//actualizar
export const update = (datos, id) => {
    return http().put(`${urlBase}/cliente/${id}`, datos);
}
//eliminar
export const destroy = (id) => {
    return http().delete(`${urlBase}/cliente/${id}`);
}