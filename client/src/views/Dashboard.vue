<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';
import ConnectionManager from '@/views/socket/ConnectionManager.vue';
import ConnectionState from '@/views/socket/ConnectionState.vue';

const { isDarkTheme } = useLayout();

const products = ref(null);
const lineOptions = ref(null);
const productService = new ProductService();

onMounted(() => {
  productService.getProductsSmall().then((data) => (products.value = data));
});

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
const applyLightTheme = () => {
  lineOptions.value = {
    plugins: {
      legend: {
        labels: {
          color: '#495057',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#495057',
        },
        grid: {
          color: '#ebedef',
        },
      },
      y: {
        ticks: {
          color: '#495057',
        },
        grid: {
          color: '#ebedef',
        },
      },
    },
  };
};

const applyDarkTheme = () => {
  lineOptions.value = {
    plugins: {
      legend: {
        labels: {
          color: '#ebedef',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#ebedef',
        },
        grid: {
          color: 'rgba(160, 167, 181, .3)',
        },
      },
      y: {
        ticks: {
          color: '#ebedef',
        },
        grid: {
          color: 'rgba(160, 167, 181, .3)',
        },
      },
    },
  };
};

watch(
  isDarkTheme,
  (val) => {
    if (val) {
      applyDarkTheme();
    } else {
      applyLightTheme();
    }
  },
  { immediate: true }
);
</script>

<template>
  <connection-manager></connection-manager>
  <connection-state></connection-state>
  <div class="flex flex-wrap align-items-stretch gap-3">
    <!-- Orders Card -->
    <div class="card p-3 border-round shadow-1 flex-grow-0 mb-3" style="min-width:250px; max-width:300px;">
      <div class="flex justify-content-between mb-3">
        <div>
          <span class="block text-500 font-medium mb-3">Orders</span>
          <div class="text-900 font-medium text-xl">152</div>
        </div>
        <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
          <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
        </div>
      </div>
      <span class="text-green-500 font-medium">24 new </span>
      <span class="text-500">since last visit</span>
    </div>

    <!-- Revenue Card -->
    <div class="card p-3 border-round shadow-1 flex-grow-0 mb-3" style="min-width:250px; max-width:300px;">
      <div class="flex justify-content-between mb-3">
        <div>
          <span class="block text-500 font-medium mb-3">Revenue</span>
          <div class="text-900 font-medium text-xl">$2,100</div>
        </div>
        <div class="flex align-items-center justify-content-center bg-orange-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
          <i class="pi pi-map-marker text-orange-500 text-xl"></i>
        </div>
      </div>
      <span class="text-green-500 font-medium">+52% </span>
      <span class="text-500">since last week</span>
    </div>

    <!-- Customers Card -->
    <div class="card p-3 border-round shadow-1 flex-grow-0 mb-3" style="min-width:250px; max-width:300px;">
      <div class="flex justify-content-between mb-3">
        <div>
          <span class="block text-500 font-medium mb-3">Customers</span>
          <div class="text-900 font-medium text-xl">28,441</div>
        </div>
        <div class="flex align-items-center justify-content-center bg-cyan-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
          <i class="pi pi-inbox text-cyan-500 text-xl"></i>
        </div>
      </div>
      <span class="text-green-500 font-medium">520 </span>
      <span class="text-500">newly registered</span>
    </div>

    <!-- Comments Card -->
    <div class="card p-3 border-round shadow-1 flex-grow-0 mb-3" style="min-width:250px; max-width:300px;">
      <div class="flex justify-content-between mb-3">
        <div>
          <span class="block text-500 font-medium mb-3">Comments</span>
          <div class="text-900 font-medium text-xl">152 Unread</div>
        </div>
        <div class="flex align-items-center justify-content-center bg-purple-100 border-round"
            style="width: 2.5rem; height: 2.5rem">
          <i class="pi pi-comment text-purple-500 text-xl"></i>
        </div>
      </div>
      <span class="text-green-500 font-medium">85 </span>
      <span class="text-500">responded</span>
    </div>
  </div>
</template>
