<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import state from '../state';
import Card from '../components/Card.vue';

const catalogData = ref([]);
const route = useRoute();
const router = useRouter();

const loadData = () => {
  if (route.path === '/pr-deployments') {
    catalogData.value = state.prCatalog;
  } else if (route.path === '/tag-deployments') {
    catalogData.value = state.tagCatalog;
  }
};

const goBack = () => {
  router.push('/');
};

onMounted(loadData);
</script>

<template>
  <div>
    <h1 class="title has-text-centered has-text-white mt-6">
      {{ route.name === 'prDeployments' ? 'PR' : 'Tag' }} Deployments
    </h1>
    <div class="back-arrow mb-5" @click="goBack">← Back</div>
    <div class="container">
      <div class="columns is-multiline">
        <div v-for="build in catalogData" :key="build" class="column is-one-quarter">
          <Card :name="build" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.back-arrow {
  cursor: pointer;
  font-size: 1.5rem;
  margin: 1rem;
  color: #fff;
}

.back-arrow:hover {
  text-decoration: underline;
}
</style>
