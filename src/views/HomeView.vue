<script setup>
// need to import card component
// get data on load
import InputComponent from '../components/input/InputComponent.vue'
import { ref } from 'vue'

const search = ref('');
</script>

<template>
  <InputComponent placeholder="Search..." v-model="search"/>
    <!-- <card /> -->
</template>

<style scoped>

</style>
