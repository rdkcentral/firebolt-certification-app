<script setup>
import { onMounted } from 'vue';
import axios from 'axios';
import state from '../state';
import Card from '../components/Card.vue';
</script>

<template>
  <h1 class="title has-text-centered has-text-white my-6">FCA Open-Source Catalog</h1>
  <div class="container">
    <!-- Prod/Edge Row -->
    <div class="columns is-multiline">
      <div v-for="build in state.standardCatalog" :key="build" class="column is-one-quarter">
        <Card :name="build" />
      </div>
    </div>

    <!-- PR Row -->
    <div v-if="state.prCatalog.length > 0" class="columns mt-5">
      <div class="column is-one-quarter">
        <Card :name="'PR Catalog'" :isPage="true" />
      </div>
    </div>

    <!-- Tag Row -->
    <div v-if="state.tagCatalog.length > 0" class="columns mt-5">
      <div class="column is-one-quarter">
        <Card :name="'Tag Catalog'" :isPage="true" />
      </div>
    </div>
  </div>
</template>
