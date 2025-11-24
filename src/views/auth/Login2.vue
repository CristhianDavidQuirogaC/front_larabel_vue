<template>
    <h1>Login</h1>
    <!-- no necesitamos escribir credenciales.value -->
    <h1>{{ credenciales }}</h1>
    
    <input type="email" v-model="credenciales.email">
    <br>
    <input type="password" v-model="credenciales.password">
    <br>
    <button type="button" @click="login()">Ingresar</button>

</template>

<script>
// ref hace reactivo es decir q captura los datos o cambios
//import { ref } from '@vue/reactivity'
// en vue3 se puede importar solo con la siguiente linea
import { ref } from 'vue'
import * as authService from '@/service/AuthService.js'
import { useRouter, useRoute } from 'vue-router';

export default{
    //setup hace toda la logica de VUE 
     setup(){
        //redireccionamos para eso impotamos useRouter
        const router = useRouter()
        const credenciales = ref({email: '', password: '' });
        const login = async () => {
            //conectará con laravel usando el servicio AuthService
            //lo de abajo es la manera de hacer con promesas de JS
            /*authService.loginLaravel(credenciales.value).then(res => {
                console.log(res)
            }).catch(error => {
                console.log(error);
            })
            */
            // AHORA CON AXIOS
            //comunicamos con axios, antes importamos AuthService
            //como esperamos la solicitud usamos async await
            try{
                //axios retorna la respuesta en el apartado data
                const res = await authService.loginLaravel(credenciales.value)
                console.log(res)
                //debemos de capturar los datos o la respuesta
                localStorage.setItem("token", res.data.acces_token)
                router.push({name: 'Perfil'})
            } catch (error){
                 console.log(error);
            }
            
        }

        return{
            credenciales,
            login

        }
     }
}
</script>