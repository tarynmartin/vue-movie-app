<script setup>
import { useRouter, useRoute } from 'vue-router';
import { formatDate } from '@/helpers.js';
  defineProps({
    data: {
      type: Object,
      required: true,
      default(rawProps) {
        return rawProps.data;
      }
    }
  })

  const router = useRouter();
  const route = useRoute();

  const formatMediaType = (mediaType) => {
    switch(mediaType) {
      case 'movie':
        return 'Movie';
      case 'tv_series':
        return 'TV Series: ';
      case 'tv_miniseries':
        return 'TV Miniseries: ';
      case 'tv_special':
        return 'TV Special';
      case 'short_film':
        return 'Short Film';
      case 'person':
        return 'Person';
      default:
        return 'Unknown';
    }
  }

  const handleCardClick = (data) => {
    // add conditional if it's an actor
    router.push({ name: 'media-details', params: { ...route.query, id: data.id}});
  }

  const checkDate = (date) => {
    // TODO: need to get a date library
    return new Date().toLocaleDateString() > formatDate(date)
  }
</script>

<template>
  <div class="cardContainer" @click=handleCardClick(data)>
    <img v-if=data.poster_url :src=data.poster_url alt="movie poster" class="cardPoster" />
    <img v-else :src="'http://placekitten.com/250/350'" alt="placeholder" class="cardPoster" />
    <h2 class="cardTitle">{{ data.title || data.name }}</h2>
    <div v-if=data.source_release_date>
      <h3 class="cardMediaType">{{ formatMediaType(data.type) }}<span v-if=data.season_number>Season {{ data.season_number }}</span></h3>
      <p v-if="!checkDate(data.source_release_date)" class="cardDate"><span class="cardReleased">Release:</span> {{ formatDate(data.source_release_date) }}</p>
      <p v-else class="mediaAvailable">Available to Watch</p>
    </div>
    <div v-else>
      <h3 class="cardMediaType">{{ data.type ? formatMediaType(data.type) : data.main_profession }}</h3>
      <span v-if=data.year class="cardYear">Year: {{ data.year }}</span>
    </div>
  </div>
</template>

<style scoped>
  .cardContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.15rem;
    margin: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 15px;
    background-color: white;
    color: black;
    width: 16rem;
    justify-content: space-between;
  }

  .cardPoster {
    width: 100%;
    border-radius: 15px;
    margin-bottom: 0.5rem;
  }

  .cardTitle {
    font-size: 1rem;
    margin-bottom: 0.25rem;
    font-weight: 500;
    text-align: center;
  }

  .cardMediaType,
  .cardDate,
  .cardYear {
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
    text-align: center;
  }

  .cardReleased {
    font-weight: 500;
  }

  .mediaAvailable {
    color: darkred;
    font-size: 1rem;
    font-weight: 500;
  }

</style>