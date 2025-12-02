<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const rightDrawerOpen = ref(false);

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

const menuItems = [
  { to: '/', label: 'Hersteller' },
  { to: '/products', label: 'Produkte' },
  {
    label: 'Lagerhaltung',
    subs: [
      { to: '/sites', label: 'Standorte' },
      { to: '/warehouses', label: 'Warenlager' },
      { to: '/storage', label: 'Lagerräume' },
      { to: '/slots', label: 'Lagerplätze' },
    ],
  },
  { to: '/about', label: 'Impressum' },
];
const route = useRoute();

function isActive(routeIn) {
  console.log(`full path::: ${route.fullPath}`);
  // 'console.log(`is route ?!? ${JSON.stringify(str)}`);

  if (routeIn.to === route.fullPath) {
    if (routeIn.subs) {
      console.log(`full path::: yeah`);
      return true;
    }
  }
  return false;
}
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="@/assets/FreFruapp-1v0.svg" />
          </q-avatar>
          FreFru App
        </q-toolbar-title>

        <q-btn class="lt-md" dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>

      <q-tabs align="left" class="gt-sm">
        <template v-for="mi of menuItems" :key="mi.to">
          <q-route-tab v-if="!mi.subs" :to="mi.to" :label="mi.label"></q-route-tab>
          <q-route-tab v-else :label="mi.label">
            <q-menu auto-close transition-show="jump-down" transition-hide="jump-up">
              <q-list>
                <q-item v-for="mis of mi.subs" :key="mis.to" clickable :to="mis.to">
                  <q-item-section>{{ mis.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-route-tab>
        </template>

        <!-- <q-route-tab v-for="mi of menuItems" :key="mi.to" :to="mi.to" :label="mi.label">
          
          <q-menu auto-close transition-show="jump-down" transition-hide="jump-up">
          
            <q-list style="min-width: 100px">
              <q-item clickable>
                <q-item-section>New tab</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>New incognito tab</q-item-section>
              </q-item>
            </q-list>
          </q-menu>

           <q-tabs v-if="isActive(mi)" align="left" class="gt-sm">
            <q-route-tab v-for="mis of mi.subs" :key="mis.to" :to="mis.to" :label="mis.label" />
          </q-tabs> 
       </q-route-tab> -->
      </q-tabs>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <q-tabs align="right" vertical>
        <template v-for="mi of menuItems" :key="mi.to">
          <q-route-tab v-if="!mi.subs" :to="mi.to" :label="mi.label"></q-route-tab>
          <q-route-tab v-else :label="mi.label">
            <q-menu anchor="top left" self="top right" auto-close transition-show="jump-down" transition-hide="jump-up">
              <q-list>
                <q-item v-for="mis of mi.subs" :key="mis.to" clickable :to="mis.to">
                  <q-item-section>{{ mis.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-route-tab>
        </template>

        <!-- <q-route-tab v-for="mi of menuItems" :key="mi.to" :to="mi.to" :label="mi.label" /> -->
      </q-tabs>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
/* global CSS Classes */

.countryico {
  width: 3rem;
  height: 2rem;
  margin-right: 0.5rem;
}

.thumbnail {
  height: 3rem;
}

@font-face {
  font-family: 'Montserrat';
  src: url('/fonts/Montserrat/Montserrat-Regular.ttf') format('truetype');
}

@font-face {
  font-family: 'Lora';
  src: url('/fonts/Lora/Lora-Regular.ttf') format('truetype');
}

@font-face {
  font-family: 'LibreBodoni';
  src: url('/fonts/LibreBodoni/LibreBodoni-Regular.ttf') format('truetype');
}

* {
  font-family: 'Montserrat';
}
</style>
