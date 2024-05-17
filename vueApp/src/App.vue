<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import state from './state';
import { getCatalogData, filterCatalogData } from './services/dataService';

onMounted(async () => {
  const dataArr = await getCatalogData();
  const { standardBuilds, prBuilds, tagBuilds } = filterCatalogData(dataArr);

  // Set state
  state.standardCatalog = standardBuilds;
  state.prCatalog = prBuilds;
  state.tagCatalog = tagBuilds;
});
</script>

<template>
  <Router-View />
</template>
