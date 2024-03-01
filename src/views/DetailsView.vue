<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const details = ref({});

watch(route.params.id, async () => {
  try {
    const response = axios.get('http://localhost:5000', { params: { endpoint: `title/${route.params.id}/details` } })

    console.log('response', response.data)
  } catch (e) {
    console.error(e);
  }
}, { immediate: true });
</script>