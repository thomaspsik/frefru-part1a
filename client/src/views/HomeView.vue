<script setup>
import { useMyStore } from '../stores/myStore';

const myStore = useMyStore();
</script>

<template>
  <div class="column items-center q-mt-md"><span class="text-h4">Home</span><br /><span>{{ myStore.message }}</span></div>
</template>
