<!-- Un componete es algo pequeño (parte de una página) o parte de una vista Una vista es una página completa -->
 <!-- con "def" se crea la estructura base del componente -->
 <template>
  <DataTable
    ref="dt"
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
    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
  >
    <template #header>
      <div
        class="flex flex-colum table-header md:flex-row md:justify-content-between"
      >
        <h4 class="m-0 mb-2 md-center">Productos</h4>
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText
            v-model="filters['global'].value"
            @keydown.enter="buscarPor()"
            placeholder="Buscar..."
          />
        </IconField>
      </div>
    </template>
    <Column
      field="nombre"
      header="NOMBRE"
      :sortable="true"
      style="min-width: 16rem"
    ></Column>
    <Column header="IMAGEN">
      <!-- slotProps tiene el identificador y todos los datos del producto. Asi q ñlo enviamos cuando abrimos el modal -->
      <!-- Y capturamos ese producto (slotProps.data) en la funcion openModalImg -->
      <template #body="slotProps">
        <!-- {{ formatCurrency (slotProps.data.imagen) }} -->
        <img
          :src="`${url}/${slotProps.data.imagen}`"
          :alt="slotProps.data.imagen"
          class="rounded"
          style="width: 64px"
        />
      </template>
    </Column>
    <Column field="precio" header="PRECIO" sortable style="min-width: 8rem">
      <template #body="slotProps">
        {{ formatCurrency(slotProps.data.precio) }}
      </template>
    </Column>
    <Column
      field="categoria.nombre"
      header="CATEGORIA"
      sortable
      style="min-width: 10rem"
    ></Column>

    <Column :exportable="false" style="min-width: 12rem">
      <!-- slotProps tiene el identificador y todos los datos del producto. Asi q lo enviamos cuando abrimos el modal -->
      <!-- Y capturamos ese producto (slotProps.data) en la funcion addCarrito -->
      <template #body="slotProps">
        <Button
          label="+"
          icon="pi pi-add"
          @click="addCarrito(slotProps.data)"
        />
      </template>
    </Column>
  </DataTable>
</template>
 
 <script>
export default {
    //este es el hijo de Nuevo Pedido
    //recibimos las propiedades en Props
    props:{
        //aqui declaramos todo lo que vamos a recibir del padre
        //esta propiedad "products" va a llegar de NuevoPedido y va a capturar el tipo Array y lo cargará en la tabla
        
        products: {
             type: Array,
             required: true,
        },
        filters: Object,
        totalRecords: Number,
        loading: {
            type: Boolean,
        },
        //todo lo de abajo se recomienda compartir del padre al hijo
        // de NuevoPedido a ListaProductoPedido 
        url: String,
        formatCurrency: Function,
        addCarrito: Function,
        buscarPor: Function,
        onPage: Function,
        
    }
};
</script>
 
 <style>
</style>