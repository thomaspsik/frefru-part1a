<script setup>
import { productStore } from '../stores/productStore';
import { getPCImageUrl, getProductImageUrl } from '../util.js';

const store = productStore();
store.fetchData();

const columns = [
  {
    name: 'label',
    label: 'Produktname',
    field: 'label',
    align: 'center',
    sortable: true,
  },
  {
    name: 'image',
    label: 'Bild',
    field: 'image',
    align: 'center',
    sortable: false,
    format: (v) => getProductImageUrl(v),
  },
  { name: 'handlingunit', label: 'Handlingunit', field: 'handlingunit', align: 'center', sortable: true },
  {
    name: 'avgbuyprice',
    label: 'Einkaufspreis',
    field: 'avgbuyprice',
    align: 'left',
    sortable: true,
    format: (p) => p.toFixed(3),
  },
  {
    name: 'sellprice',
    label: 'Verkaufspreis',
    field: 'sellprice',
    align: 'left',
    sortable: true,
    format: (p) => p.toFixed(2),
  },
  { name: 'totalcount', label: 'Auf Lager', field: 'totalcount', align: 'left', sortable: true },
];
</script>

<template>
  <div class="column items-center q-mt-md">
    <q-btn
      color="primary"
      class="q-ma-md"
      label="Anzeige nach Land"
      to="/selCountry/Produkte für Land/products"></q-btn>

    <q-table flat :rows="store.data" :columns="columns" row-key="productid" :rows-per-page-options="[20, 50, 0]">
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <img v-if="props.row.image" :src="props.value" class="thumbnail" />
          <img v-else :src="getPCImageUrl(props.row.pimage)" class="thumbnail" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>
