<template>
    <!-- <h1>Login</h1>
    <h1>{{ $store.state }}</h1>
    no necesitamos escribir credenciales.value
    <h1>{{ credenciales }}</h1>
    <hr>
    <button type="button" @click="$store.state.contador++"> ➕</button>
    
    <input type="email" v-model="credenciales.email">
    <br>
    <input type="password" v-model="credenciales.password">
    <br>
    <button type="button" @click="login()">Ingresar</button> -->

    <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
            
            <div class="col-12 xl:col-6" style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, var(--primary-color)10%, rgba(33, 150, 243, 0) 30%);">
                <div class="h-full w-full m-0 py-7 px-4" style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
                    <div class="text-center mb-5">
                        <img src="layout/images/avatar.png" alt="Image" height="50" class="mb-3">
                        <div class="text-900 text-3xl font-medium mb-3">Bienveni@, Empresa</div>
                        <span class="text-600 font-medium">Inicia sesión para continuar</span>
                    </div>
                
                    <div class="w-full md:w-10 mx-auto">
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Correo electrónico</label>
                        <InputText id="email1" v-model="credenciales.email" type="text" class="w-full mb-3" placeholder="Correo electrónico" style="padding:1rem;" />
                
                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="credenciales.password" placeholder="Contraseña" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>
                
                        <div class="flex align-items-center justify-content-between mb-5">
                            <div class="flex align-items-center">
                                <Checkbox id="rememberme1" v-model="credenciales.checked" :binary="true" class="mr-2"></Checkbox>
                                <label for="rememberme1">Recordar</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Se te olvido tu contraseña?</a>
                        </div>
                        <Button label="INGRESAR" @click="login()" class="w-full p-3 text-xl"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
// ref hace reactivo es decir q captura los datos o cambios
//import { ref } from '@vue/reactivity'
// en vue3 se puede importar solo con la siguiente linea
import { ref } from 'vue'
import * as authService from '@/service/AuthService.js'
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex'
import { Buffer } from "buffer"


export default{
    //setup hace toda la logica de VUE 
     setup(){
        //redireccionamos para eso impotamos useRouter
        const router = useRouter()
        const store = useStore()
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
                //coneccion con laravel
                const res = await authService.loginLaravel(credenciales.value)
                console.log(res) //captura el valor
                //almacenamos con Vuex pero antes importamos el state y actualizamos
                store.dispatch('loginVuex', res.data)
                //ciframos los datos antes de cuardarlo importando una clase
                const base64Token = Buffer.from(res.data.acces_token).toString('base64');
                //guardamos en el local
                localStorage.setItem("token", base64Token);
                //luego decodificamos pero en el http
                //redireccionamos al perfil
                router.push({name: 'Perfil'})

            } catch (error){
                 console.log(error);
            }
            
        }

        return{
            credenciales,
            login,
            checked: false

        }
     }
}
</script>

