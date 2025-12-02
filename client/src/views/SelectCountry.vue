<template>
 <div class="column items-center q-mt-md">
    <h3>{{ title }}</h3>
    <div class="row">
      <div class="col-4" v-for="c of countries" :key="c">
        <q-btn color="accent" :to="linkTo(c)" class="q-ma-sm q-pa-md text-black">
          <q-img class="flagico" :src="getFlagUrl(c.code)" /> {{ c.country }}</q-btn
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { getFlagUrl, countries } from '@/util.js';

const props = defineProps({ next: String, title: String });

// console.log(props);
function linkTo(c) {
  return '/' + props.next + '/' + c.code.toUpperCase();
}
</script>

<style lang="scss" scoped>
.flagico {
  width: 4rem;
  height: 3rem;
  margin-right: 1rem;
}
</style>
