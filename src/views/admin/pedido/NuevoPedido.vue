<template>
  <div class="grid">
    <div class="col-12">
        <div class="card">
            Datos de Pedido
        </div>
    </div>
    <div class="col-8">
        <!-- dataTable de Productos -->
        <div class="card">
            <!-- ------ Aqui agregamos el compomente ListaProductoPedido --------- -->
            <!-- <lista-producto-pedido />  se lo llama asi o como lo de abajo-->
            <!-- Necesitamos enviar una propiedad que debe ser el mismo nombre de la propiedad del hijo-->
            <!-- "products" es la variable y products es la propiedas de ListaProductoPedido  -->
            <!-- esa propiedad va a llegar a ListaProductoPedido y va a capturar el tipo Array y lo cargará en la tabla -->
            <!-- "products" al inicio esta vacio, nulo y se está mandando así -->
             <ListaProductoPedido 
             :products="products" 
             :filters="filters" 
             :totalRecords="totalRecords" 
             :loading="loading" :url="url"
             :formatCurrency="formatCurrency"
             :addCarrito="addCarrito"
             :buscarPor="buscarPor"
             :onPage="onPage"
             />
        </div>
       
    </div>
    <div class="col-4">
        <div class="col-12">
            <div class="card">
                <h5>Carrito</h5>
                <!-- <p>{{ carrito }}</p> -->
                <DataTable :value="carrito" responsiveLayout="scroll">
                    <Column field="nombre" header="NOM"></Column>
                    <Column field="precio" header="PRECIO"></Column>
                    <Column field="cantidad" header="CANT"></Column>
                    <Column header="ELIM">
                        <!-- slotProps tiene el identificador y todos los datos del producto. Asi q lo enviamos cuando abrimos el modal -->
                            <!-- Y capturamos ese producto (slotProps.data) en la funcion addCarrito -->
                        <template #body="slotProps">
                            <Button label="X" icon="pi pi-quit" @click="quitarCarrito(slotProps.data.id)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <div class="col-12">
            <div class="card">
                <h5>CLIENTE</h5>
                 <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" @keydown.enter="buscarPor()" placeholder="Buscar..." />
                </span>
                <!-- El boton de abajo abre el modal de Clientes -->
                <Button label="Nuevo Cliente" icon="pi pi-user" @click="openNuevoClienteModal" />
                
            </div>
        </div>
        <div class="col-12">
            <div class="card">
                Boton Guardar
            </div>
        </div>
    </div>
  </div>

 <!-- Dialog para nuevo cliente -->
  <Dialog v-model:visible="displayClienteModal" header="Nuevo Cliente"  :breakpoints="{ '960px': '75vw', '75px': '90vw' }" :style="{ width: '50rem' }">
    <div class="field">
        <label for="name" class="block font-bold mb-3">Nombre Cliente</label>
        <InputText id="name" v-model.trim="cliente.nombre_completo" required="true" autofocus :invalid="submitted && !cliente.nombre_completo" fluid />
        <small v-if="submitted && !cliente.nombre" class="text-red-500">El nombre es obligatorio</small>
    </div>

    <div class="field">     
        <label for="telefono" class="block font-bold mb-3">Telefono</label>
        <InputNumber id="telefono" v-model="cliente.telefono" required="true" autofocus :invalid="submitted && !cliente.telefono" fluid />
    </div>


    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-6">
            <label for="correo" class="block font-bold mb-3">Correo</label>
            <InputText id="correo" v-model="cliente.correo" required="true" autofocus :invalid="submitted && !cliente.correo" fluid />
        </div>
        <div class="col-span-6">
            <label for="ciNit" class="block font-bold mb-3">C.I. / NIT</label>
            <InputNumber id="ciNit" v-model="cliente.ci_nit" autofocus :invalid="submitted && !cliente.ci_nit" fluid />
        </div>
    </div>
    {{ cliente }}
    <template #footer>
        <Button type="button" icon="pi pi-times" label="No" severity="secondary" @click="closeClienteModal" />
        <Button type="button" icon="pi pi-check" label="Guardar" @click="closeClienteModal"></Button>
    </template>
   </Dialog>
</template>

<script>
import { FilterMatchMode } from 'primevue/api'; //para la búsqueda
import  {ref, onMounted} from "vue"
//llamamos a nuestro propio servicio @/ hace referencia a la carpera SRC
import * as productoService from "@/service/ProductoService.js" 
import { useToast } from "primevue/usetoast"; // para notificaciones
import { urlBaseAsset } from '@/service/Http.js'; //para cargar imágenes
//importamos el componente hijo le damos el nombre que querramos y lugo lo exportamos en el campo "components"
import ListaProductoPedido from "@/components/pedido/ListaProductoPedido.vue"

export default {
    components: {
        ListaProductoPedido
    },
     data(){
        return{
            url: urlBaseAsset
        }
    },
    setup(){
        const toast = useToast();
        //debemos obtener la lista y empezar a guardar
        onMounted(() => {
            //productoService.getProducts().then((data) => (producto.value = data));
            getProductos();
        });
        
        const product = ref({}); //aqui se cargarán los valores capturados del modal 
        const cliente = ref({}); //aqui se cargarán los valores capturados del modal 
        const products = ref([]); //Debe ser un array
        const dt = ref(); //data table
        const loading = ref(false);
        const totalRecords = ref(0);
        const lazyParams = ref({});
        //en este id_producto capturamos los cambios para abrir el modal
        const id_producto = ref(null); //este id se va a cambiar cuando se intente subir la imagen

        const filters = ref({
            'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        });
        // carrito donde agregamos los productos
        const carrito = ref([]);
        //cliente
        const displayClienteModal = ref(false);

        //onPage cartura los datos del evento event
        //lazyParams.value ahi s ecarga el evento
        const onPage = (event) => {
            console.log(lazyParams.value);
            lazyParams.value = event;
            getProductos();
        };
        // filtramos lo que vamos a mostrar
        const onFilter = () =>{
            //leemos el valor por el q debemos de filtrar
            lazyParams.value.filters = filters.value.global.value;
            //ahora cargamos los porductos
            getProductos();
        };

        //memtodo para buscar
        const buscarPor = () => {
            console.log(filters.value.global.value);
            getProductos();
        };

        //listar a los productos
        const getProductos = async() => {
            try {
                //se activa el cargado de datos hasta que lleguen los datos
                loading.value = (true);
                let rows = lazyParams.value.rows;
                //capturamos en q el filtro de busqueda y lo enviamos al data
                let q = filters.value.global.value==null?'': filters.value.global.value;
                //la primera vez q carga los productos lazyParams.value.page+1 devuelve Nand
                let page = (lazyParams.value.page == null)?0:lazyParams.value.page
                //llamo a la lista de productos el primer data es de axios
                const {data} = await productoService.index(page+1, rows, q);
                //de la data de axios necesito su data la cargo en  products 
                products.value = data.data;
                totalRecords.value = data.total;
                //ya llegaron los datos ahora desactivamos el loading
                loading.value = (false);
            } catch (error) {
                console.log(error);
            }
        };
        //Para el formato de la moneda y el Precio
        const formatCurrency = (value) => {
        if(value)
            return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
        return;

        };

        //llega el producto el cual pusheo al carrito
        const addCarrito = (prod) =>{
            //capturo al producto y lo q necesitamos es el id, nombre, precio, 
            const{id, nombre, precio } = prod
            carrito.value.push({
                //formamos el almacenamiento en el array
                id: id, 
                nombre: nombre, 
                precio,
                cantidad: 1, //empezará en 1 por defecto
            })
        }

        //CLIENTE
        const openNuevoClienteModal = () =>{
            displayClienteModal.value = true;
            console.log("Se abrio el modal");
        }
        const closeClienteModal = () => {
            displayClienteModal.value = false;
        }

        return{
            product,
            products,
            dt,
            loading,
            totalRecords,
            lazyParams,
            id_producto,
            filters,
            onPage,
            onFilter,
            buscarPor, 
            formatCurrency,
            addCarrito,
            carrito,
            openNuevoClienteModal,
            displayClienteModal,
            cliente,
            closeClienteModal
        }
    },

};
</script>

<style>

</style>