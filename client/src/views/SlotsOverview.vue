<template>
  <div class="column items-center q-mt-md">
    <table>
      <thead>
        <th v-for="c of columns" :key="c.field" :class="c.class">{{ c.label }}</th>
      </thead>
      <tbody>
        <tr v-for="w of store.slots" :key="w.wid">
          <td v-for="c of columns" :key="c.field" :class="c.class">{{ w[c.field] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { storageStore } from '../stores/storageStore.js';

const store = storageStore();
store.fetchSlots();

/* { "slid": "AUTWAR1U201", "capacitykg": 2100, "capacityunits": 70, "storageid": 3 }, */
const columns = [
  { field: 'storageid', label: 'LagerraumID', class: 'text-center' },
  { field: 'slid', label: 'SlotID', class: 'text-center' },
  { field: 'capacitykg', label: 'Kapazität Kg', class: 'text-right' },
  { field: 'capacityunits', label: 'Kapazität Einheiten', class: 'text-right' },
];
</script>

<style lang="scss" scoped></style>
