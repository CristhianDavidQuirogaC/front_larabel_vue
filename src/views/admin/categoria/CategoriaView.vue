<template>
  <div class="card">
    <h1>Gestion Categorías</h1>
    <Button label="Nueva Categoria" icon="pi pi-plus" class="mr-2" @click="visible = true" />

    <Dialog header="Categoria" v-model:visible="visible" :breakpoints="{'960px':'75vw', '640px': '90vw'}" :style="{ width: '40vw'}" class="p-fluid">
        
        <pre>{{ errors }}</pre>
        <div class="field">
            <label for="nombre" class="block font-bold mb-3">Nombre</label>
            <InputText id="nombre" v-model.trim="categoria.nombre" required="true" autofocus :invalid="submitted && !categoria.nombre" fluid />
            <small v-if="submitted && !categoria.nombre" class="text-red-500">El nombre es requerido.</small>
        </div>
        <div class="field">
            <label for="detalle">Detalle</label>
            <Textarea id="detalle" v-model="categoria.detalle"  rows="3" cols="20" fluid />
        </div>
       
        {{ categoria }}
        <template #footer>
            <Button label="No" icon="pi pi-times" @click="closeModal" class="p-button-text"/>
            <Button label="Guardar Categoria" icon="pi pi-check" @click="guardarCategoria" autofocus />
        </template>
    </Dialog>

    <DataTable :value="categorias" tableStyle="min-width: 50rem">
        <Column field="id" header="ID"></Column>
        <Column field="nombre" header="Nombre Categoria"></Column>
        <Column field="detalle" header="Detalle"></Column>
        <Column field="acción" header="Accion" :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2" @click="editarDialogModal(slotProps.data)"/>
                <Button icon="pi pi-trash" variant="outlined" rounded severity="danger" />
            </template>
        </Column>
        
    </DataTable>

    <Toast />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
//importamos el servicio
import * as categoriaService from "@/service/CategoriaService.js"
import { useToast } from "primevue/usetoast";

export default {
    setup(){
        const toast = useToast();
        //categorias es un array de objetos
        const categorias = ref([]); //ref hace q la variable sea reactiva y observe cambios
        //quiero guardar una sola categoria (Objeto) Necesitamos ese servicio
        const categoria = ref({}); //ref crea una variable reactiva q observa cambios
        const visible = ref(false);
        const submitted = ref(false);
        const errors = ref({}); //todo dentro de llaves es un objeto
        
        //cuando cargue el componente se ejecuta el onMounted
        onMounted(() => {
            listarCategorias();
        })

        //Metodos
        const listarCategorias = async ()=>{
            //capturamos los datos de categoriaService para listarlos
            const {data} = await categoriaService.index(); //solo quiero la data
            //cargamos la información en el valor de la variable categorias
            categorias.value = data;            
        }

        const guardarCategoria = async ()=>{
            //capturo errores
            try {
                //si tiene id se va a editar (Usamos el value ya q usamos el ref)
                if(categoria.value.id){
                    //esperamos que llegue la imformación
                    await categoriaService.update(categoria.value, categoria.value.id);
                    listarCategorias();
                    //cerramos el modal siempre y cuando todo este correcto
                    closeModal();
                    //mandamos el mensaje de Categoria registrada
                    toast.add({ severity: 'success', summary: 'Categoria Actualizada', detail: 'Actualizado', life: 3000 });
                }else{ //sino tiene id se va a guardar
                     //guardará
                    await categoriaService.store(categoria.value);
                    // ahora listará desde el back
                    //listarCategorias();
                    //esto solo actualiza en el front y no en el back hasta que se actualice la pag
                    //push solo agrega
                    categorias.value.push(categoria.value);
                    //ahora cerrará el modal
                    visible.value = false;
                    //vaciamos los campos de categoria
                    closeModal();
                    //mandamos el mensaje de Categoria registrada
                    toast.add({ severity: 'success', summary: 'Categoria Registrada', detail: 'Registrado', life: 3000 });
                }
                
            } catch (error) {
                errors.value = error.response.data;
                console.log("*******", errors);
                showError();
            }
           
        }
        //Metodos del template
        const closeModal = () =>{
            visible.value = false;
            categoria.value = {}; // se vacia los valores de los campos 
        }
        const showError = () => {
            //mandamos el mensaje de error 
            toast.add({ severity: 'error', summary: 'Error al guardar' , detail: 'Registra la categoria', life: 3000 });
        }
        const editarDialogModal = (datos) => {  //llega los datos
            categoria.value = datos; //cargan los datos
            visible.value = true; // y se visualiza el dialog o modal
        }

        return {
            categorias,
            categoriaService,
            visible,
            categoria,
            submitted,
            guardarCategoria,
            useToast,
            errors,
            editarDialogModal,
            closeModal,
        }
    }
}
</script>

<style>

</style>