<script setup>
import { productStore } from '../stores/productStore.js';
import { getPCImageUrl, getProductImageUrl } from '../util.js';

const props = defineProps({ city: String });

const store = productStore();
store.fetchDataForCity(props.city);

const columns = [
  {
    name: 'plabel',
    label: 'Produktname',
    field: 'plabel',
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
  {
    name: 'storage',
    label: 'Lager',
    field: 'label',
    align: 'center',
  },
  {
    name: 'street',
    label: 'Adresse',
    field: 'street',
    align: 'center',
  },
  { name: 'slots', label: 'see template', field: 'slots', align: 'left', sortable: true },
];
</script>

<template>
  <div class="column items-center q-mt-md">
    <h2>Produkte für {{ city }}</h2>

    <q-table
      flat
      :rows="store.data"
      :columns="columns"
      :row-key="(row) => row.productid + row.wid"
      :rows-per-page-options="[20, 50, 0]">
      <template #header-cell-slots="props">
        <q-th :props="props">
          Lagerslots<br />
          SlotId / Anzahl / ChargeCode
        </q-th>
      </template>

      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <img v-if="props.row.image" :src="props.value" class="thumbnail" />
          <img v-else :src="getPCImageUrl(props.row.pimage)" class="thumbnail" />
        </q-td>
      </template>

      <template v-slot:body-cell-slots="props">
        <q-td :props="props">
          <div>Gesamt: {{ props.row.totalcount }}</div>
          <ul class="text-left">
            <li v-for="c of props.row.slots" :key="c.slid">{{ c.slid }}: {{ c.unitscount }} [{{ c.chargeid }}]</li>
          </ul>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<style>
.wrap-header {
  word-wrap: normal;
}
</style>
