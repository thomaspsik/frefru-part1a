<template>
  <div class="column items-center q-mt-md">
    <q-table :columns="columns" :rows="store.data" row-key="producerid" :rows-per-page-options="[20, 50, 0]">
      <template #body-cell-country="props">
        <q-td :props="props">
          <img :src="props.value" class="countryico" />
        </q-td>
      </template>

      <template #body-cell-logo="props">
        <q-td :props="props">
          <img v-if="props.value" :src="props.value" class="thumbnail" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { producerStore } from '../stores/producerStore.js';
import { getFlagUrl, getProducerLogo } from '../util.js';

const store = producerStore();
store.fetchData();

const columns = [
  {
    name: 'logo',
    label: 'Logo',
    field: 'logo',
    align: 'center',
    sortable: false,
    format: (v) => getProducerLogo(v),
  },
  {
    name: 'name',
    label: 'Herstellername',
    field: 'name',
    align: 'center',
    sortable: true,
  },
  {
    name: 'country',
    label: 'Land',
    field: 'country',
    align: 'center',
    sortable: true,
    format: (v) => getFlagUrl(v),
  },
  { name: 'city', label: 'Stadt', field: 'city', align: 'center', sortable: true },
  {
    name: 'address',
    label: 'Adresse',
    field: 'address',
    align: 'center',
    sortable: true,
  },
];
</script>

<style lang="scss" scoped>

</style>
