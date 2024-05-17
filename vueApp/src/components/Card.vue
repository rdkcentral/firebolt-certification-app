<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  name: String,
  isPage: Boolean,
});

const router = useRouter();

const navigateToPage = () => {
  if (props.name == 'PR Catalog') {
    router.push(`/pr-deployments`);
  } else {
    router.push('/tag-deployments');
  }
};

</script>

<template>
  <div
    v-if="isPage"
    class="card-link card has-text-centered no-border-radius"
    @click="navigateToPage"
  >
    <div class="card-content">
      <p class="title is-4">{{ props.name }}</p>
    </div>
  </div>
  <a
    v-else
    target="_blank"
    :href="`https://rdkcentral.github.io/firebolt-certification-app/${props.name}/index.html`"
    class="card-link"
  >
    <div class="card has-text-centered no-border-radius">
      <div class="card-content">
        <p class="title is-4">{{ props.name.toUpperCase() }}</p>
      </div>
    </div>
  </a>
</template>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
}

.card {
  transition: transform 0.2s;
  min-width: 200px;
}

.card:hover {
  transform: scale(1.05);
}

.no-border-radius {
  border-radius: 0 !important;
}
</style>
