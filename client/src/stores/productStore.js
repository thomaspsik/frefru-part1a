// ------ setup version -------
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/serverinterface.js';

export const productStore = defineStore('productStore', () => {
  const data = ref([]);

  async function fetchData() {
    const res = await axios.get(`/api/products`);
    data.value = res.data;
  }

  async function fetchDataForCountry(country) {
    const res = await axios.get(`/api/products/country/${country}`);
    data.value = res.data;
  }

  async function fetchDataForCity(city) {
    const res = await axios.get(`/api/products/city/${city}`);
    data.value = res.data;
  }

  return { fetchData, fetchDataForCountry, fetchDataForCity, data };
});
