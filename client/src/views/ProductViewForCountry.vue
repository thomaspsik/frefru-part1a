<script setup>
import { productStore } from '../stores/productStore';
import { getPCImageUrl, getProductImageUrl } from '../util.js';

const props = defineProps({ country: String });

const store = productStore();
store.fetchDataForCountry(props.country);
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
    name: 'sellprice',
    label: 'Verkaufspreis',
    field: 'sellprice',
    align: 'right',
    sortable: true,
    format: (p) => p.toFixed(2),
  },
  { name: 'totalcount', label: 'Auf Lager', field: 'totalcount', align: 'left', sortable: true },
];
</script>

<template>
  <div class="column items-center q-mt-md">
    <q-table flat :rows="store.data" :columns="columns" row-key="productid" :rows-per-page-options="[20, 50, 0]">
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <img v-if="props.row.image" :src="props.value" class="thumbnail" />
          <img v-else :src="getPCImageUrl(props.row.pimage)" class="thumbnail" />
        </q-td>
      </template>

      <template v-slot:body-cell-totalcount="props">
        <q-td :props="props">
          <div>Gesamt: {{ props.row.sumunits }}</div>
          <div class="text-left">
            <div v-for="c of props.row.city_data" :key="c.city">
              <q-btn
                color="primary"
                :label="c.city"
                :to="`/products/city/${c.city}`"
                dense
                icon="open_in_new"
                small></q-btn>
              {{ c.totalunits }}
            </div>
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>
