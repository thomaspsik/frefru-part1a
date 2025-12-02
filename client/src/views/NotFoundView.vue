<template>
  <div class="row justify-center q-mt-md">
    <span class="text-h4">Route "{{ path }}" Not Found </span>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const path = computed(() => route.path);
</script>
