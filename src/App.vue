<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
const hello = ref('hello');
const params = reactive({
  'post_type' : 'atm-location',
  'search_key' : '',
});

const langs = reactive([
  'en',
  'mm',
])

const lang = ref('en');

const keyword = ref('');
const locations = ref([]);
const results = ref([]);
let debounceTimer;

const searchLocation = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if(keyword.value) {
      results.value = locations.value.filter(location => location.includes(keyword.value));
      console.log(results.value);
    } else {
      results.value = [];
    }
  }, 500);
}

onMounted(() => {
  getLocations();
});

watch(lang, () => {
  getLocations();
})

const getLocations = async () => {
  const res = await axios.post(`https://mab.mabsayyaungchelrun.com/wp-json/dd_mab/v1/filter-location/?lang=${lang.value}&post_type=${params.post_type}&search_key=`);
  console.log(res.data.data.length);
  locations.value = res.data.data;
}
</script>

<template>
  <div>
    {{ hello }}
    <input class="mb-2" type="text" v-model="keyword" @input="searchLocation" >

    <select v-model="lang" class="ms-2">
      <option v-for="lang in langs" :key="lang">{{ lang }}</option>
    </select>
    <div v-for="result in results" :key="result">
      {{ result }}
    </div>
  </div>
</template>