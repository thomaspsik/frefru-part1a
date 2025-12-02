<template>
 <div class="column items-center q-mt-md">
    <q-table :columns="columns" :rows="store.warehouses" row-key="wid" :rows-per-page-options="[20, 50, 0]">
      <template #body-cell-siteid="props">
        <q-td :props="props" class="row items-center q-gutter-sm">
          <q-btn :to="`/site/${props.value}`" color="primary" icon="open_in_new" small>Site</q-btn>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" class="row items-center q-gutter-sm">
          <q-btn dense flat round icon="edit" @click="editWarehouse(props.row)" />
          <q-btn dense flat round color="negative" icon="delete" @click="removeWarehouse(props.row)" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { storageStore } from '../stores/storageStore.js';

const store = storageStore();
store.fetchWarehouses();

const columns = [
  { name: 'wid', label: 'WID', field: 'wid', sortable: true },
  { name: 'label', label: 'Label', field: 'label', sortable: true },
  { name: 'address', label: 'Address', field: (row) => formatAddress(row), sortable: false },
  { name: 'siteid', label: 'Site', field: 'siteid', sortable: true },
  { name: 'actions', label: 'Aktionen', field: 'actions', sortable: false },
];

function formatAddress(row) {
  const parts = [];
  if (row.street) parts.push(row.street);
  const cityParts = [];
  if (row.plz) cityParts.push(row.plz);
  if (row.city) cityParts.push(row.city);
  if (cityParts.length) parts.push(cityParts.join(' '));
  return parts.join(', ') || '-';
}
</script>

<style lang="scss" scoped></style>
