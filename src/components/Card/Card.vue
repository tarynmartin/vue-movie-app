<script setup>
  defineProps({
    data: {
      type: Object,
      required: true,
      default(rawProps) {
        return rawProps.data;
      }
    }
  })

  // update the date format based on the user's region
  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  }

  const formatMediaType = (mediaType) => {
    switch(mediaType) {
      case 'movie':
        return 'Movie';
      case 'tv_series':
        return 'TV Series: ';
      case 'tv_miniseries':
        return 'TV Miniseries';
      case 'tv_special':
        return 'TV Special';
      case 'short_film':
        return 'Short Film';
      default:
        return 'Unknown';
    }
  }
</script>

<template>
  <div class="cardContainer">
    <img v-if=data.poster_url :src=data.poster_url alt="movie poster" class="cardPoster" />
    <img v-else :src="'@/assets/placeholder.png'" alt="placeholder" class="cardPoster" />
    <h1 class="cardTitle">{{ data.title }}</h1>
    <h2 class="cardMediaType">{{ formatMediaType(data.type) }}<span v-if="data.season_number">Season {{ data.season_number }}</span></h2>
    <p class="cardDate"><span class="cardReleased">Release:</span> {{ formatDate(data.source_release_date) }}</p>
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

  .cardMediaType {
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
    text-align: center;
  }

  .cardReleased {
    font-weight: 500;
  }

  .cardDate {
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
    text-align: center;
  }

</style>