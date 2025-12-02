<template>
  <div class="column items-center q-mt-md">
    <q-table :columns="columns" :rows="store.sites" row-key="siteid" :rows-per-page-options="[20, 50, 0]">
      <template #body-cell-country="props">
        <q-td :props="props">
          <img :src="props.value" class="countryico" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { storageStore } from '../stores/storageStore.js';
import { getFlagUrl } from '../util.js';

const store = storageStore();
store.fetchSites();

/*{ "siteid": "AUTWAR", "label": "Waren1", "country": "AUT" }
 */
const columns = [
  { name: 'siteid', label: 'SiteID', field: 'siteid', sortable: true },
  { name: 'label', label: 'Bezeichnung', field: 'label', sortable: true },
  { name: 'country', label: 'Land', field: 'country', sortable: true, format: (v) => getFlagUrl(v) },
];
</script>

<style lang="scss" scoped></style>
