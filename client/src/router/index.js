import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProductView from '../views/ProductView.vue';
import ProductViewForCountry from '../views/ProductViewForCountry.vue';
import ProductViewForCity from '../views/ProductViewForCity.vue';
import SelectCountry from '../views/SelectCountry.vue';
import StorageOverview from '../views/StorageOverview.vue';
import SitesOverview from '../views/SitesOverview.vue';
import WarehousesOverview from '../views/WarehousesOverview.vue';
import ProducerOverview from '../views/ProducerOverview.vue';
import SlotsOverview from '../views/SlotsOverview.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'producer',
      component: ProducerOverview,
    },
    {
      path: '/products',
      name: 'product',
      component: ProductView,
    },
    {
      path: '/sites',
      name: 'sites',
      component: SitesOverview,
    },

    {
      path: '/warehouses',
      name: 'warehouses',
      component: WarehousesOverview,
    },
    {
      path: '/storage',
      name: 'storageOverview',
      props: true,
      component: StorageOverview,
    },
    {
      path: '/slots',
      name: 'slotsOverview',
      props: true,
      component: SlotsOverview,
    },
    {
      path: '/products/:country',
      name: 'productForCountry',
      props: true,
      component: ProductViewForCountry,
    },
    {
      path: '/products/city/:city',
      name: 'productForCity',
      props: true,
      component: ProductViewForCity,
    },
    {
      path: '/selCountry/:title/:next',
      name: 'selcountry',
      props: true,
      component: SelectCountry,
    },

    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/:pathMatch(.*)',
      name: 'notfound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
});

export default router;
