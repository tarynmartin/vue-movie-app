<script setup>
// need to import card component
// get data on load
import axios from 'axios';
import { ref, watch } from 'vue';
import InputComponent from '../components/input/InputComponent.vue';
import Card from '../components/Card/Card.vue';

const search = ref('');
const releases = ref([]);

watch(search, async() => {
  const updatedParams = { params: {
      endpoint: '',
      query: '',
    }}

  if (!search.value) {
    updatedParams.params.endpoint = 'releases/';
  } else {
    updatedParams.params.endpoint = `search/'`;
    updatedParams.params.query = new URLSearchParams({ search_value: search.value }).toString();
  }

  try {
    const response = await axios.get('http://localhost:5000', updatedParams );

    releases.value = response.data.releases;
  } catch (e) {
    console.error('error', e);
  }
    
}, { immediate: true })
</script>

<template>
  <div>
    <InputComponent placeholder="Search..." v-model="search"/>
  <div class="cardsContainer">
    <Card v-for="release in releases" :key="release.id" :data="release" />
  </div>
  </div>
</template>

<style scoped>
  div {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .cardsContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
