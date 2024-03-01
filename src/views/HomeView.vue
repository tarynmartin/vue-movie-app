<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';
import InputComponent from '../components/input/InputComponent.vue';
import Card from '../components/Card/Card.vue';

const search = ref('');
const releases = ref([]);
const people = ref([]);
const titles = ref([]);

watch(search, async() => {
  const updatedParams = { params: {
      endpoint: '',
      query: '',
    }}

  releases.value = [];
  titles.value = [];
  people.value = [];

  if (!search.value) {
    updatedParams.params.endpoint = 'releases/';
  } else {
    updatedParams.params.endpoint = `search/'`;
    updatedParams.params.query = new URLSearchParams({ search_field: 'name', search_value: search.value }).toString();
  }

  try {
    const response = await axios.get('http://localhost:5000', updatedParams );

    if (search.value) {
      if (response.data.people_results) {
        people.value = response.data.people_results;
      } 
      if (response.data.title_results) {
        titles.value = response.data.title_results;
      }
    } else {
      releases.value = response.data.releases;
    }

    /* 
      the below code is to add additional information to cards when a user searches for something; quickly exceeds API rate limit
    */
    // let peopleResponses = [];
    // let titleResponses = [];
    // 
    // if (search.value) {
    //   if (response.data.people_results) {
    //     const peopleRequests = [];

    //     response.data.people_results.forEach(person => {
    //       peopleRequests.push(axios.get('http://localhost:5000/', { params: { endpoint: `person/${person.id}` }} ));
    //     });

    //     peopleResponses = await Promise.all(peopleRequests);
    //   } 
    //   if (response.data.title_results) {
    //     const titleRequests = [];

    //     response.data.title_results.forEach(title => {
    //       titleRequests.push(axios.get('http://localhost:5000', { params: { endpoint: `title/${title.id}/details` }}));
    //     });

    //     titleResponses = await Promise.all(titleRequests);
    //   }
    // } else {
    //   releases.value = response.data.releases;
    // }
  } catch (e) {
    console.error('error', e);
  }
    
}, { immediate: true })
</script>

<template>
  <div class="homeview">
    <InputComponent placeholder="Search..." v-model="search" />
    <div v-if="releases?.length">
      <h2 class="sectionTitle">Current Releases</h2>
      <div class="cardsContainer">
      <Card v-for="release in releases" :key="release.id" :data="release" />
    </div>
    </div>
    <div v-if="titles?.length" >
      <h2 class="sectionTitle">Titles</h2>
      <div class="cardsContainer">
        <Card v-for="title in titles" :key="title.id" :data="title" />
      </div>
    </div>
    <div v-if="people?.length">
      <h2 class="sectionTitle">People</h2>
      <div class="cardsContainer">
        <Card v-for="person in people" :key="person.id" :data="person" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .homeview {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .cardsContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .sectionTitle {
    padding-left: 2.25rem;
    font-weight: 600;
    text-align: left;
  }
</style>
