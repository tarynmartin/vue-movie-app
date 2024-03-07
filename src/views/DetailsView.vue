<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { formatDate } from '@/helpers.js';

const route = useRoute();
const details = ref({});
const streamingSources = ref({});
const seasons = ref([]);

// TODO: add error handling, add icons for streaming services

watch(route.params.id, async () => {
  const requests = [axios.get('http://localhost:5000', { params: { endpoint: `title/${route.params.id}/details` } }), axios.get('http://localhost:5000', { params: { endpoint: `title/${route.params.id}/sources` } })]
  try {
    const response = await Promise.all(requests);

    if (response[0].data.type.includes('tv')) {
      getSeasons()
    }

    // TODO: update based on user's region
    const regionStreamingSources = response[1].data.filter(source => source.region === 'US');

    const splitSources = regionStreamingSources.reduce((acc, source) => {
      if (!acc[source.name]) {
        acc[source.name] = [source];
      } else {
        const findDuplicates = acc[source.name].find(item => item.format === source.format);
        if (!findDuplicates)
          acc[source.name].push(source);
      }
      return acc;
    }, {});

    details.value = response[0].data;
    streamingSources.value = splitSources;
  } catch (e) {
    console.error(e);
  }
}, { immediate: true });

const getSeasons = async () => {
  try {
    const tvSeasons = await axios.get('http://localhost:5000', { params: { endpoint: `title/${route.params.id}/seasons` } });

    seasons.value = tvSeasons.data;
  } catch (e) {
    console.error(e);
  }
}

const formatHeader = () => {
  if (details.value.type === 'movie') {
    return `${details.value.title}: ${details.value.year}`;
  } else {
    return `${details.value.title}: ${details.value.year} - ${details.value.end_year ? details.value.end_year : 'Present'}`;
  }
}

const formatRuntime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${ hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : ''} ${remainingMinutes} minutes`;
}

const formatType = (type) => {
  if (type === 'sub') {
    return '';
  } else if (type === 'tve') {
    return 'TV App'
  }
  return type;
}
</script>

<template>
  <div class="detailsContainer">
    <h2 class="detailsTitle">{{ formatHeader() }}</h2>
    <img v-if=details.poster :src=details.poster alt="movie poster" class="mediaPoster" />
    <img v-else :src="'http://placekitten.com/250/350'" alt="placeholder" class="cardPoster" />
    <div v-if="seasons.length">
      <!-- TODO: add link for each season to get season & episode info -->
      <span v-for="(season, index) in seasons" :key="season.id">{{ `${season.name}${index < seasons.length - 1 ? ', ' : ''}` }}</span>
    </div>
    <div v-if="Object.values(streamingSources).flat().length">
      <h3 class="detailsSubheader">Streaming Sources</h3>
      <div class="streamingContainer">
        <div v-for="source in Object.keys(streamingSources)" :key="source" >
          <div v-if="streamingSources[source].length" class="streamingInfo">
            <h4 class="streamingTitle">{{ source }}:</h4>
            <a v-for="streamingOption in streamingSources[source]" :key="streamingOption.source_id" :href=streamingOption.web_url target="_blank" class="streamingLink">{{ formatType(streamingOption.type) }} {{ streamingOption.format }} {{ streamingOption.price ? `($${streamingOption.price})` : ''}}</a>
          </div>
        </div>
      </div>
    </div>
    <div v-if="details?.plot_overview"><span class="detailsSubheader">Synopsis: </span> {{ details.plot_overview }}</div>
    <div v-if="details?.runtime_minutes"><span class="detailsSubheader">Runtime: </span>{{ formatRuntime(details.runtime_minutes) }}</div>
    <div v-if="details?.release_date"><span class="detailsSubheader">Release Date: </span>{{ formatDate(details.release_date) }}</div>
    <div v-if="details?.genre_names?.length"><span class="detailsSubheader">Genres: </span><span v-for="(genre, index) in details.genre_names" :key="genre">{{ genre }}{{ index < (details.genre_names.length - 1) ? ', ' : '' }}</span></div>
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
    text-align: center;
  }

  .streamingTitle {
    font-weight: 500;
    text-transform: capitalize;
  }

  .streamingContainer {
    display: flex;
    flex-flow: wrap;
    /* align-items: center; */
    gap: 0.5rem;
  }

  .streamingInfo {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }

  .streamingLink {
    text-transform: capitalize;
  }

  .mediaPoster {
    width: 100%;
    border-radius: 15px;
    margin-bottom: 0.5rem;
    height: 350px;
    width: 250px;
  }
</style>