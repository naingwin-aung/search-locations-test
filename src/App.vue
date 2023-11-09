<script setup>
import { onMounted, reactive, ref, watch } from 'vue'

const params = reactive({
  'taxo_name' : 'atm-location',
  'search_key' : '',
});

const langs = reactive([
  'en',
  'mm',
])

const lang = ref('en');
const keyword = ref('');
const locations = ref([]);
const loading = ref(false);
const locationResults = ref([]);
const postTypes = ref([]);

const postParams = reactive({
  'post_type' : 'branch',
  'taxo_name' : 'branch-location'
});

let debounceTimer;
const searchLocation = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if(keyword.value) {
      locationResults.value = locations.value.filter(location => location.includes(keyword.value));
    } else {
      locationResults.value = [];
    }
  }, 500);
}

onMounted(() => {
  getPostType();
  getLocations();
});

watch(lang, () => {
  keyword.value = '';
  locationResults.value = [];
  getLocations();
})

watch(loading, () => {
  if(loading) {
    keyword.value = '';
  }
})

const getLocations = async () => {
  loading.value = true;
  const res = await axios.post(`https://mab.mabsayyaungchelrun.com/wp-json/dd_mab/v1/filter-location/?lang=${lang.value}&taxo_name=${params.taxo_name}&search_key=`);
  console.log(res.data.data.length);
  locations.value = res.data.data;
  loading.value = false;
}

const getPostType = async() => {
  loading.value = true;
  const res = await axios.post(`https://mab.mabsayyaungchelrun.com/wp-json/dd_mab/v1/filter-lists?lang=${lang.value}`)
  postTypes.value = res.data.data;
  loading.value = false;
}

const getPostHandler = async() => {
  locationResults.value = '';
  const res = await axios.post(`https://mab.mabsayyaungchelrun.com/wp-json/dd_mab/v1/search?lang=${lang.value}&post_type=${postParams.post_type}&taxo_name=${postParams.taxo_name}&search_key=${keyword.value}`);
  console.log(res.data.data);
}

const replaceSearchKeyword = (location) => {
  keyword.value = location;
}

const getPostTypeAndTaxoName = (postType, taxoName) => {
  postParams.post_type = postType;
  postParams.taxo_name = taxoName;
}

</script>

<template>
  <div>
    {{ postParams.post_type }} {{ postParams.taxo_name }}
    <div v-for="(taxo_name, postType) in postTypes" :key="taxo_name" class="d-inline">
        <input type="radio" :id="postType" name="post_type" :value="taxo_name.tax" :checked="taxo_name.tax === postParams.taxo_name" @input="getPostTypeAndTaxoName(postType, taxo_name.tax)">
        <label :for="postType">{{ taxo_name.label }}</label>
    </div>

    <div class="mt-1">
      <input class="mb-2" type="text" v-model="keyword" @input="searchLocation" :disabled="loading">
      <select v-model="lang" class="ms-2">
        <option v-for="lang in langs" :key="lang">{{ lang }}</option>
      </select>
      
      <button class="ms-2" @click="getPostHandler">
        search
      </button>
    </div>

    <div v-if="loading">
      Loading........
    </div>
    <div v-else class="w-50">
      <div v-for="result in locationResults" :key="result">
        <div @click="replaceSearchKeyword(result)" class="card mb-1 text-center cursor">
          {{ result }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .card {
    border: 1px solid darkgray;
    padding: 10px;
    border-radius: 4px;
  }

  .w-50 {
    width: 200px;
  }

  .text-center {
    text-align: center;
  }

  .cursor {
    cursor: pointer;
  }

  .d-inline {
    display: inline;
  }
</style>