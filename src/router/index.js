import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import App from '../App.vue'
import Login from '../views/auth/Login2.vue'
import Perfil from '../views/admin/Perfil.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    //ruta para el administrador
    path: '/admin',
    name: 'Admin',
    component: App,
    meta: {requireAuth: true}, //esto es una proteccion de ruta
    chidren: [
      {
        path: "perfil",
        name: 'Perfil',
        component: Perfil,
        meta: {requireAuth: true}, //esto es una proteccion de ruta
      }
    ]
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

//un guard verifica si estamos logueados o no
//el to tiene la informacion de la dirección actual de la url es un obj

router.beforeEach((to, from, next)=>{
  console.log(to)
  if(to.meta.requireAuth){
    //si necesita entonces debemos de verificar si estamos logueados
    let token = localStorage.getItem("token");
    if(token){
      next()
    }else{
      next("/login");
    }
  }
  next();
  
})

export default router
