<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Nuevo Producto" icon="pi pi-plus" class="mr-2" @click="openNuevoProducto" />
                    <Button label="Eliminar Producto" icon="pi pi-trash" severity="danger" variant="outlined" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                </template>

                <template #end>
                    <FileUpload mode="Import" accept="image/*" :maxFileSize="1000000" label="Import" customUpload chooseLabel="Import" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
                    <Button label="Exportar" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>
            <DataTable
                ref="dt"
                v-model:selection="selectedProducts"
                :value="products"
                :lazy="true"
                dataKey="id"
                :totalRecords="totalRecords"
                :loading="loading"
                @page="onPage"
                @filter="onFilter($event)"
                :paginator="true"
                :rows="5"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Gestión Productos</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" @change="buscarPor()" placeholder="Buscar..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="id" header="ID" sortable style="min-width: 12rem"></Column>
                <Column field="nombre" header="NOMBRE" sortable style="min-width: 16rem"></Column>
                <Column header="Image">
                    <template #body="slotProps">
                        <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="rounded" style="width: 64px" />
                    </template>
                </Column>
                <Column field="precio" header="PRECIO" sortable style="min-width: 8rem">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.precio) }}
                    </template>
                </Column>
                <Column field="categoria.nombre" header="Categoria" sortable style="min-width: 10rem"></Column>
                
                <Column :exportable="false" style="min-width: 12rem">
                    <!-- slotProps tiene el identificador y todos los datos del producto -->
                    <template #body="slotProps">
                        <Button label="IMG" icon="pi pi-external-link" @click="openModalImg(slotProps.data)" />
                        <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" variant="outlined" rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>

            <div v-if="productDialog">
                <h1>Prueba</h1>
            </div>
            <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Detalles del Producto" :modal="true" class="p-fluid">
                <div class="flex flex-col gap-6">
                    <img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`" :alt="product.image" class="product-image" />
                    <div>
                        <label for="name" class="block font-bold mb-3">Nombre</label>
                        <InputText id="name" v-model.trim="product.nombre" required="true" autofocus :invalid="submitted && !product.nombre" fluid />
                        <small v-if="submitted && !product.nombre" class="text-red-500">El nombre es obligatorio</small>
                    </div>

                    <div class="field">
                        <label for="description" class="block font-bold mb-3">Descripcion</label>
                        <Textarea id="descripcion" v-model="product.descripcion" required="true" rows="3" cols="20" fluid />
                    </div>

                    <div class="field">
                        <label class="mb-4">Categoria</label>
                        <div class="grid grid-cols-12 gap-4">
                            <div class="flex items-center gap-2 col-span-6" v-for="cat in categorias" :key="cat.id">
                                <RadioButton id="category1" name="category" :value="cat.id" v-model="product.categoria_id" />
                                <label for="category1">{{ cat.nombre }}</label>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-6">
                            <label for="price" class="block font-bold mb-3">Precio</label>
                            <InputNumber id="price" v-model="product.precio" mode="currency" currency="USD" locale="en-US" fluid />
                        </div>
                        <div class="col-span-6">
                            <label for="quantity" class="block font-bold mb-3">Cantidad</label>
                            <InputNumber id="quantity" v-model="product.stock" integeronly fluid />
                        </div>
                    </div>
                </div>

                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" text @click="cerrarDialog " />
                    <Button label="Guardar" icon="pi pi-check" @click="guardarProducto" />
                </template>
                <pre>{{ product }}</pre>
            </Dialog>

            <!-- Dialog Modal para editar imagen y desntro de este hay un UPLOAD -->
             <Dialog v-model:visible="displayModalImg" header="Header" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '640px': '90vw' }">
                <FileUpload name="demo[]"  @upload="onUpload" customUpload="true" @uploader="onImagenSeleccionada"  accept="image/*" :maxFileSize="1000000">
                    <template #empty>
                        <span>Drag and drop files to here to upload.</span>
                    </template>
                </FileUpload>
            </Dialog>
            <!-- <Dialog v-model:visible="displayModalImg" modal header="Edit Profile" :style="{ width: '25rem' }">
                
            </Dialog> -->
        </div>
    </div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import  {ref, onMounted} from "vue"
import * as productoService from "@/service/ProductoService.js"
import * as categoriaService from "@/service/CategoriaService.js"

export default {
    setup(){
        //debemos obtgener la lista y empezar a guardar
        onMounted(() => {
            //productoService.getProducts().then((data) => (producto.value = data));
            getCategorias();
            getProductos();
        });
        const productDialog = ref(false);
        const product = ref({});
        const products = ref(); //Puede ser un objeto o un array
        const categorias = ref([]); //para la lista que setpa un array
        const dt = ref(); //data table
        const deleteProductDialog = ref(false);
        const deleteProductsDialog = ref(false);
        const selectedProducts = ref();
        const submitted = ref(false);
        const loading = ref(false);
        const totalRecords = ref(0);
        const lazyParams = ref({});
        const displayModalImg = ref(false);
        const id_producto = ref(null);

        const filters = ref({
            'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        });

        //get categorias debe cargar al cargar la pagina onMokunted
        const getCategorias = async() => {
            try {
                //llamo a la lista de categorias 
                const {data} = await categoriaService.index();
                categorias.value = data;
            } catch (error) {
                console.log(error);
            }
        }
         //onPage cartura los datos del evento event
         //lazyParams.value ahi s ecarga el evento
        const onPage = (event) => {
            console.log(lazyParams.value)
            lazyParams.value = event;
            getProductos();
        };

        const onFilter = () =>{
            //leemos el valor por el q debemos de filtrar
            lazyParams.value.filters = filters.value.global.value;
            //ahora cargamos los porductos
            getProductos();
        }

        //memtodo para buscar
        const buscarPor = () => {
            console.log(filters.value.global.value);
            getProductos();
        }

        //listar a los productos
        const getProductos = async() => {
            try {
                //se activa el cargado de datos hasta que lleguen los datos
                loading.value = (true);
                let rows = lazyParams.value.rows;
                //capturamos en q el filtro de busqueda y lo enviamos al data
                let q = (filters.value.global.value==null)?'': filters.value.global.value;
                //la primera vez q carga los productos lazyParams.value.page+1 devuelve Nand
                let page = (lazyParams.value.page == null)?0:lazyParams.value.page
                //llamo a la lista de productos el primer data es de axios
                const {data} = await productoService.index(page+1, rows, q);
                //de la data de axios necesito su data
                products.value = data.data;
                totalRecords.value = data.total;
                //ya llegaron los datos ahora desactivamos el loading
                loading.value = (false);
            } catch (error) {
                console.log(error);
            }
        }
        //abrir el Dialog Modal
        const openNuevoProducto = () => {
            //abrimos con los campos vacios
            product.value = {};
            submitted.value = false;
            productDialog.value = true;
        } 
        const cerrarDialog = () => {
            productDialog.value = false;
            submitted.value = false;
        };
        // Guardar un producto
        const guardarProducto = async () => {
            try {
                //para guardar usamos el  productoService enviando datos
                //podemos capturar el mensaje del servidor en data
                await productoService.store(product.value);
                //cerramos el modal
                productDialog.value = false;
            } catch (error) {
                console.log(error);
            }
            
        }
        //editar Imagen subir otra imagen
         //editar Imagen subir otra imagen
        const openModalImg = (prod) => {
            id_producto.value = prod.id;
            displayModalImg.value = true;
        } 
        const closeModalImg = () => {
            displayModalImg.value = false;
            
        }
        const cargarImg= () => {
            toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
        };

        const onImagenSeleccionada = async (event) => {
            console.log(event.files[0]);
            console.log(id_producto.value)
            let fd = new FormData();
            fd.append("imagen", event.files[0])
            //ejecutamos el servicio
            await productoService.actualizarImagen(fd, id_producto.value)
            closeModalImg();
        }

        const formatCurrency = (value) => {
    if(value)
        return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    return;
};

        return{
            openNuevoProducto,
            guardarProducto,
            cerrarDialog,
            productDialog,
            product,
            categorias,
            products,
            deleteProductDialog,
            deleteProductsDialog,
            selectedProducts,
            dt,
            filters,
            formatCurrency,
            loading,
            totalRecords,
            onPage,
            lazyParams,
            onFilter,
            buscarPor,
            openModalImg,
            closeModalImg,
            displayModalImg,
            cargarImg,
            onImagenSeleccionada

        }
    }
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
    --body-bg: var(--p-surface-50);
    --body-text-color: var(--p-surface-900);
    --card-border: 1px solid var(--border-color);
    --card-bg: var(--p-surface-0);
    --border-color: var(--p-surface-200);
    --text-color: var(--p-surface-700);
    --overlay-background: #ffffff;
}

:root[class='p-dark'] {
    --body-bg: var(--p-surface-950);
    --body-text-color: var(--p-surface-50);
    --card-border: 1px solid transparent;
    --card-bg: var(--p-surface-900);
    --border-color: rgba(255, 255, 255, 0.1);
    --text-color: var(--p-surface-0);
    --overlay-background: var(--p-surface-900);
}

html {
    font-size: 14px;
    line-height: normal;
}

body {
    margin: 0px;
    min-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: var(--body-bg);
    font-weight: normal;
    color: var(--body-text-color);
    padding: 1rem;
}

.card {
    background: var(--card-bg);
    border: var(--card-border);
    padding: 2rem;
    border-radius: 10px;
    margin-bottom: 1rem;
}

</style>