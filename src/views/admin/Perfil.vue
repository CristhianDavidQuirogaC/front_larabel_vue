<template>
  <div class="card">
    <h1>Perfil</h1>
    <h1>{{ $store.state }}</h1>
    <button type="button" @click="$store.state.contador++"> ➕</button>

    <!-- verificamos si los datos dl perfil son nulos -->
    <div v-if="datosPerfil">
         {{ datosPerfil }}
    </div>
   
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import * as authService from '../../service/AuthService.js'
export default {
    setup(){
        //ref hace las cosas en tiempo real o de manera reactiva
        const datosPerfil = ref(null)
        //una ves q cargue el componente se ejecuta las funciones 
        //cuando cargue el componente quiero q se ejecute la peticion de 
        // pedir el perfil eso se hace con mounted y debemos de importarlos

        onMounted(async()=>{
            const { data } = await authService.getPerfil()
            datosPerfil.value = data
        })

        return{
            datosPerfil
        }
    }
}
</script>

<style>

</style>