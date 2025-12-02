<template>
  <div class="column items-center q-mt-md">
    <table>
      <thead>
        <th v-for="c of columns" :key="c.field">{{ c.label }}</th>
      </thead>
      <tbody>
        <tr v-for="w of store.storages" :key="w.wid">
          <td v-for="c of columns" :key="c.field">{{ w[c.field] }}</td>
        </tr>
      </tbody>
    </table> 
  </div>
</template>

<script setup>
import { storageStore } from '../stores/storageStore.js';

const store = storageStore();
store.fetchStorage();

/*{ "storageid": 26, "label": "normal2", "temperature": "2.10", "humidity": 83, "quality": 3, "wid": "AUTLA11" } */
const columns = [
  { field: 'wid', label: 'WarenhausID' },
  { field: 'storageid', label: 'LagerraumID' },
  { field: 'label', label: 'Bezeichnung' },
  { field: 'temperature', label: 'Temperatur' },
  { field: 'humidity', label: 'Feuchtigkeit' },
  { field: 'quality', label: 'Qualität' },
];
</script>

<style lang="scss" scoped></style>
