<script setup>
defineProps({
  placeholder: {
    type: String,
    required: true
  }
})
const searchString = defineModel();
</script>

<template>
  <div>
    <input type="text" :placeholder="placeholder" :aria-label="placeholder" v-model="searchString" />
  </div>
</template>

<style scoped>
  div {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }

  div > label {
    display: block;
    margin-bottom: 0.5rem;
  }

  div > input {
    width: 100%;
    height: 2rem;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 15px;
  }
</style>
