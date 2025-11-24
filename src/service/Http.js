// Este el el interceptor quien va a conectar las peticiones
// dhacia la base de datos y lo va a configurar con AXIOS 
//con este archivo tendremos varios servicios como el Authser
//quien se va a encargar de hacer peticiones al Backend
import axios from "axios"

export const urlBase = "http://127.0.0.1:8000/api";

/**
 * esta funcion se encargará de configurar las peticiones 
 * al servidor
 * @return Axios
*/

export function http(){
    let token = localStorage.getItem("token");
    //con axios siempre se debe de enviar cabeceras
    //esta configuración se la hace una sola vez
    //esta es la solicitud del encabezado
    
    const interceptor = axios.create({
        baseURL: urlBase,
        headers: {
            'Accept':' application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        timeout: 15000
    });
    //antes de que pase a la vista aquí 
    //podemos realizar la captura de errores (401, 403)
    interceptor.interceptors.response.use(
        (response) => {
            return response;
        },
        (error)=>{
            alert(error.response.status);
            if(error.response.status === 401){
                //suponemos que aqui quieren vulnerar nuestra App
                // si hay error 401 limpiamos el localSto y refrescamos la pagina
                localStorage.removeItem("token")
                //window.location.href = "/login";
            }
            if(error.response.status === 403){
                alert("no tienes permisos")
            }
            
        }
    );

    //ahora retornamos 
    return interceptor;
}
