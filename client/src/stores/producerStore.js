// ------ setup version -------
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/serverinterface.js';

export const producerStore = defineStore('producerStore', () => {
  const data = ref([]);

  async function fetchData() {
    const res = await axios.get(`/sapi/producer`);
    data.value = res.data;
  }

  return { data, fetchData };
});
