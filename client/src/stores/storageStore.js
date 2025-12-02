// ------ setup version -------
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/serverinterface.js';

export const storageStore = defineStore('storageStore', () => {
  const storages = ref([]);
  const warehouses = ref([]);
  const sites = ref([]);
  const slots = ref([]);

  async function fetchStorage() {
    const res = await axios.get(`/sapi/storage`);
    storages.value = res.data;
  }

  async function fetchWarehouses() {
    const res = await axios.get(`/sapi/warehouse`);
    warehouses.value = res.data;
  }

  async function fetchSites() {
    const res = await axios.get(`/sapi/site`);
    sites.value = res.data;
  }

  async function fetchSlots() {
    const res = await axios.get(`/sapi/slot`);
    slots.value = res.data;
  }

  return { storages, sites, warehouses, slots, fetchStorage, fetchWarehouses, fetchSites, fetchSlots };
});
