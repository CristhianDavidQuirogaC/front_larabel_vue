//Aqui llegará el interceptor que está en Http.js
//import * as httoIntercep from "./Http.js"  //importa todas sus funcines
import { http } from "./Http" //importamos solo lo q necesitamos

/**
 * Para conectar con laravel (Login)
 * @param {email, password} datosUsuario 
 */
export function loginLaravel(datosUsuario){
    //para conectarnos a laravel  lo haremos con http
    //hace la peticion a la base de datos mandando los datos
    return http().post("/v1/auth/login", datosUsuario);    
}
 /**
  * Para conectar con laravel (Perfil)
  * @returns perfil del usuario logueado
  */
export const getPerfil = function(){
    return http().get("/v1/auth/perfil");
    
}

/**
 * para conectarnoa a Laravel (usuario Logueado)
 * @returns al usuario logueado
 */
export const logOut = ()=>{
    return http().post("/v1/auth/logout");
}


