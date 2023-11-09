<script setup>
import { onMounted, reactive, ref, watch } from 'vue'

const postParams = reactive({
  'post_type': 'branch',
  'taxo_name': 'branch-location'
});

const params = reactive({
  'taxo_name': postParams.taxo_name,
  'search_key': '',
});

const langs = reactive([
  'en',
  'mm',
])

const lang = ref('en');
const keyword = ref('');
const locations = ref([]);
const loading = ref(false);
const postLoading = ref(false);
const postTypes = ref([]);
const locationResults = ref([]);
const postResults = ref([]);

let debounceTimer;
const searchLocation = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (keyword.value) {
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
  if (loading) {
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

const getPostType = async () => {
  loading.value = true;
  const res = await axios.post(`https://mab.mabsayyaungchelrun.com/wp-json/dd_mab/v1/filter-lists?lang=${lang.value}`)
  postTypes.value = res.data.data;
  loading.value = false;
}

const getPostHandler = async () => {
  postLoading.value = true;
  locationResults.value = [];
  const res = await axios.post(`https://mab.mabsayyaungchelrun.com/wp-json/dd_mab/v1/search?lang=${lang.value}&post_type=${postParams.post_type}&taxo_name=${postParams.taxo_name}&search_key=${keyword.value}`);
  console.log(res.data.data);
  postResults.value = res.data.data;
  postLoading.value = false;
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
    <!-- <div v-for="(taxo_name, postType) in postTypes" :key="taxo_name" class="d-inline">
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
        <div v-if="locationResults && locationResults.length">
          <div v-for="result in locationResults" :key="result">
            <div @click="replaceSearchKeyword(result)" class="card mb-1 text-center cursor">
              {{ result }}
            </div>
          </div>
        </div>
        <div v-else>
          Empty
        </div>
      </div>

      <div v-if="postLoading">
        Loading.....
      </div>
      <div v-else class="w-50">
        <div v-if="postResults && postResults.length">
          <h2>Post</h2>
          <div v-for="postResult in postResults" :key="postResult" class="card mb-1 text-center">
            {{ postResult.title }}
          </div>
        </div>
        <div v-else>
          Empty
        </div>
      </div> -->
    <div class="container">
      <div class="mt-5">
        <div class="row d-flex justify-content-center">
          <div class="col-12 col-md-6">
            <div class="d-flex">
              <!-- serach icon -->
              <div class="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <mask id="mask0_6977_3084" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24"
                    height="24">
                    <rect width="24" height="24" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_6977_3084)">
                    <path
                      d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z"
                      fill="#4A4C4F" />
                  </g>
                </svg>
              </div>

              <input type="text" class="form-input">

              <div class="close-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <mask id="mask0_6977_3087" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24"
                    height="24">
                    <rect width="24" height="24" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_6977_3087)">
                    <path
                      d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                      fill="#62656A" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor {
  cursor: pointer;
}

.form-input {
  display: block;
  width: 100%;
  height: 60px;
  border: 1px solid darkgray;
  font-size: 21px;
  outline: none;
  border-left: none;
  border-right: none;
}

.search-icon {
  width: 75px;
  border: 1px solid darkgray;
  border-top-left-radius: 100%;
  border-bottom-left-radius: 100%;
  border-right: none;
  padding-top: 15px;
  text-align: center;
}

.close-icon {
  width: 75px;
  border: 1px solid darkgray;
  border-top-right-radius: 100%;
  border-bottom-right-radius: 100%;
  border-left: none;
  padding-top: 15px;
  text-align: center;
}</style>