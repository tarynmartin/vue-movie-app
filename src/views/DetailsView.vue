<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { formatDate } from '@/helpers.js';

const route = useRoute();
const details = ref({});
const streamingSources = ref({});

// TODO: add error handling, add icons for streaming services, add season listings to tv shows?

watch(route.params.id, async () => {
  const requests = [axios.get('http://localhost:5000', { params: { endpoint: `title/${route.params.id}/details` } }), axios.get('http://localhost:5000', { params: { endpoint: `title/${route.params.id}/sources` } })]
  try {
    const response = await Promise.all(requests);

    details.value = response[0].data;
    // TODO: update based on user's region
    const regionStreamingSources = response[1].data.filter(source => source.region === 'US');

    // if tv_show, get seasons from title/id/seasons/ endpoint
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

    streamingSources.value = splitSources;
  } catch (e) {
    console.error(e);
  }
}, { immediate: true });

const formatHeader = () => {
  if (details.value.type === 'movie') {
    return `${details.value.title}: ${details.value.year}`;
  } else {
    return `${details.value.title}: ${details.value.year} - ${details.value.end_year ? details.value.end_year : 'Present'}`;
  }
}

const showStreamingOptions = () => {
  return Object.keys(streamingSources.value);
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
    <div v-if="Object.values(streamingSources).flat().length">
      <h3 class="detailsSubheader">Streaming Sources</h3>
      <div v-for="source in showStreamingOptions()" :key="source">
        <div v-if="streamingSources[source].length" class="streamingInfo">
          <h4 class="streamingTitle">{{ source }}:</h4>
          <a v-for="streamingOption in streamingSources[source]" :key="streamingOption.source_id" :href=streamingOption.web_url target="_blank" class="streamingLink">{{ formatType(streamingOption.type) }} {{ streamingOption.format }} {{ streamingOption.price ? `($${streamingOption.price})` : ''}}</a>
        </div>
      </div>
    </div>
    <p><span class="detailsSubheader">Synopsis: </span> {{ details.plot_overview }}</p>
    <p><span class="detailsSubheader">Runtime: </span>{{ formatRuntime(details.runtime_minutes) }}</p>
    <p><span class="detailsSubheader">Release Date: </span>{{ formatDate(details.release_date) }}</p>
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
    text-align: center;
  }

  .streamingTitle {
    font-weight: 500;
    text-transform: capitalize;
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