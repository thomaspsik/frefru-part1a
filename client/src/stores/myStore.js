// ------ setup version -------
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMyStore = defineStore('myStore', () => {
  const message = ref('Viel Erfolg!');

  return { message };
});

// ------ option version -------
// import { defineStore } from 'pinia';
//
// export const useMyStore = defineStore('myStore', {
//   state: () => ({ message: 'Viel Erfolg!' }),
//   getters: {},
//   actions: {},
// });
