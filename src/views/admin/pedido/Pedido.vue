<template>
  <div class="card">
    <h1>Lista Pedido</h1>
     <DataTable :value="pedidos" tableStyle="min-width: 50rem">
        <Column field="id" header="Code"></Column>
        <Column field="fecha_pedido" header="Fecha"></Column>
        <Column field="cliente.nombre_completo" header="Cliente"></Column>
        <Column field="productos" header="Productos">
        <template #body="slotProps">
          <!-- Boton para abrir el modal enviando los productos al modla -->
            <Button label="Show" icon="pi pi-external-link" @click="openModalProductos(slotProps.data.productos)" />
        </template>
          
        </Column>
     </DataTable>
      <!-- agregamos un modal -->
      <Dialog header="Header" v-model:visible="displayModal" :breakpoints="{'960px': '75vw', '640px': '90VW'}">
        <!-- aqui viene la otra tabla de producto -->
        <DataTable :value="productos" tableStyle="min-width: 50rem">
            <Column field="id" header="ID"></Column>
            <Column field="nombre" header="NOMBRE"></Column>
            <Column field="precio" header="PRECIO"></Column>
        </DataTable>
        <template #footer>
          <Button> OLA</Button>
        </template>

      </Dialog>
  </div>
</template>

<script>
  //iportamos todas las funciones de PedidoService 
import * as pedidoService from "@/service/PedidoService.js"
// import Dialog from 'primevue/dialog';
export default {
  data(){
    return{
      pedidos: [],
      displayModal: false,
      productos:[],
    }
  },
  async mounted(){
    const {data} = await pedidoService.index(); //con esto llega la informacion
    //this.pedidos = data; //cargamos los pedidos
    //cargamos los datos del pedido
    this.pedidos = data.data;
  },
  methods:{
    openModalProductos(datos){
      this.productos = datos; //estos datos se van a cargar en el dialog y se van a iterar
      this.displayModal = true;
    }
  }

 

  
}
</script>

<style>

</style>