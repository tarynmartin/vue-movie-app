<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const details = ref({});
const streamingSources = ref({});

// TODO: add error handling, add icons for streaming services, icons for streaming sources, add season listings to tv shows?

watch(route.params.id, async () => {
  const requests = [axios.get('http://localhost:5000', { params: { endpoint: `title/${route.params.id}/details` } }), axios.get('http://localhost:5000', { params: { endpoint: `title/${route.params.id}/sources` } })]
  try {
    const response = await Promise.all(requests);

    details.value = response[0].data;
    // TODO: update based on user's region
    const regionStreamingSources = response[1].data.filter(source => source.region === 'US');

    console.log(response[0].data)
    // if tv_show, get seasons from title/id/seasons/ endpoint

    const splitSources = regionStreamingSources.reduce((acc, source) => {
      if (source.type === 'free') {
        acc.free.push(source);
      } else if (source.type === 'buy') {
        if (source.format === 'HD') {
          acc.buyHD.push(source);
        } else {
          acc.buy.push(source);
        }
      } else if (source.type === 'rent') {
        acc.rent.push(source);
      } else {
        acc.stream.push(source);
      }
      return acc;
    }, { free: [], buy: [], buyHD: [], rent: [], stream: [] });

    streamingSources.value = splitSources;
  } catch (e) {
    console.error(e);
  }
}, { immediate: true });

const formatHeader = () => {
  if (details.value.type === 'movie') {
    return `${details.value.title}: ${details.value.year}`;
  } else {
    return `${details.value.title}: (${details.value.year}) - ${details.value.end_year ? details.value.end_year : 'Present'}`;
  }

}
</script>

<template>
  <div class="detailsContainer">
    <h2 class="detailsTitle">{{ formatHeader() }}</h2>
    <img v-if=details.poster :src=details.poster alt="movie poster" class="mediaPoster" />
    <img v-else :src="'http://placekitten.com/250/350'" alt="placeholder" class="cardPoster" />
    <div v-if="Object.values(streamingSources).flat().length">
      <h3 class="detailsSubheader">Streaming Sources</h3>
      <!-- REFACTOR, can be dynamic -->
      <div v-if="streamingSources.free.length" class="streamingInfo">
        <p>Free:</p>
        <a v-for="source in streamingSources.free" :key="source.id" :href=source.web_url target="_blank">{{ source.name }}</a>
      </div>
      <div v-if="streamingSources.stream.length" class="streamingInfo">
        <p>Stream:</p>
        <a v-for="source in streamingSources.stream" :key="source.id" :href=source.web_url target="_blank">{{ source.name }}</a>
      </div>
      <div v-if="streamingSources.buy.length" class="streamingInfo">
        <p>Buy SD:</p>
        <a v-for="source in streamingSources.buy" :key="source.id" :href=source.web_url target="_blank">{{ source.name }}</a>
      </div>
      <div v-if="streamingSources.buyHD.length" class="streamingInfo">
        <p>Buy HD:</p>
        <a v-for="source in streamingSources.buyHD" :key="source.id" :href=source.web_url target="_blank">{{ source.name }}</a>
      </div>
      <div v-if="streamingSources.rent.length" class="streamingInfo">
        <p>Rent:</p>
        <a v-for="source in streamingSources.rent" :key="source.id" :href=source.web_url target="_blank">{{ source.name }}</a>
      </div>
    </div>
    <p><span class="detailsSubheader">Synopsis: </span> {{ details.plot_overview }}</p>
    <p><span class="detailsSubheader">Runtime: </span>{{ details.runtime_minutes }} minutes</p>
    <p><span class="detailsSubheader">Release Date: </span>{{ details.release_date }}</p>
    <p><span class="detailsSubheader">Genres: </span><span v-for="(genre, index) in details.genre_names" :key="genre">{{ genre }}{{ index < (details.genre_names.length - 1) ? ', ' : '' }}</span></p>
  </div>
</template>

<style scoped>
  .detailsContainer {
    width:50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .detailsTitle {
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
  }

  .detailsSubheader {
    font-weight: 600;
  }

  .streamingInfo {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }

  .mediaPoster {
    width: 100%;
    border-radius: 15px;
    margin-bottom: 0.5rem;
    height: 350px;
    width: 250px;
  }
</style>