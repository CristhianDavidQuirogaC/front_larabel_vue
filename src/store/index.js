import { createStore } from 'vuex'

export default createStore({
  state: {
    //aqui declaramos datos
    //tambien podríamos modificar los estados sin pasar por mutation o actions
    //pero por buenas prácticas debemos de seguir las normas
    contador: 0,
    auth: null
  },
  
  mutations: {
    //modifica los estados o los valores 
    updateAuth(state, datUser){
      state.auth = datUser
    }
  },
  actions: {
    //ejecutamos una mutacion de accion a mutation y luego a state
    //desde aqui tambien podemos conectarnos al backend
    loginVuex(context, datos_usuario){
      context.commit("updateAuth", datos_usuario )
    }
  },
  getters: {
    //obtener informacion o retornar los datos o estados
  },
  modules: {
    //
  }
})
